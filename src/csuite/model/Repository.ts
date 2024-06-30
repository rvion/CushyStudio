import type { Widget_group } from '../fields/group/WidgetGroup'
import type { BaseField } from './BaseField'
import type { EntityId } from './EntityId'
import type { IBuilder } from './IBuilder'
import type { ISchema, SchemaDict } from './ISchema'

import { type DependencyList, useMemo } from 'react'

import { Entity, ModelConfig } from './Entity'

/**
 * you need one, and only one (singleton) per project
 * allow to inject the proper form config for your specific project.
 * to avoid problem with hot-reload, export an instance from a module directly and use it from there.
 */
export class Repository<DOMAIN extends IBuilder> {
    //
    _allEntities: Map<EntityId, Entity> = new Map()
    _allFields: Map<string, BaseField> = new Map()
    _allFieldsByType: Map<string, Map<string, BaseField>> = new Map()

    getEntityByID = (entityId: EntityId): Maybe<Entity> => {
        return this._allEntities.get(entityId)
    }

    getFieldByID = (fieldId: string): Maybe<BaseField> => {
        return this._allFields.get(fieldId)
    }

    /**
     * return all currently instanciated widgets
     * field of a given input type
     */
    getWidgetsByType = <W extends BaseField = BaseField>(type: string): W[] => {
        const typeStore = this._allFieldsByType.get(type)
        if (!typeStore) return []
        return Array.from(typeStore.values()) as W[]
    }

    domain: DOMAIN
    constructor(domain: DOMAIN) {
        this.domain = domain
    }

    _builders = new WeakMap<Entity, DOMAIN>()

    /** LEGACY API; TYPES ARE COMPLICATED DUE TO MAINTAINING BACKWARD COMPAT */
    fields = <FIELDS extends SchemaDict>(
        schemaExt: (form: DOMAIN) => FIELDS,
        modelConfig: ModelConfig<ISchema<Widget_group<FIELDS>>, DOMAIN> = { name: 'unnamed' },
    ): Entity<ISchema<Widget_group<FIELDS>>, DOMAIN> => {
        const schema = this.domain.group({
            label: false,
            items: schemaExt(this.domain),
            collapsed: false,
        })
        const form = new Entity<ISchema<Widget_group<FIELDS>>, DOMAIN>(this, schema, modelConfig)
        return form
    }

    /** eval schema if it's a function */
    private evalSchema = <SCHEMA extends ISchema>(
        //
        buildFn: SCHEMA | ((form: DOMAIN) => SCHEMA),
    ): SCHEMA => {
        if (typeof buildFn === 'function') {
            return buildFn(this.domain as DOMAIN)
        }
        return buildFn
    }

    /** simple alias to create a new Form */
    entity<SCHEMA extends ISchema>(
        schemaExt: SCHEMA | ((form: DOMAIN) => SCHEMA),
        modelConfig: ModelConfig<SCHEMA, DOMAIN> = {},
    ): Entity<SCHEMA, DOMAIN> {
        const schema = this.evalSchema(schemaExt)
        return new Entity<SCHEMA, DOMAIN>(this, schema, modelConfig)
    }

    /** simple way to defined forms and in react components */
    use<SCHEMA extends ISchema>(
        ui: (form: DOMAIN) => SCHEMA,
        formProperties: ModelConfig<SCHEMA, DOMAIN> = {},
        deps: DependencyList = [],
    ): Entity<SCHEMA, DOMAIN> {
        return useMemo(() => {
            const schema = this.evalSchema(ui)
            return new Entity<SCHEMA, DOMAIN>(this, schema, formProperties)
        }, deps)
    }
}
