import type { BaseSchema } from '../../model/BaseSchema'
import type { KeyedField, VALUE_MODE } from '../../model/Field'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { SchemaDict } from '../../model/SchemaDict'
import type { Problem_Ext } from '../../model/Validation'
import type { NO_PROPS } from '../../types/NO_PROPS'
import type { CovariantFC } from '../../variance/CovariantFC'
import type { FC } from 'react'

import { produce } from 'immer'

import { Field } from '../../model/Field'
import { capitalize } from '../../utils/capitalize'
import { registerFieldClass } from '../WidgetUI.DI'
import { WidgetGroup_BlockUI, WidgetGroup_LineUI } from './WidgetGroupUI'

// CONFIG
export type Field_group_config<T extends SchemaDict> = FieldConfig<
    {
        /** fields */
        items?: T

        /** @deprecated; use `toString` instead */
        summary?: (
            //
            items: { [k in keyof T]: T[k]['$Value'] },
            self: Field_group<T>,
        ) => string

        /** @default @false */
        presetButtons?: boolean
        // 🔶 TODO 1: remove summary from here and move it to the base field config directly
        // 🟢 TODO 2: stop passing values to that function, only pass the field directly
        // TODO 3: add a similary Cell option on the base fieldconfig, that return a ReactNode instead of a string
        // TODO 4: add various .customXXX on each ....
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

export type Field_group_unchecked<T extends SchemaDict> = {
    [k in keyof T]: T[k]['$Unchecked']
}

// TYPES
export type Field_group_types<T extends SchemaDict> = {
    $Type: 'group'
    $Config: Field_group_config<T>
    $Serial: Field_group_serial<T>
    $Value: Field_group_value<T>
    $Unchecked: Field_group_unchecked<T>
    $Field: Field_group<T>
    $Child: T[keyof T]
}

export type MAGICFIELDS<T extends { [key: string]: { $Field: any } }> = {
    [K in keyof T as Capitalize<K & string>]: T[K]['$Field']
}

export type FieldGroup<T extends SchemaDict> = Field_group<T> & MAGICFIELDS<T>

// prettier-ignore
type QuickFormContent<T extends Field> =
    /** strings will be rendered as Markdown, with a `_MD` className  */
    | string

    /**
     * any lambda CURRENTLY expect to return a component
     * (PROBABLY BAD, SHOULD RETURN AN ELEMENT)
     */
    | ((field: T) => Maybe<FC<NO_PROPS>>)

    /** Fields will be rendered using the default Component
     * for the render context (cell, form, text) */
    | Field

    /** null or undefined will be skipped */
    | null | undefined

type RenderFieldsSubsetProps<T extends SchemaDict> = {
    showMore?: (keyof T)[] | false // 🔴 probably migrate to QuickFormContent<this>[] asap too
    readonly?: boolean
    usage?: 'cell' | 'default' | 'text' | 'header'
}

// STATE
export interface Field_group<T extends SchemaDict> {
    $Subfields: T
}

export class Field_group<T extends SchemaDict> extends Field<Field_group_types<T>> {
    static readonly type: 'group' = 'group'
    static readonly emptySerial: Field_group_serial<any> = { $: 'group', values_: {} }
    static migrateSerial(): undefined {}

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_group<T>>,
        initialMountKey: string,
        serial?: Field_group_serial<T>,
    ) {
        super(repo, root, parent, schema, initialMountKey, serial)
        for (const [fName, fSchema] of this._fieldSchemas) {
            Object.defineProperty(this, capitalize(fName), {
                get: () => this.fields[fName],
                configurable: true,
            })
        }
        this.init(serial, {
            // UI
            DefaultHeaderUI: false,

            // values
            value_or_fail: false,
            value_or_zero: false,
            value_unchecked: false,
        })
    }

    // #region UI
    DefaultHeaderUI = WidgetGroup_LineUI

    // 🔴 wrong name; it's compiling a component, not rendering a custom list of sub-fields
    renderFieldsSubset(
        extra: QuickFormContent<this>[] | ((self: this) => QuickFormContent<this>[]),
        props?: RenderFieldsSubsetProps<T>,
    ): FC<NO_PROPS | undefined> {
        const sm = props?.showMore
        return () => {
            // 🔴 should this be called with render-time FormUIProps? (and render-time RenderFieldsSubsetProps)
            // ⏸️ const defUsage = props?.usage ?? 'default'
            const fields = typeof extra === 'function' ? extra(this) : extra // 🔴 we may also want to pass props here
            return (
                <Frame>
                    {fields.map((f, ix) => {
                        if (f == null) return null
                        if (typeof f === 'function') {
                            const res = f(this)
                            if (res == null) return null
                            return res({})
                        }
                        if (f instanceof Field) {
                            if (props?.usage === 'header') return f.header({ readonly: props?.readonly })
                            // if (props?.usage === 'cell') return f.cell({ readonly: props?.readonly }) // f.cell does not exist yet
                            // if (props?.usage === 'text') return f.text({ readonly: props?.readonly }) // f.text does not exist yet

                            return f.renderWithLabel({ fieldName: f.mountKey })
                        }

                        if (typeof f === 'string') {
                            // if (this.fields[f] != null) return this.fields[f].renderWithLabel({ fieldName: f }) // 🔶 not sure if we still allow 'my_field_name' API
                            return <MarkdownUI markdown={f} key={`${ix}-${f}`} />
                        }
                    })}
                    {sm !== false && (
                        <CollapsibleUI
                            content={() => {
                                const moreFields =
                                    sm == null
                                        ? Object.keys(this.fields).filter(
                                              (k) =>
                                                  !fields.includes(k) && // display all fields that are not in the main list
                                                  !fields.includes(this.fields[k]),
                                          )
                                        : sm
                                return moreFields.map((f) => this.fields[f]!.renderWithLabel({ fieldName: f as string }))
                            }}
                        />
                    )}
                </Frame>
            )
        }
    }

    // 🔴 WIP
    // should it return FC or ReactNode?
    // this is a kind of very basic WidgetGroupUI alternative
    // probably stupid to have a separate component for this, should just be a different layout.
    renderFieldsSubsetLine = (p: {
        extra:
            | QuickFormContent<any>[] /* 🔴 should be '<this>' but ts is not happy when in object param (top level param is ok) ?! */
            | ((self: any) => QuickFormContent<any>[])
    }): ReactNode => {
        const extra = p.extra
        // ⏸️ const defUsage = props?.usage ?? 'default'
        const fields = typeof extra === 'function' ? extra(this) : extra
        return (
            <Frame row>
                {fields.map((f, ix) => {
                    if (f == null) return null
                    if (typeof f === 'function') {
                        const res = f(this)
                        if (res == null) return null
                        return res({})
                    }
                    if (f instanceof Field) {
                        return (
                            <Frame col key={f.id}>
                                {f.mountKey}
                                {f.header()}
                            </Frame>
                        )
                    }

                    if (typeof f === 'string') {
                        // if (this.fields[f] != null) return this.fields[f].renderWithLabel({ fieldName: f }) // 🔶 not sure if we still allow 'my_field_name' API
                        return <MarkdownUI markdown={f} key={`${ix}-${f}`} />
                    }
                })}
            </Frame>
        )
    }

    show(
        fields: QuickFormContent<this>[] | ((self: this) => QuickFormContent<this>[]),
        props: Omit<FormUIProps, 'field'> & RenderFieldsSubsetProps<T> = {},
    ): JSX.Element {
        return this.defineForm(fields, { ...props }).render()
    }

    /**
     * 🔴🔴🔴 THIS IS BROKEN
     * we can't recreate a new form on every render of caller.
     * if we can wait a few weeks, will be fixed by Render refactoring
     * if we can't:
     * we may be able to quickly fix this by treating the function as a kind of "useForm" that useMemo the result
     * but it's far from ideal.
     */
    defineForm(
        //
        fields: QuickFormContent<this>[] | ((self: this) => QuickFormContent<this>[]),
        // 🔶 put FormUIProps props in a third param?
        // include usage/readonly in FormUIProps? => probably, forwarding to <Content />
        // then propagate them via WidgetGroup_BlockUI and WidgetWithLabel? (i guess here is the inversion of control improvement)
        props: Omit<FormUIProps, 'field'> & RenderFieldsSubsetProps<T> = {},
    ): Form {
        return new Form({
            ...props,
            field: this,
            Content: this.renderFieldsSubset(fields, {
                showMore: props.showMore,
                usage: props.usage,
                readonly: props.readonly,
            }),
        })
    }

    get DefaultBodyUI(): CovariantFC<{ field: Field_group<any> }> | undefined {
        if (Object.keys(this.fields).length === 0) return
        return WidgetGroup_BlockUI
    }

    get summary(): string {
        //                                👇🤔 Maybe we don't want to invoke the summary unless the field is valid -> it could throw with children that have a throwable _or_zero
        return this.config.summary?.(this.value_or_zero, this) ?? ''
        // return this.config.summary?.(this.value) ?? Object.keys(this.fields).length + ' fields'
    }

    get justifyLabel(): boolean {
        if (this.numFields > 1) return false
        return true
    }

    // #region PROBLEMS
    get ownConfigSpecificProblems(): Problem_Ext {
        return null
    }

    get ownTypeSpecificProblems(): Problem_Ext {
        return null
    }

    // #region CHANGES
    get isOwnSet(): boolean {
        return true
        // return this.subFields.every((f) => f.isSet)
    }

    get hasChanges(): boolean {
        return Object.values(this.fields).some((f) => f.hasChanges)
    }
    //            IMPOSSIBLE
    //                VV
    // [x.a<, x.a<, x.a.b<, x.a.b>, x.a>]
    // runInTransaction

    // #region SERIAL
    protected setOwnSerial(next: Field_group_serial<T>): void {
        // setOwnSerial(next) is just here to call `this.serial = next`
        // with some extra stuff. it's almost a regular field action, execpt
        // it's internal, and has a few extra responsibilities (like fixing external serials)
        // so it's efficient and avoids producing intermediary serials.
        //
        // your `setOwnSerial` should in order
        //   - 1. CANONICAL SERIAL FORM (tweak the input serial into it's canonical form)
        //       - 1.1 add various default values when they need to be persisted in serial uppon instanciation.
        //       - 1.2 add various missing expected properties
        //             (sometimes, they are marked optional, but it's convenient to add them early here)
        //
        //   - 2. ASSIGN SERIAL (yup, just call `this.assignNewSerial(next)`, or use the setter alias `this.serial = ...`)
        //
        //   - 3. RECONCILIATION (finally, reconcile the children)
        //        they may produce new versions, but that's OKAY.
        //        if you find a better way to assign the serial only once at the end only, let's discuss it !
        //        (But beware of dragons, it's easy to break the mental model during those intermediary steps )

        // 1. MAKE SERIAL CANONICAL
        if (next.values_ == null) {
            next = produce(next, (draft) => void (draft.values_ = {} as any))
        }

        // 2. ASSIGN SERIAL
        this.assignNewSerial(next)

        // 3. RECONCILE CHILDREN
        for (const [fName, fSchema] of this._fieldSchemas) {
            // reconcile can yield different serial during setSerial; both for
            // - new child (e.g. running migration),
            // - old child (e.g. default value beeing added in setOwnSerial)
            this.RECONCILE({
                mountKey: fName,
                existingChild: this.fields[fName],
                correctChildSchema: fSchema,
                targetChildSerial: next?.values_?.[fName],
                attach: (child) => {
                    this.fields[fName] = child
                    // 💬 2024-09-11 rvion:
                    // | 👇 no longer necessary
                    // | this.patchSerial((draft) => void (draft.values_[fName] = child.serial))
                },
            })
        }
    }

    // #region CHILDREN
    /**
     * The dict of all child widgets
     * will be filled during constructor
     */
    fields: { [k in keyof T]: T[k]['$Field'] } = {} as any

    _acknowledgeCount = 0
    _acknowledgeNewChildSerial(mountKey: string, newChildSerial: any): boolean {
        // console.log(`[🤠] ACK`, getUIDForMemoryStructure(newChildSerial), getUIDForMemoryStructure(this.serial), this.serial)
        const didChange = this.patchSerial((draft) => void ((draft.values_ as any)[mountKey] = newChildSerial))
        if (didChange) this._acknowledgeCount++
        // console.log(`[🤠] ACK`, getUIDForMemoryStructure(newChildSerial), getUIDForMemoryStructure(this.serial), this.serial)
        return didChange
    }

    /** all [key,value] pairs */
    get entries(): [string, Field][] {
        return Object.entries(this.fields) as [string, Field][]
    }

    get numFields(): number {
        return Object.keys(this.fields).length
    }

    /** return item at give key */
    at<K extends keyof T>(key: K): T[K]['$Field'] {
        return this.fields[key]
    }

    /** return item.value at give key */
    get<K extends keyof T>(key: K): T[K]['$Value'] {
        return this.fields[key].value
    }

    get childrenAll(): Field[] {
        return Object.values(this.fields)
    }

    get subFieldsWithKeys(): KeyedField[] {
        return Object.entries(this.fields).map(([key, field]) => ({ key, field }))
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
    // #region VALUE

    setPartialValue(val: Partial<Field_group_value<T>>): this {
        this.runInValueTransaction(() => {
            for (const key in val) {
                this.fields[key].value = val[key]
            }
        })
        return this
    }

    get value(): Field_group_value<T> {
        return this.value_or_fail
    }

    set value(val: Field_group_value<T>) {
        this.runInAutoTransaction(() => {
            for (const key in val) {
                this.fields[key].value = val[key]
            }
        })
    }

    value_or_fail: Field_group_value<T> = new Proxy({}, this.makeValueProxy('fail'))
    value_or_zero: Field_group_value<T> = new Proxy({}, this.makeValueProxy('zero'))
    value_unchecked: Field_group_unchecked<T> = new Proxy({}, this.makeValueProxy('unchecked'))

    // 🦊 get value_or_fail(): Field_group_value<T> {
    // 🦊     const x: Field_group_value<T> = new Proxy({} as any, this.makeValueProxy('fail'))
    // 🦊     Object.defineProperty(this, 'value_or_fail', { value: x })
    // 🦊     return x
    // 🦊 }

    // 🦊 get value_or_zero(): Field_group_value<T> {
    // 🦊     const x: Field_group_value<T> = new Proxy({} as any, this.makeValueProxy('zero'))
    // 🦊     Object.defineProperty(this, 'value_or_zero', { value: x })
    // 🦊     return x
    // 🦊 }

    // 🦊 get value_unchecked(): Field_group_unchecked<T> {
    // 🦊     const x: Field_group_unchecked<T> = new Proxy({} as any, this.makeValueProxy('unchecked'))
    // 🦊     Object.defineProperty(this, 'value_unchecked', { value: x })
    // 🦊     return x
    // 🦊 }

    private makeValueProxy(mode: VALUE_MODE): ProxyHandler<any> {
        return {
            ownKeys: (_target): string[] => {
                return Object.keys(this.fields)
            },
            set: (_target, prop, value): boolean => {
                if (typeof prop !== 'string') return false
                const subWidget: Maybe<Field> = this.fields[prop]
                if (subWidget == null) return false
                subWidget.value = value
                return true
            },
            get: (_target, prop): any => {
                if (typeof prop !== 'string') return
                const subWidget: Maybe<Field> = this.fields[prop]
                if (subWidget == null) return
                return subWidget.getValue(mode)
            },
            getOwnPropertyDescriptor: (_target, prop): PropertyDescriptor | undefined => {
                if (typeof prop !== 'string') return
                const subWidget: Maybe<Field> = this.fields[prop]
                if (subWidget == null) return
                return {
                    enumerable: true,
                    configurable: true,
                    get(): any {
                        return subWidget.getValue(mode)
                    },
                }
            },
        }
    }

    randomize() {
        this.childrenAll.forEach((f) => f.randomize())
    }
}

// DI
registerFieldClass('group', Field_group)
