import type { SchemaDict } from './Spec'

import { Form, FormProperties, IFormBuilder } from './Form'

/**
 * you need one per project;
 * singleton.
 * allow to inject the proper form config for your specific project.
 * to avoid problem with hot-reload, export an instance from a module directly and use it from there.
 */
export class FormManager<MyFormBuilder extends IFormBuilder> {
    constructor(public builderCtor: { new (form: Form<any, MyFormBuilder>): MyFormBuilder }) {}

    _builders = new WeakMap<Form<any, any>, MyFormBuilder>()

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
        formProperties: FormProperties<FIELDS>,
    ): Form<FIELDS, MyFormBuilder> => {
        const form = new Form<FIELDS, MyFormBuilder>(this, ui, formProperties)
        return form
    }
}

// class WidgetModule<Config> {}
//
// class FOO<KnownWidgets> {
//     register<T extends {
//         $type: any;
//         $Widget:any;
//         ctor: ();
//     }>(widget: T): T['$Widget'] {}
// }
