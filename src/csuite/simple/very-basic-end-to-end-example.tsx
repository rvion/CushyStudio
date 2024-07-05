// @ts-nocheck

import type { Field_number, Field_number_config } from '../fields/number/WidgetNumber'
import type { Field } from '../model/Field'
import type { IBuilder } from '../model/IBuilder'
import type { ISchema, SchemaDict } from '../model/ISchema'
import type * as SS from './SimpleAliases'

import { makeAutoObservable, reaction } from 'mobx'

import { Field_bool, type Field_bool_config } from '../fields/bool/FieldBool'
import { Field_button, type Field_button_config } from '../fields/button/FieldButton'
import { Field_group, type Field_group_config } from '../fields/group/WidgetGroup'
import { Field_list, type Field_list_config } from '../fields/list/WidgetList'
import { Field_markdown } from '../fields/markdown/WidgetMarkdown'
import { Field_optional, type Field_optional_config } from '../fields/optional/WidgetOptional'
import { Field_selectMany, type Field_selectMany_config } from '../fields/selectMany/WidgetSelectMany'
import { type BaseSelectEntry, Field_selectOne, type Field_selectOne_config } from '../fields/selectOne/WidgetSelectOne'
import { Field_spacer } from '../fields/spacer/WidgetSpacer'
import { Field_string, type Field_string_config } from '../fields/string/WidgetString'
import { Repository } from '../model/Repository'
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

    email(config: Field_string_config = {}): S.SString {
        return new SimpleSchema<Field_string>(Field_string, 'str', { inputType: 'email', ...config })
    }

    string(config: Field_string_config = {}): S.SString {
        return new SimpleSchema<Field_string>('str', config)
    }

    textarea(config: Field_string_config = {}): S.SString {
        return new SimpleSchema<Field_string>('str', { textarea: true, ...config })
    }

    int(config: Omit<Field_number_config, 'mode'> = {}): S.SNumber {
        return new SimpleSchema<Field_number>('number', { mode: 'int', ...config })
    }

    boolean(config: Field_bool_config = {}): S.SBool {
        return new SimpleSchema<Field_bool>('bool', config)
    }

    button<K>(config: Field_button_config): S.SButton<K> {
        return new SimpleSchema<Field_button<K>>('button', config)
    }

    list<const T extends ISchema>(config: Field_list_config<T>): S.SList<T> {
        return new SimpleSchema<Field_list<T>>('list', config)
    }

    selectOneV3<T extends string>(
        p: T[],
        config: Omit<Field_selectOne_config<BaseSelectEntry<T>>, 'choices'> = {},
    ): S.SSelectOne_<T> {
        return new SimpleSchema<Field_selectOne<BaseSelectEntry<T>>>('selectOne', { choices: p.map((id) => ({ id, label: id })), appearance:'tab', ...config }) // prettier-ignore
    }

    selectMany<const T extends BaseSelectEntry>(config: Field_selectMany_config<T>): S.SSelectMany<T> {
        return new SimpleSchema<Field_selectMany<T>>('selectMany', config)
    }

    group<const T extends SchemaDict>(config: Field_group_config<T> = {}): S.SGroup<T> {
        return new SimpleSchema<Field_group<T>>('group', config)
    }

    fields<const T extends SchemaDict>(fields: T, config: Omit<Field_group_config<T>, 'items'> = {}): S.SGroup<T> {
        return new SimpleSchema<Field_group<T>>('group', { items: fields, ...config })
    }

    optional<const T extends ISchema>(p: Field_optional_config<T>): S.SOptional<T> {
        return new SimpleSchema<Field_optional<T>>('optional', p)
    }

    _HYDRATE<T extends ISchema>(
        //
        model: Field<any>,
        parent: Field | null,
        schema: T,
        serial: any | null,
    ): T['$Field'] {
        const w = this.__HYDRATE(model, parent, schema, serial) as T['$Field']
        w.publishValue()
        for (const { expr, effect } of schema.reactions) {
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
        model: Field<any>,
        parent: Field | null,
        spec: T,
        serial: any | null,
    ): Field<any> /* T['$Field'] */ {
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
        if (type === 'group') return new Field_group( model, parent, spec2, serial, model._ROOT ? undefined : (x) => { model._ROOT = x }, ) // prettier-ignore
        if (type === 'optional') return new Field_optional(model, parent, spec2, serial)
        if (type === 'bool') return new Field_bool(model, parent, spec2, serial)
        if (type === 'str') return new Field_string(model, parent, spec2, serial)
        if (type === 'list') return new Field_list(model, parent, spec2, serial)
        if (type === 'button') return new Field_button(model, parent, spec2, serial)
        if (type === 'selectOne') return new Field_selectOne(model, parent, spec2, serial)
        if (type === 'selectMany') return new Field_selectMany(model, parent, spec2, serial)
        if (type === 'spacer') return new Field_spacer(model, parent, spec2, serial)
        if (type === 'markdown') return new Field_markdown(model, parent, spec2, serial)

        console.log(`🔴 unknown widget "${type}" in serial.`)

        return new Field_markdown(
            model,
            parent,
            new SimpleSchema<Field_markdown>('markdown', { markdown: `🔴 unknown widget "${type}" in serial.` }),
        )
    }
}

export const BasicModelManager: Repository<BasicBuilder> = new Repository(new BasicBuilder()) //

// Entity
const basicEntity = BasicModelManager.entity((ui /* 👈🏻 BasicBuilder */) => {
    const z = ui.int() // Schema<Field_number>  (🕣 SimpleSchema<Field_number>)

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
const rootSchema = root.schema
const value = basicEntity.value // FieldValue
const fooField = root.fields.foo // Field
const fooValue = value.foo // FieldValue ie. string
const fooValue2 = root.fields.foo.value // FieldValue
const fooSchema = fooField.schema // Schema<Field_string> (🕣 ISchema<Field_string>)
const nestedValue = value.nested // FieldValue
const nestedValue2 = root.fields.nested.value // FieldValue
const fooSerial = fooField.serial // FieldSerial (🕣 Field_string_serial)
const fooUI = fooField.DefaultHeaderUI // WidgetStringUI
const numField = root.fields.num // Field
const numUI = numField.DefaultHeaderUI // WidgetNumberUI
const numSchema = numField.schema // Schema<Field_number> (🕣 ISchema<Field_number>)
