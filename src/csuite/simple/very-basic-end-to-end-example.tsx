import type { Widget_number, Widget_number_config } from '../fields/number/WidgetNumber'
import type { BaseField } from '../model/BaseField'
import type { Entity } from '../model/Entity'
import type { IBuilder } from '../model/IBuilder'
import type { ISchema, SchemaDict } from '../model/ISchema'
import type * as SS from './SimpleAliases'

import { makeAutoObservable, reaction } from 'mobx'

import { Widget_bool, type Widget_bool_config } from '../fields/bool/WidgetBool'
import { Widget_button, type Widget_button_config } from '../fields/button/WidgetButton'
import { Widget_group, type Widget_group_config } from '../fields/group/WidgetGroup'
import { Widget_list, type Widget_list_config } from '../fields/list/WidgetList'
import { Widget_markdown } from '../fields/markdown/WidgetMarkdown'
import { Widget_optional, type Widget_optional_config } from '../fields/optional/WidgetOptional'
import { Widget_selectMany, type Widget_selectMany_config } from '../fields/selectMany/WidgetSelectMany'
import { type BaseSelectEntry, Widget_selectOne, type Widget_selectOne_config } from '../fields/selectOne/WidgetSelectOne'
import { Widget_spacer } from '../fields/spacer/WidgetSpacer'
import { Widget_string, type Widget_string_config } from '../fields/string/WidgetString'
import { Repository } from '../model/EntityManager'
import { SimpleSchema } from './SimpleSchema'

// -------------------------------------------------------------------------------------------
export class BasicBuilder implements IBuilder {
    /** (@internal) DO NOT USE YOURSELF */
    SpecCtor = SimpleSchema

    /** (@internal) don't call this yourself */
    constructor() {
        // public model: Model<ISchema, BasicBuilder>, //
        makeAutoObservable(this, {
            SpecCtor: false,
        })
    }

    email(config: Widget_string_config = {}): SS.SString {
        return new SimpleSchema<Widget_string>('str', { inputType: 'email', ...config })
    }

    string(config: Widget_string_config = {}): SS.SString {
        return new SimpleSchema<Widget_string>('str', config)
    }

    textarea(config: Widget_string_config = {}): SS.SString {
        return new SimpleSchema<Widget_string>('str', { textarea: true, ...config })
    }

    int(config: Omit<Widget_number_config, 'mode'> = {}): SS.SNumber {
        return new SimpleSchema<Widget_number>('number', { mode: 'int', ...config })
    }

    boolean(config: Widget_bool_config = {}): SS.SBool {
        return new SimpleSchema<Widget_bool>('bool', config)
    }

    button<K>(config: Widget_button_config): SS.SButton<K> {
        return new SimpleSchema<Widget_button<K>>('button', config)
    }

    list<const T extends ISchema>(config: Widget_list_config<T>): SS.SList<T> {
        return new SimpleSchema<Widget_list<T>>('list', config)
    }

    selectOneV3<T extends string>(
        p: T[],
        config: Omit<Widget_selectOne_config<BaseSelectEntry<T>>, 'choices'> = {},
    ): SS.SSelectOne_<T> {
        return new SimpleSchema<Widget_selectOne<BaseSelectEntry<T>>>('selectOne', { choices: p.map((id) => ({ id, label: id })), appearance:'tab', ...config }) // prettier-ignore
    }

    selectMany<const T extends BaseSelectEntry>(config: Widget_selectMany_config<T>): SS.SSelectMany<T> {
        return new SimpleSchema<Widget_selectMany<T>>('selectMany', config)
    }

    group<const T extends SchemaDict>(config: Widget_group_config<T> = {}): SS.SGroup<T> {
        return new SimpleSchema<Widget_group<T>>('group', config)
    }

    fields<const T extends SchemaDict>(fields: T, config: Omit<Widget_group_config<T>, 'items'> = {}): SS.SGroup<T> {
        return new SimpleSchema<Widget_group<T>>('group', { items: fields, ...config })
    }

    optional<const T extends ISchema>(p: Widget_optional_config<T>): SS.SOptional<T> {
        return new SimpleSchema<Widget_optional<T>>('optional', p)
    }

    _HYDRATE<T extends ISchema>(
        //
        model: Entity<any>,
        parent: BaseField | null,
        spec: T,
        serial: any | null,
    ): T['$Field'] {
        const w = this.__HYDRATE(model, parent, spec, serial) as T['$Field']
        w.publishValue()
        for (const { expr, effect } of spec.reactions) {
            // 🔴 Need to dispose later
            reaction(
                () => expr(w),
                (arg) => effect(arg, w),
                { fireImmediately: true },
            )
        }
        return w
    }

    /** (@internal); */ _cache: { count: number } = { count: 0 }
    /** (@internal) advanced way to restore form state. used internally */
    private __HYDRATE<T extends ISchema>(
        //
        model: Entity<any>,
        parent: BaseField | null,
        spec: T,
        serial: any | null,
    ): BaseField<any> /* T['$Field'] */ {
        // ensure the serial is compatible
        if (serial != null && serial.type !== spec.type) {
            console.log(`[🔶] INVALID SERIAL (expected: ${spec.type}, got: ${serial.type})`)
            serial = null
        }

        // ensure we receive a valid spec
        if (!(spec instanceof SimpleSchema))
            console.log(`[❌] _HYDRATE received an invalid unmounted widget. This is probably a bug.`)

        const type = spec.type
        const config = spec.config as any /* impossible to propagate union specification in the switch below */
        const spec2 = spec as any

        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (type === 'group') return new Widget_group( model, parent, spec2, serial, model._ROOT ? undefined : (x) => { model._ROOT = x }, ) // prettier-ignore
        if (type === 'optional') return new Widget_optional(model, parent, spec2, serial)
        if (type === 'bool') return new Widget_bool(model, parent, spec2, serial)
        if (type === 'str') return new Widget_string(model, parent, spec2, serial)
        if (type === 'list') return new Widget_list(model, parent, spec2, serial)
        if (type === 'button') return new Widget_button(model, parent, spec2, serial)
        if (type === 'selectOne') return new Widget_selectOne(model, parent, spec2, serial)
        if (type === 'selectMany') return new Widget_selectMany(model, parent, spec2, serial)
        if (type === 'spacer') return new Widget_spacer(model, parent, spec2, serial)
        if (type === 'markdown') return new Widget_markdown(model, parent, spec2, serial)

        console.log(`🔴 unknown widget "${type}" in serial.`)

        return new Widget_markdown(
            model,
            parent,
            new SimpleSchema<Widget_markdown>('markdown', { markdown: `🔴 unknown widget "${type}" in serial.` }),
        )
    }
}

export const BasicModelManager: Repository<BasicBuilder> = new Repository(new BasicBuilder()) //

// Entity
const basicEntity = BasicModelManager.form((ui /* 👈🏻 BasicBuilder */) => {
    const z = ui.int() // Schema<Field_number>  (🕣 SimpleSchema<Widget_number>)

    return ui.fields({
        foo: ui.string(),
        num: ui.int({
            // FieldConfig
            min: 0,
            max: 100,
        }),
        bar: ui.email(),
        baz: ui.string().optional(),
        yolo: ui.selectOneV3([]),
        yala: ui.selectMany({ choices: [] }),
        xxx: ui.string().list(),
        nested: ui.fields({
            zz: ui.string(),
        }),
    })
})

const serial = basicEntity.serial // EntitySerial (🕣 ModelSerial)
const root = basicEntity.root // Field
const rootSchema = root.spec
const value = basicEntity.value // FieldValue
const fooField = root.fields.foo // Field
const fooValue = value.foo // FieldValue ie. string
const fooValue2 = root.fields.foo.value // FieldValue
const fooSchema = fooField.spec // Schema<Field_string> (🕣 ISchema<Widget_string>)
const nestedValue = value.nested // FieldValue
const nestedValue2 = root.fields.nested.value // FieldValue
const fooSerial = fooField.serial // FieldSerial (🕣 Widget_string_serial)
const fooUI = fooField.DefaultHeaderUI // WidgetStringUI
const numField = root.fields.num // Field
const numUI = numField.DefaultHeaderUI // WidgetNumberUI
const numSchema = numField.spec // Schema<Field_number> (🕣 ISchema<Widget_number>)
