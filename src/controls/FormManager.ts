import type { SchemaDict } from './Spec'

import { type DependencyList, useMemo } from 'react'

import { Form, FormProperties, IFormBuilder } from './Form'

/**
 * you need one per project;
 * singleton.
 * allow to inject the proper form config for your specific project.
 * to avoid problem with hot-reload, export an instance from a module directly and use it from there.
 */
export class FormManager<MyFormBuilder extends IFormBuilder> {
    constructor(public builderCtor: { new (form: Form<SchemaDict, MyFormBuilder>): MyFormBuilder }) {}

    _builders = new WeakMap<Form, MyFormBuilder>()

    getBuilder = (form: Form<any, any>): MyFormBuilder => {
        const prev = this._builders.get(form)
        if (prev) return prev
        const builder = new this.builderCtor(form)
        this._builders.set(form, builder)
        return builder
    }

    form = <FIELDS extends SchemaDict>(
        //
        ui: (form: MyFormBuilder) => FIELDS,
        formProperties: FormProperties<FIELDS> = { name: 'unnamed' },
    ): Form<FIELDS, MyFormBuilder> => {
        const form = new Form<FIELDS, MyFormBuilder>(this, ui as any /* 🔴 */, formProperties)
        return form
    }

    useForm = <FIELDS extends SchemaDict>(
        //
        ui: (form: MyFormBuilder) => FIELDS,
        formProperties: FormProperties<FIELDS> = { name: 'unnamed' },
        deps: DependencyList = [],
    ): Form<FIELDS, MyFormBuilder> => {
        return useMemo(() => {
            const form = new Form<FIELDS, MyFormBuilder>(this, ui as any /* 🔴 */, formProperties)
            return form
        }, deps)
    }

    /**
     * copy pasted from useForm, with a better name
     * intented to be used as `cushy.forms.use(...)`
     */
    use = <FIELDS extends SchemaDict>(
        //
        ui: (form: MyFormBuilder) => FIELDS,
        formProperties: FormProperties<FIELDS> = { name: 'unnamed' },
        deps: DependencyList = [],
    ): Form<FIELDS, MyFormBuilder> => {
        return useMemo(() => {
            const form = new Form<FIELDS, MyFormBuilder>(this, ui as any /* 🔴 */, formProperties)
            return form
        }, deps)
    }
}
