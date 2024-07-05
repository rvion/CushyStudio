import type { Field_group } from '../fields/group/WidgetGroup'
import type { EntityConfig } from './Entity'
import type { EntityId } from './EntityId'
import type { IBuilder } from './IBuilder'
import type { ISchema, SchemaDict } from './ISchema'

import { action, makeObservable } from 'mobx'
import { type DependencyList, useMemo } from 'react'

import { Field } from './Field'
import { Transaction } from './Transaction'

/**
 * you need one, and only one (singleton) per project
 * allow to inject the proper form config for your specific project.
 * to avoid problem with hot-reload, export an instance from a module directly and use it from there.
 */
export class Repository<DOMAIN extends IBuilder = IBuilder> {
    /** only root fields */
    _allEntities: Map<EntityId, Field> = new Map()

    /** all fiels, root or not */
    _allFields: Map<string, Field> = new Map()

    /** all fields by given type */
    _allFieldsByType: Map<string, Map<string, Field>> = new Map()

    getEntityByID(entityId: EntityId): Maybe<Field> {
        return this._allEntities.get(entityId)
    }

    getFieldByID(fieldId: string): Maybe<Field> {
        return this._allFields.get(fieldId)
    }

    /**
     * return all currently instanciated widgets
     * field of a given input type
     */
    getWidgetsByType = <W extends Field = Field>(type: string): W[] => {
        const typeStore = this._allFieldsByType.get(type)
        if (!typeStore) return []
        return Array.from(typeStore.values()) as W[]
    }

    domain: DOMAIN

    constructor(domain: DOMAIN) {
        this.domain = domain
        makeObservable(this, {
            VALMUT: action,
        })
    }

    private tct: Maybe<Transaction> = null
    VALMUT(
        /** mutation to run */
        fn: (transaction: Transaction) => any,

        /**
         * field the mutation is scoped to
         * it is expected the mutation will only touch this field and its children
         * it can't touch anything upward in the tree
         */
        field: Field,

        /** we maintain 3 representation: field/serial/value */
        mode: 'value' | 'serial' | 'none',
    ) {
        // case 1. already in a transaction
        if (this.tct) {
            if (mode === 'value') this.tct.track(field, mode)
            return void fn(this.tct)
        }
        // case 2. new transaction
        else {
            this.tct = new Transaction(this)
            this.tct.track(field, mode)
            fn(this.tct)
            this.tct.commit() // <--- apply the callback once every update is done
            this.tct = null
            return
        }
    }

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
}
