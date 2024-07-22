import type { FormUIProps } from '../../form/FormUI'
import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { SchemaDict } from '../../model/SchemaDict'
import type { Problem_Ext } from '../../model/Validation'
import type { NO_PROPS } from '../../types/NO_PROPS'
import type { CovariantFC } from '../../variance/CovariantFC'

import { type FC } from 'react'

import { CollapsibleUI } from '../../collapsible/CollapsibleUI'
import { Form } from '../../form/Form'
import { Frame } from '../../frame/Frame'
import { Field, type KeyedField } from '../../model/Field'
import { capitalize } from '../../utils/capitalize'
import { registerFieldClass } from '../WidgetUI.DI'
import { WidgetGroup_BlockUI, WidgetGroup_LineUI } from './WidgetGroupUI'

// CONFIG
export type Field_group_config<T extends SchemaDict> = FieldConfig<
    {
        /** fields */
        items?: T

        /** if provided, will be used in the header when fields are folded */
        summary?: (
            //
            items: { [k in keyof T]: T[k]['$Value'] },
            self: Field_group<T>,
        ) => string
    },
    Field_group_types<T>
>

// SERIAL
export type Field_group_serial<T extends SchemaDict> = FieldSerial<{
    $: 'group'
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

export type MAGICFIELDS<T extends { [key: string]: { $Field: any } }> = {
    [K in keyof T as Capitalize<K & string>]: T[K]['$Field']
}

export type FieldGroup<T extends SchemaDict> = Field_group<T> & MAGICFIELDS<T>

type Accessor<T extends Field> = (field: T) => FC<NO_PROPS>

// STATE
export class Field_group<T extends SchemaDict> extends Field<Field_group_types<T>> {
    DefaultHeaderUI = WidgetGroup_LineUI

    formFields(fields: (keyof T | Accessor<this>)[], props?: { showMore?: (keyof T)[] | false }): FC<NO_PROPS> {
        const sm = props?.showMore
        return () => (
            <Frame>
                {fields.map((f) => {
                    if (typeof f === 'function') {
                        const res = f(this)
                        return res({})
                    }
                    return this.fields[f]!.renderWithLabel({ fieldName: f as string })
                })}
                {sm !== false && (
                    <CollapsibleUI
                        content={() => {
                            const moreFields = sm == null ? Object.keys(this.fields).filter((k) => !fields.includes(k)) : sm
                            return moreFields.map((f) => this.fields[f]!.renderWithLabel({ fieldName: f as string }))
                        }}
                    />
                )}
            </Frame>
        )
    }

    form(
        fields: (keyof T | Accessor<this>)[],
        props: Omit<FormUIProps, 'field' | 'layout'> & { showMore?: (keyof T)[] | false },
    ): Form {
        return new Form({
            ...props,
            field: this,
            Component: this.formFields(fields, { showMore: props.showMore }),
        })
    }

    get DefaultBodyUI(): CovariantFC<{ field: Field_group<any> }> | undefined {
        if (Object.keys(this.fields).length === 0) return
        return WidgetGroup_BlockUI
    }

    get ownProblems(): Problem_Ext {
        return null
    }

    get hasChanges(): boolean {
        return Object.values(this.fields).some((f) => f.hasChanges)
    }

    get summary(): string {
        return this.config.summary?.(this.value, this) ?? ''
        // return this.config.summary?.(this.value) ?? Object.keys(this.fields).length + ' fields'
    }

    static readonly type: 'group' = 'group'

    /** all [key,value] pairs */
    get entries(): [string, Field][] {
        return Object.entries(this.fields) as [string, Field][]
    }

    get numFields(): number {
        return Object.keys(this.fields).length
    }

    get justifyLabel(): boolean {
        if (this.numFields > 1) return false
        return true
    }

    /** return item at give key */
    at<K extends keyof T>(key: K): T[K]['$Field'] {
        return this.fields[key]
    }

    /** return item.value at give key */
    get<K extends keyof T>(key: K): T[K]['$Value'] {
        return this.fields[key].value
    }

    /**
     * The dict of all child widgets
     * will be filled during constructor
     */
    fields: { [k in keyof T]: T[k]['$Field'] } = {} as any

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_group<T>>,
        serial?: Field_group_serial<T>,
    ) {
        super(repo, root, parent, schema)
        for (const [fName, fSchema] of this._fieldSchemas) {
            Object.defineProperty(this, capitalize(fName), {
                get: () => this.fields[fName],
                configurable: true,
            })
        }
        this.init(serial, {
            value: false,
            __value: false,
            DefaultHeaderUI: false,
        })
    }

    /** just here to normalize fieldSchema definitions, since it used to be a lambda */
    private get _fieldSchemas(): [keyof T & string, BaseSchema<any>][] {
        const itemsDef = this.config.items
        const fieldSchemas: SchemaDict =
            typeof itemsDef === 'function' //
                ? (itemsDef as any)() ?? {} // <-- LEGACY SUPPORT
                : itemsDef ?? {}
        return Object.entries(fieldSchemas) as [keyof T & string, BaseSchema<any>][]
    }

    protected setOwnSerial(serial: Maybe<Field_group_serial<T>>): void {
        // make sure this is propery initialized
        if (this.serial.values_ == null) this.serial.values_ = {}

        // 🔴 PLUS APPLICABLE / a remettre sous une autre forme.
        // | we only iterate on the current schema fields => we DON'T WANT to remove the old ones.
        // | we keep the old values in case those are just temporarilly removed, or in case
        // | those will be lazily added later though global usage

        for (const [fName, fSchema] of this._fieldSchemas) {
            this.RECONCILE({
                existingChild: this.fields[fName],
                correctChildSchema: fSchema,
                targetChildSerial: serial?.values_?.[fName],
                attach: (child) => {
                    this.fields[fName] = child
                    this.serial.values_[fName] = child.serial
                },
            })
        }
    }

    setPartialValue(val: Partial<Field_group_value<T>>): this {
        this.runInValueTransaction(() => {
            for (const key in val) {
                this.fields[key].value = val[key]
            }
        })
        return this
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
        this.runInAutoTransaction(() => {
            for (const key in val) {
                this.fields[key].value = val[key]
            }
        })
    }

    // @internal
    __value: { [k in keyof T]: T[k]['$Value'] } = new Proxy({} as any, {
        ownKeys: (_target): string[] => {
            return Object.keys(this.fields)
        },
        set: (_target, prop, value): boolean => {
            if (typeof prop !== 'string') return false
            const subWidget: Field = this.fields[prop]!
            if (subWidget == null) return false
            subWidget.value = value
            return true
        },
        get: (_target, prop): any => {
            if (typeof prop !== 'string') return
            const subWidget: Field = this.fields[prop]!
            if (subWidget == null) return
            return subWidget.value
        },
        getOwnPropertyDescriptor: (_target, prop): PropertyDescriptor | undefined => {
            if (typeof prop !== 'string') return
            const subWidget: Field = this.fields[prop]!
            if (subWidget == null) return
            return {
                enumerable: true,
                configurable: true,
                get(): any {
                    return subWidget.value
                },
            }
        },
    })
}

// DI
registerFieldClass('group', Field_group)
