import type { BaseWidget } from './BaseWidget'
import type { IFormBuilder } from './IFormBuilder'
import type { ISpec, SchemaDict } from './ISpec'
import type { Widget_group } from './widgets/group/WidgetGroup'

import { type DependencyList, useMemo } from 'react'

import { runWithGlobalForm } from './context/runWithGlobalForm'
import { Model, ModelConfig } from './Model'

export type NoContext = null

/**
 * you need one per project;
 * singleton.
 * allow to inject the proper form config for your specific project.
 * to avoid problem with hot-reload, export an instance from a module directly and use it from there.
 */
export class ModelManager<DOMAIN extends IFormBuilder> {
    //
    _allForms: Map<string, Model> = new Map()
    _allWidgets: Map<string, BaseWidget> = new Map()
    _allWidgetsByType: Map<string, Map<string, BaseWidget>> = new Map()

    getFormByID = (uid: string): Maybe<Model> => {
        return this._allForms.get(uid)
    }

    getWidgetByID = (widgetUID: string): Maybe<BaseWidget> => {
        return this._allWidgets.get(widgetUID)
    }

    /**
     * return all currently instanciated widgets
     * field of a given input type
     */
    getWidgetsByType = <W extends BaseWidget = BaseWidget>(type: string): W[] => {
        const typeStore = this._allWidgetsByType.get(type)
        if (!typeStore) return []
        return Array.from(typeStore.values()) as W[]
    }

    constructor(
        //
        public builderCtor: { new (form: Model<any /* SchemaDict */, DOMAIN>): DOMAIN },
    ) {}

    _builders = new WeakMap<Model, DOMAIN>()

    getBuilder = (form: Model<any, DOMAIN>): DOMAIN => {
        const prev = this._builders.get(form)
        if (prev) return prev
        const builder = new this.builderCtor(form)
        this._builders.set(form, builder)
        return builder
    }

    /** LEGACY API; TYPES ARE COMPLICATED DUE TO MAINTAINING BACKWARD COMPAT */
    fields = <FIELDS extends SchemaDict>(
        buildFn: (form: DOMAIN) => FIELDS,
        modelConfig: ModelConfig<ISpec<Widget_group<FIELDS>>, DOMAIN, NoContext> = { name: 'unnamed' },
    ): Model<ISpec<Widget_group<FIELDS>>, DOMAIN> => {
        const FN = (domain: DOMAIN): ISpec<Widget_group<FIELDS>> => {
            return runWithGlobalForm(domain, () =>
                domain.group({
                    label: false,
                    items: buildFn(domain as DOMAIN),
                    collapsed: false,
                }),
            )
        }
        const form = new Model<ISpec<Widget_group<FIELDS>>, DOMAIN, null>(this, FN, modelConfig, null)
        return form
    }

    /** simple alias to create a new Form */
    form<ROOT extends ISpec>(
        buildFn: (form: DOMAIN) => ROOT,
        modelConfig: ModelConfig<ROOT, DOMAIN, NoContext> = { name: 'unnamed' },
    ): Model<ROOT, DOMAIN> {
        return new Model<ROOT, DOMAIN>(this, buildFn, modelConfig, null)
    }

    /** simple way to defined forms and in react components */
    use<ROOT extends ISpec>(
        ui: (form: DOMAIN) => ROOT,
        formProperties: ModelConfig<ROOT, DOMAIN, NoContext> = { name: 'unnamed' },
        deps: DependencyList = [],
    ): Model<ROOT, DOMAIN> {
        return useMemo(() => {
            return new Model<ROOT, DOMAIN>(this, ui, formProperties, null)
        }, deps)
    }

    formWithContext<ROOT extends ISpec, CONTEXT>(
        buildFn: (form: DOMAIN, context: CONTEXT) => ROOT,
        context: CONTEXT,
        modelConfig: ModelConfig<ROOT, DOMAIN, CONTEXT> = { name: 'unnamed' },
    ): Model<ROOT, DOMAIN> {
        return new Model<ROOT, DOMAIN, CONTEXT>(this, buildFn, modelConfig, context)
    }

    /** simple way to defined forms and in react components */
    useWithContext<ROOT extends ISpec, CONTEXT>(
        buildFn: (form: DOMAIN, context: CONTEXT) => ROOT,
        context: CONTEXT,
        formProperties: ModelConfig<ROOT, DOMAIN, CONTEXT> = { name: 'unnamed' },
        deps: DependencyList = [],
    ): Model<ROOT, DOMAIN> {
        return useMemo(() => {
            return new Model<ROOT, DOMAIN, CONTEXT>(this, buildFn, formProperties, context)
        }, deps)
    }
}
