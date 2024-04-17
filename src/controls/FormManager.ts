import type { IFormBuilder } from './IFormBuilder'
import type { ISpec, SchemaDict } from './ISpec'
import type { Widget_group } from './widgets/group/WidgetGroup'

import { type DependencyList, useMemo } from 'react'

import { Form, FormProperties } from './Form'
import { runWithGlobalForm } from './shared/runWithGlobalForm'

/**
 * you need one per project;
 * singleton.
 * allow to inject the proper form config for your specific project.
 * to avoid problem with hot-reload, export an instance from a module directly and use it from there.
 */
export class FormManager<BUILDER extends IFormBuilder> {
    constructor(
        //
        public builderCtor: { new (form: Form<any /* SchemaDict */, BUILDER>): BUILDER },
    ) {}

    _builders = new WeakMap<Form, BUILDER>()

    getBuilder = (form: Form<any, any>): BUILDER => {
        const prev = this._builders.get(form)
        if (prev) return prev
        const builder = new this.builderCtor(form)
        this._builders.set(form, builder)
        return builder
    }

    /** LEGACY API; TYPES ARE COMPLICATED DUE TO MAINTAINING BACKWARD COMPAT */
    form = <FIELDS extends SchemaDict>(
        ui: (form: BUILDER) => FIELDS,
        formProperties: FormProperties<ISpec<Widget_group<FIELDS>>> = { name: 'unnamed' },
    ): Form<ISpec<Widget_group<FIELDS>>, BUILDER> => {
        const FN = (builder: BUILDER): ISpec<Widget_group<FIELDS>> => {
            return runWithGlobalForm(builder, () =>
                builder.group({
                    label: false,
                    items: ui(builder as BUILDER),
                    topLevel: true,
                    collapsed: false,
                }),
            )
        }
        const form = new Form<ISpec<Widget_group<FIELDS>>, BUILDER>(this, FN, formProperties)
        return form
    }

    /** simple way to defined forms and in react components */
    use = <ROOT extends ISpec>(
        ui: (form: BUILDER) => ROOT,
        formProperties: FormProperties<ROOT> = { name: 'unnamed' },
        deps: DependencyList = [],
    ): Form<ROOT, BUILDER> => {
        return useMemo(() => {
            const form = new Form<ROOT, BUILDER>(this, ui, formProperties)
            return form
        }, deps)
    }
}
