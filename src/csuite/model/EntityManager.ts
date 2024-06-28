import type { Widget_group } from '../fields/group/WidgetGroup'
import type { BaseField } from './BaseField'
import type { IBuilder } from './IBuilder'
import type { ISchema, SchemaDict } from './ISchema'

import { type DependencyList, useMemo } from 'react'

import { Entity, ModelConfig } from './Entity'
import { runWithGlobalForm } from './runWithGlobalForm'

export type NoContext = null

/**
 * you need one, and only one (singleton) per project
 * allow to inject the proper form config for your specific project.
 * to avoid problem with hot-reload, export an instance from a module directly and use it from there.
 */
export class Repository<DOMAIN extends IBuilder> {
    //
    _allForms: Map<string, Entity> = new Map()
    _allWidgets: Map<string, BaseField> = new Map()
    _allWidgetsByType: Map<string, Map<string, BaseField>> = new Map()

    getFormByID = (uid: string): Maybe<Entity> => {
        return this._allForms.get(uid)
    }

    getWidgetByID = (widgetUID: string): Maybe<BaseField> => {
        return this._allWidgets.get(widgetUID)
    }

    /**
     * return all currently instanciated widgets
     * field of a given input type
     */
    getWidgetsByType = <W extends BaseField = BaseField>(type: string): W[] => {
        const typeStore = this._allWidgetsByType.get(type)
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
            return runWithGlobalForm(domain, () =>
                domain.group({
                    label: false,
                    items: buildFn(domain as DOMAIN),
                    collapsed: false,
                }),
            )
        }
        const form = new Entity<ISchema<Widget_group<FIELDS>>, DOMAIN, null>(this, FN, modelConfig, null)
        return form
    }

    /** simple alias to create a new Form */
    form<ROOT extends ISchema>(
        buildFn: (form: DOMAIN) => ROOT,
        modelConfig: ModelConfig<ROOT, DOMAIN, NoContext> = { name: 'unnamed' },
    ): Entity<ROOT, DOMAIN> {
        return new Entity<ROOT, DOMAIN>(this, buildFn, modelConfig, null)
    }

    /** simple way to defined forms and in react components */
    use<ROOT extends ISchema>(
        ui: (form: DOMAIN) => ROOT,
        formProperties: ModelConfig<ROOT, DOMAIN, NoContext> = { name: 'unnamed' },
        deps: DependencyList = [],
    ): Entity<ROOT, DOMAIN> {
        return useMemo(() => {
            return new Entity<ROOT, DOMAIN>(this, ui, formProperties, null)
        }, deps)
    }

    formWithContext<ROOT extends ISchema, CONTEXT>(
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
