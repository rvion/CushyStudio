import type { Field } from './Field'
import type { FieldId } from './FieldId'

import { runInAction } from 'mobx'

import { bang } from '../utils/bang'
import { type FieldTouchMode, Transaction, type TransactionMode } from './Transaction'

/**
 * you need one, and only one (singleton) per project
 * allow to inject the proper form config for your specific project.
 * to avoid problem with hot-reload, export an instance from a module directly and use it from there.
 */
export class Repository {
    constructor() {}
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

    /* 📌 FULL-CLEAR ---------------------------------------------------- */
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
        if (this.allFields.size !== 0) {
            throw new Error(
                `[❌] INVARIANT VIOLATION: allFields should be empty but it's ${this.allFields.size} (${[
                    ...this.allFields.values(),
                ].map((i) => [i.type, i.summary])})`,
            )
        }
        if (this.allRoots.size !== 0)
            throw new Error(
                `[❌] INVARIANT VIOLATION: allRoots should be empty but it's ${this.allRoots.size} (${[
                    ...this.allRoots.values(),
                ].map((i) => [i.type, i.summary])})`,
            )
    }

    /* 📌 STATS --------------------------------------------------------- */
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

    /* 📌 TEMP ---------------------------------------------------------- */
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

    TRANSACT<A>(
        /** serial mutation to run */
        fn: (tct: Transaction) => A,

        /**
         * field the mutation is scoped to
         * it is expected the mutation will only touch this field and its children
         * it can't touch anything upward in the tree
         */
        field: Field,

        /** we maintain 3 representation: 'field', 'serial', 'value', 'create' */
        touchMode: FieldTouchMode,

        /** 🔴 VVV for choices ? so we can use "mutable-actions" method in the ctor */
        _tctMode: TransactionMode,
    ): A {
        return runInAction(() => {
            const isRoot = this.tct == null
            this.tct ??= new Transaction(this /* tctMode */)
            const tct = this.tct
            let OUT: A
            tct.tower.push(field)
            const prevFieldSerial = field.serial

            if (touchMode === 'auto') {
                const prevCreateAndValueBumpCount = tct.bump.create + tct.bump.value
                const prevSerialBumpCount = prevCreateAndValueBumpCount + tct.bump.serial
                OUT = fn(tct)
                const nextCreateAndValueBumpCountBumpCount = tct.bump.create + tct.bump.value
                const nextSerialBumpCount = nextCreateAndValueBumpCountBumpCount + tct.bump.serial

                if (prevCreateAndValueBumpCount !== nextCreateAndValueBumpCountBumpCount) tct.track(field, 'value')
                else if (prevSerialBumpCount !== nextSerialBumpCount) tct.track(field, 'serial')
            } else {
                OUT = fn(tct)
                tct.track(field, touchMode)
            }

            tct.tower.pop()

            const fieldDidChange = field.serial !== prevFieldSerial
            if (fieldDidChange) {
                // TODO: assert the tower is well-formed (only goes down the field tree)
                // now that the transaction is done, we need to bubble the serial update
                // upwards until the closest parent in the tower.
                const stopAt = tct.tower.length > 0 ? tct.tower[tct.tower.length - 1] : undefined
                let at: Maybe<Field> = field
                while (at != null && at !== stopAt) {
                    // console.log(`[🤠] UPDATE serial`, at.pathExt)
                    const didChange = at.parent?._acknowledgeNewChildSerial(at.mountKey, at.serial)
                    if (!didChange) break
                    at = at.parent
                }
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
            return OUT
        })
    }

    /**
     * last known transactions;
     * added to help with testing
     */
    lastTransaction: Maybe<Transaction> = null

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

// REPOSITORY DI -------------------------------------------------------------------------
let globalRepository: Maybe<Repository> = null

// export function registerRepository(repository: Repository): void {
//     // RepositoryDI[name] = repository
//     if (globalRepository == null) {
//         globalRepository = repository
//     } else {
//         throw new Error('Repository already registered')
//     }
// }

export function getGlobalRepository(): Repository {
    globalRepository = globalRepository ||= new Repository()
    return bang(globalRepository)
}
