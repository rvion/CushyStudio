import type { Field_group } from '../fields/group/WidgetGroup'
import type { EntityConfig } from './Entity'
import type { FieldId } from './FieldId'
import type { IBuilder } from './IBuilder'
import type { ISchema, SchemaDict } from './ISchema'

import { action, makeObservable } from 'mobx'
import { type DependencyList, useMemo } from 'react'

import { Field } from './Field'
import { type FieldTouchMode, Transaction, type TransactionMode } from './Transaction'

/**
 * you need one, and only one (singleton) per project
 * allow to inject the proper form config for your specific project.
 * to avoid problem with hot-reload, export an instance from a module directly and use it from there.
 */
export class Repository<DOMAIN extends IBuilder = IBuilder> {
    /* STORE ------------------------------------------------------------ */
    /** all root fields (previously called entities) */
    allRoots: Map<FieldId, Field> = new Map()
    get allRootSize(): number {
        return this.allRoots.size
    }

    /** all fiels, root or not */
    allFields: Map<FieldId, Field> = new Map()
    get allFieldSize(): number {
        return this.allFields.size
    }

    /** all fields by given type */
    allFieldsByType: Map<string, Map<string, Field>> = new Map()

    getEntityByID(entityId: FieldId): Maybe<Field> {
        return this.allRoots.get(entityId)
    }

    getFieldByID(fieldId: FieldId): Maybe<Field> {
        return this.allFields.get(fieldId)
    }

    /* 🔴 FULL-CLEAR ---------------------------------------------------- */
    /**
     * fully clear the entity-map + reset stats
     * @since 2024-07-08
     * @stability unstable
     */
    reset(): void {
        this.resetStats()
        this.resetEntities()
    }

    resetEntities(): void {
        for (const root of this.allRoots.values()) {
            root.disposeTree()
        }
        if (this.allFields.size !== 0) throw new Error(`[🔴] INVARIANT VIOLATION: allFields should be empty`)
        if (this.allRoots.size !== 0) throw new Error(`[🔴] INVARIANT VIOLATION: allRoots should be empty`)
    }

    /* 🔴 STATS --------------------------------------------------------- */
    /** how many transactions have been executed on that repo */
    transactionCount: number = 0
    totalValueTouched: number = 0
    totalSerialTouched: number = 0
    totalCreations: number = 0
    resetStats(): void {
        this.transactionCount = 0
        this.totalValueTouched = 0
        this.totalSerialTouched = 0
        this.totalCreations = 0
    }

    /* 🔴 TEMP ---------------------------------------------------------- */
    private logs: string[] = []
    startRecording(): void {
        this.logs.splice(0, this.logs.length)
    }

    debugLog(msg: string): void {
        this.logs.push(msg)
    }

    endRecording(): string[] {
        // console.log(this.logs.join('\n'))
        return this.logs.slice()
    }

    endRecordingAndLog(): string[] {
        console.log(this.logs.join('\n'))
        return this.logs.slice()
    }

    /* ------------------------------------------------------------------ */
    /**
     * return all currently instanciated widgets
     * field of a given input type
     */
    getWidgetsByType = <W extends Field = Field>(type: string): W[] => {
        const typeStore = this.allFieldsByType.get(type)
        if (!typeStore) return []
        return Array.from(typeStore.values()) as W[]
    }

    domain: DOMAIN

    constructor(
        // VVV 🔴 TODO: remove that
        domain: DOMAIN,
    ) {
        this.domain = domain
        makeObservable(this, {
            TRANSACT: action,
        })
    }

    /**
     * un-register field
     * should ONLY be called by `field.dispose()`
     */
    _unregisterField(field: Field): void {
        // unregister field in `this._allWidgets`
        this.allFields.delete(field.id)
        this.allRoots.delete(field.id)

        // unregister field in `this._allWidgetsByType(<type>)`
        const typeStore = this.allFieldsByType.get(field.type)
        if (typeStore) typeStore.delete(field.id)
    }

    _registerField(field: Field): void {
        // creations
        if (this.allFields.has(field.id)) {
            throw new Error(`[🔴] INVARIANT VIOLATION: field already registered: ${field.id}`)
        }

        // 🔴 🔴 creations
        if (this.tct) {
            this.tct.track(field, 'create')
        }

        if (field.root == field) {
            this.allRoots.set(field.id, field)
        }

        // register field in `this._allWidgets
        this.allFields.set(field.id, field)

        // register field in `this._allWidgetsByType(<type>)
        const prev = this.allFieldsByType.get(field.type)
        if (prev == null) {
            this.allFieldsByType.set(field.type, new Map([[field.id, field]]))
        } else {
            prev.set(field.id, field)
        }
    }

    private tct: Maybe<Transaction> = null

    TRANSACT(
        /** mutation to run */
        fn: (transaction: Transaction) => any,

        /**
         * field the mutation is scoped to
         * it is expected the mutation will only touch this field and its children
         * it can't touch anything upward in the tree
         */
        field: Field,

        /** we maintain 3 representation: field/serial/value */
        touchMode: FieldTouchMode,
        /** 🔴 VVV for choices ? so we can use "mutable-actions" method in the ctor */
        _tctMode: TransactionMode,
    ): void {
        let isRoot = this.tct == null
        this.tct ??= new Transaction(this /* tctMode */)

        if (touchMode === 'auto') {
            const prevValue = this.tct.bump.create + this.tct.bump.value
            const prevSerial = prevValue + this.tct.bump.serial
            void fn(this.tct)
            const nextValue = this.tct.bump.create + this.tct.bump.value
            const nextSerial = nextValue + this.tct.bump.serial

            if (prevValue !== nextValue) this.tct.track(field, 'value')
            else if (prevSerial !== nextSerial) this.tct.track(field, 'serial')
        } else {
            void fn(this.tct)
            this.tct.track(field, touchMode)
        }

        // ONLY COMMIT THE ROOT TRANSACTION
        if (isRoot) {
            // ALTERNATIVE A:
            // | execute the Commit callbacks outside of the transaction
            // | if a callback triggers a change, it will be executed in
            // | new transaction (and trigger onValueChange)
            const tct = this.tct
            this.tct = null
            //  VVV  apply the callback once every update is done, OUTSIDE of the transaction
            tct.commit()
            this.lastTransaction = tct

            // ALTERNATIVE B:
            // | execute the Commit callbacks within the transaction
            // ⏸️          VVV apply the callback once every update is done, INSIDE the transaction
            // ⏸️ this.tct.commit()
            // ⏸️ this.tct = null
        }
    }

    lastTransaction: Maybe<Transaction> = null
    /** LEGACY API; TYPES ARE COMPLICATED DUE TO MAINTAINING BACKWARD COMPAT */
    fields<FIELDS extends SchemaDict>(
        schemaExt: (form: DOMAIN) => FIELDS,
        entityConfig: EntityConfig<ISchema<Field_group<NoInfer<FIELDS>>>> = { name: 'unnamed' },
    ): Field_group<FIELDS> {
        const schema = this.domain.group({
            label: false,
            items: schemaExt(this.domain),
            collapsed: false,
            onSerialChange: entityConfig.onSerialChange,
            onValueChange: entityConfig.onValueChange,
        })
        return schema.instanciate(this, null, null, entityConfig.serial?.())
    }

    /** simple alias to create a new Form */
    entity<SCHEMA extends ISchema>(
        schemaExt: SCHEMA | ((form: DOMAIN) => SCHEMA),
        entityConfig: EntityConfig<NoInfer<SCHEMA>> = {},
    ): SCHEMA['$Field'] {
        let schema: SCHEMA = this.evalSchema(schemaExt)
        if (entityConfig.onSerialChange || entityConfig.onValueChange)
            schema = schema.withConfig({
                onSerialChange: entityConfig.onSerialChange,
                onValueChange: entityConfig.onValueChange,
            })
        return schema.instanciate(this, null, null, entityConfig.serial?.())
    }

    /** simple way to defined forms and in react components */
    use<SCHEMA extends ISchema>(
        schemaExt: (form: DOMAIN) => SCHEMA,
        entityConfig: EntityConfig<NoInfer<SCHEMA>> = {},
        deps: DependencyList = [],
    ): SCHEMA['$Field'] {
        return useMemo(() => this.entity(schemaExt, entityConfig), deps)
    }

    /** eval schema if it's a function */
    private evalSchema<SCHEMA extends ISchema>(buildFn: SCHEMA | ((form: DOMAIN) => SCHEMA)): SCHEMA {
        if (typeof buildFn === 'function') return buildFn(this.domain as DOMAIN)
        return buildFn
    }

    get tracked(): RepositoryStats {
        return {
            transactionCount: this.transactionCount,
            allRootSize: this.allRootSize,
            allFieldSize: this.allFieldSize,
            totalValueTouched: this.totalValueTouched,
            totalSerialTouched: this.totalSerialTouched,
            totalCreations: this.totalCreations,
        }
    }
}

export type RepositoryStats = {
    transactionCount: number
    allRootSize: number
    allFieldSize: number
    totalValueTouched: number
    totalSerialTouched: number
    totalCreations: number
}
