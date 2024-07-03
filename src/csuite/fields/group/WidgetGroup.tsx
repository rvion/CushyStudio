import type { Field } from '../../model/Field'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema, SchemaDict } from '../../model/ISchema'
import type { Problem_Ext } from '../../model/Validation'

import { runInAction } from 'mobx'

import { Field, type KeyedField } from '../../model/Field'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetGroup_BlockUI, WidgetGroup_LineUI } from './WidgetGroupUI'

// CONFIG
export type Field_group_config<T extends SchemaDict> = FieldConfig<
    {
        /**
         * Lambda function is deprecated, prefer passing the items as an object
         * directly
         */
        items?: T | (() => T)

        /** if provided, will be used in the header when fields are folded */
        summary?: (items: { [k in keyof T]: T[k]['$Value'] }) => string
    },
    Field_group_types<T>
>

// SERIAL
export type Field_group_serial<T extends SchemaDict> = FieldSerial<{
    type: 'group'
    values_: { [K in keyof T]?: T[K]['$Serial'] }
}>

// VALUE
export type Field_group_value<T extends SchemaDict> = {
    [k in keyof T]: T[k]['$Value']
}

// TYPES
export type Field_group_types<T extends SchemaDict> = {
    $Type: 'group'
    $Config: Field_group_config<T>
    $Serial: Field_group_serial<T>
    $Value: Field_group_value<T>
    $Field: Field_group<T>
}

// STATE
export class Field_group<T extends SchemaDict> extends Field<Field_group_types<T>> {
    DefaultHeaderUI = WidgetGroup_LineUI
    get DefaultBodyUI() {
        if (Object.keys(this.fields).length === 0) return
        return WidgetGroup_BlockUI
    }

    get baseErrors(): Problem_Ext {
        return null
    }

    get hasChanges(): boolean {
        return Object.values(this.fields).some((f) => f.hasChanges)
    }
    reset(): void {
        for (const sub of this.subFields) sub.reset()
    }

    get summary(): string {
        return this.config.summary?.(this.value) ?? ''
        // return this.config.summary?.(this.value) ?? Object.keys(this.fields).length + ' fields'
    }

    static readonly type: 'group' = 'group'

    /** all [key,value] pairs */
    get entries() {
        return Object.entries(this.fields) as [string, Field][]
    }

    get numFields(): number {
        return Object.keys(this.fields).length
    }

    get justifyLabel(): boolean {
        if (this.numFields > 1) return false
        return true
    }
    at = <K extends keyof T>(key: K): T[K]['$Field'] => this.fields[key]
    get = <K extends keyof T>(key: K): T[K]['$Value'] => this.fields[key].value

    /** the dict of all child widgets */
    fields: { [k in keyof T]: T[k]['$Field'] } = {} as any // will be filled during constructor

    constructor(
        //
        root: Field | null,
        parent: Field | null,
        schema: ISchema<Field_group<T>>,
        serial?: Field_group_serial<T>,
    ) {
        super(root, parent, schema)
        this.initSerial(serial)
        this.init({
            value: false,
            __value: false,
            DefaultHeaderUI: false,
        })
    }

    /** just here to normalize fieldSchema definitions, since it used to be a lambda */
    private get _fieldSchemas(): [keyof T, ISchema<any>][] {
        const itemsDef = this.config.items
        const fieldSchemas: SchemaDict = typeof itemsDef === 'function' ? itemsDef() ?? {} : itemsDef ?? {}
        return Object.entries(fieldSchemas) as [keyof T, ISchema<any>][]
    }

    protected setOwnSerial(serial: Maybe<Field_group_serial<T>>) {
        if (this.serial.values_ == null) this.serial.values_ = {}

        // we only iterate on the new values => we DON'T WANT to remove the old ones.
        // we keep the old values in case those are just temporarilly removed, or in case
        // those will be lazily added later though global usage
        for (const [fName, fSchema] of this._fieldSchemas) {
            let field = this.fields[fName]
            if (field != null) {
                field.updateSerial(serial?.values_?.[fName])
            } else {
                field = fSchema.instanciate(this.root, this, serial?.values_?.[fName])
                this.fields[fName] = field
                this.serial.values_[fName] = field.serial
            }
        }
    }

    setPartialValue(val: Partial<Field_group_value<T>>) {
        runInAction(() => {
            for (const key in val) this.fields[key].value = val[key]
            this.applyValueUpdateEffects()
        })
    }

    get subFields(): Field[] {
        return Object.values(this.fields)
    }

    get subFieldsWithKeys(): KeyedField[] {
        return Object.entries(this.fields).map(([key, field]) => ({ key, field }))
    }

    get value(): Field_group_value<T> {
        return this.__value
    }

    set value(val: Field_group_value<T>) {
        runInAction(() => {
            for (const key in val) {
                this.fields[key].value = val[key]
            }
            this.applyValueUpdateEffects()
        })
    }

    // @internal
    __value: { [k in keyof T]: T[k]['$Value'] } = new Proxy({} as any, {
        ownKeys: (target) => {
            return Object.keys(this.fields)
        },
        set: (target, prop, value) => {
            if (typeof prop !== 'string') return false
            const subWidget: Field = this.fields[prop]!
            if (subWidget == null) return false
            subWidget.value = value
            return true
        },
        get: (target, prop) => {
            if (typeof prop !== 'string') return
            const subWidget: Field = this.fields[prop]!
            if (subWidget == null) return
            return subWidget.value
        },
        getOwnPropertyDescriptor: (target, prop) => {
            if (typeof prop !== 'string') return
            const subWidget: Field = this.fields[prop]!
            if (subWidget == null) return
            return {
                enumerable: true,
                configurable: true,
                get() {
                    return subWidget.value
                },
            }
        },
    })

    // 💬 2024-03-13 rvion: no setter for groups; groups can not be set; only their child can
}

// DI
registerWidgetClass('group', Field_group)

/* --------------------------------------------------------------------------------
// to make a proxy look the way you want:
// 1. Define ownKeys handler: This will define which keys the proxy pretends to own, similar to what you have already.
// 2. Define get handler: This will return the value for each property, which you are currently setting to return the property name.
// 3. Define getOwnPropertyDescriptor handler: This is necessary because when you stringify an object or otherwise try to serialize or iterate over its properties, JavaScript checks if the properties actually exist and are enumerable. By providing a descriptor with enumerable: true, you enable this behavior.

// tip: practical way to dive into js & proxies inner workings: `bun -w <path.ts>`


const x = new Proxy(
    {},
    {
        ownKeys: (target) => {
            return ['a', 'b']
        },
        get: (target, prop) => {
            if (typeof prop !== 'string') return
            return prop
        },
        getOwnPropertyDescriptor: (target, prop) => {
            return {
                enumerable: true,
                configurable: true,
                value: prop,
            }
        },

    },
)

console.log(`[🤠] `, JSON.stringify(x))

-------------------------------------------------------------------------------- */
