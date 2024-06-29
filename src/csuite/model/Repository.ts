import type { Widget_group } from '../fields/group/WidgetGroup'
import type { BaseField } from './BaseField'
import type { EntityId } from './EntityId'
import type { IBuilder } from './IBuilder'
import type { ISchema, SchemaDict } from './ISchema'

import { type DependencyList, useMemo } from 'react'

import { Entity, ModelConfig } from './Entity'

export type NoContext = null

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
        buildFn: (form: DOMAIN) => FIELDS,
        modelConfig: ModelConfig<ISchema<Widget_group<FIELDS>>, DOMAIN, NoContext> = { name: 'unnamed' },
    ): Entity<ISchema<Widget_group<FIELDS>>, DOMAIN> => {
        const FN = (domain: DOMAIN): ISchema<Widget_group<FIELDS>> => {
            return domain.group({
                label: false,
                items: buildFn(domain as DOMAIN),
                collapsed: false,
            })
        }
        const form = new Entity<ISchema<Widget_group<FIELDS>>, DOMAIN, null>(this, FN, modelConfig, null)
        return form
    }

    /** simple alias to create a new Form */
    entity<SCHEMA extends ISchema>(
        buildFn: (form: DOMAIN) => SCHEMA,
        modelConfig: ModelConfig<SCHEMA, DOMAIN, NoContext> = { name: 'unnamed' },
    ): Entity<SCHEMA, DOMAIN> {
        return new Entity<SCHEMA, DOMAIN>(this, buildFn, modelConfig, null)
    }

    /** simple way to defined forms and in react components */
    use<SCHEMA extends ISchema>(
        ui: (form: DOMAIN) => SCHEMA,
        formProperties: ModelConfig<SCHEMA, DOMAIN, NoContext> = { name: 'unnamed' },
        deps: DependencyList = [],
    ): Entity<SCHEMA, DOMAIN> {
        return useMemo(() => {
            return new Entity<SCHEMA, DOMAIN>(this, ui, formProperties, null)
        }, deps)
    }

    entityWithContext<ROOT extends ISchema, CONTEXT>(
        buildFn: (form: DOMAIN, context: CONTEXT) => ROOT,
        context: CONTEXT,
        modelConfig: ModelConfig<ROOT, DOMAIN, CONTEXT> = { name: 'unnamed' },
    ): Entity<ROOT, DOMAIN> {
        return new Entity<ROOT, DOMAIN, CONTEXT>(this, buildFn, modelConfig, context)
    }

    /** simple way to defined forms and in react components */
    useWithContext<ROOT extends ISchema, CONTEXT>(
        buildFn: (form: DOMAIN, context: CONTEXT) => ROOT,
        context: CONTEXT,
        formProperties: ModelConfig<ROOT, DOMAIN, CONTEXT> = { name: 'unnamed' },
        deps: DependencyList = [],
    ): Entity<ROOT, DOMAIN> {
        return useMemo(() => {
            return new Entity<ROOT, DOMAIN, CONTEXT>(this, buildFn, formProperties, context)
        }, deps)
    }
}
