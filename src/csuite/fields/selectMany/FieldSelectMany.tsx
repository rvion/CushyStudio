import type { BaseSchema } from '../../model/BaseSchema'
import type { Factory } from '../../model/Factory'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { TabPositionConfig } from '../choices/TabPositionConfig'
import type { BaseSelectEntry } from '../selectOne/FieldSelectOne'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'
import { WidgetSelectMany_ListUI } from './WidgetSelectMany_ListUI'
import { WidgetSelectManyUI } from './WidgetSelectManyUI'

export type SelectManyAppearance = 'select' | 'tab' | 'list'
// CONFIG
export type Field_selectMany_config<T extends BaseSelectEntry> = FieldConfig<
    {
        default?: T[]
        /**
         * list of all choices
         * 👉 you can use a lambda if you want the option to to dynamic
         *    the lambda will receive the widget instance as argument, from
         *    which you can access variosu stuff like
         *      - `self.serial.query`: the current filtering text
         *      - `self.form`: the form instance
         *      - `self.form.root`: the root of the widget
         *      - `self.parent...`: natigate the widget tree
         *      - `self.useKontext('...')`: any named dynamic chanel for cross-widget communication
         * 👉 If the list of options is generated from the query directly,
         *    you should also set `disableLocalFiltering: true`, to avoid
         *    filtering the options twice.
         */
        choices: T[] | ((self: Field_selectMany<T>) => T[])
        /** set this to true if your choices are dynamically generated from the query directly, to disable local filtering */
        disableLocalFiltering?: boolean
        appearance?: SelectManyAppearance
        getLabelUI?: (t: T) => React.ReactNode

        /**
         * @since 2024-06-24
         * allow to wrap the list of values if they take more than 1 SLH (standard line height)
         */
        wrap?: boolean

        /**
         * @since 2024-06-24
         * @deprecated use global csuite config instead
         */
        tabPosition?: TabPositionConfig
    },
    Field_selectMany_types<T>
>

// SERIAL
export type Field_selectMany_serial<T extends BaseSelectEntry> = FieldSerial<{
    $: 'selectMany'
    query: string
    values: T[]
}>

// SERIAL FROM VALUE
export const Field_selectMany_fromValue = <T extends BaseSelectEntry>(
    values: Field_selectMany_value<T>,
): Field_selectMany_serial<T> => ({
    $: 'selectMany',
    query: '',
    values,
})

// VALUE
export type Field_selectMany_value<T extends BaseSelectEntry> = T[]

// TYPES
export type Field_selectMany_types<T extends BaseSelectEntry> = {
    $Type: 'selectMany'
    $Config: Field_selectMany_config<T>
    $Serial: Field_selectMany_serial<T>
    $Value: Field_selectMany_value<T>
    $Field: Field_selectMany<T>
}

// STATE
export class Field_selectMany<T extends BaseSelectEntry> extends Field<Field_selectMany_types<T>> {
    static readonly type: 'selectMany' = 'selectMany'
    DefaultHeaderUI = WidgetSelectManyUI
    DefaultBodyUI = WidgetSelectMany_ListUI

    get defaultValue(): Field_selectMany_value<T> {
        return this.config.default ?? []
    }

    get hasChanges(): boolean {
        if (this.serial.values.length !== this.defaultValue.length) return true
        for (const item of this.serial.values) {
            if (!this.defaultValue.find((i) => i.id === item.id)) return true
        }
        return false
    }

    reset(): void {
        this.value = this.defaultValue
    }

    wrap = this.config.wrap ?? false

    get choices(): T[] {
        const _choices = this.config.choices
        return typeof _choices === 'function' //
            ? _choices(this)
            : _choices
    }

    get ownProblems(): Maybe<string[]> {
        if (this.serial.values == null) return null
        const errors: string[] = []
        for (const value of this.serial.values) {
            if (!this.choices.find((choice) => choice.id === value.id)) {
                errors.push(`value ${value.id} (label: ${value.label}) not in choices`)
            }
        }
        if (errors.length > 0) return errors
        return null
    }

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_selectMany<T>>,
        serial?: Field_selectMany_serial<T>,
    ) {
        super(repo, root, parent, schema)
        const config = schema.config
        /* 💊 */ if (this.serial.values == null) this.serial.values = []
        this.init(serial, {
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    protected setOwnSerial(serial: Maybe<Field_selectMany_serial<T>>): void {
        if (serial == null) return
        this.serial.query = serial.query
        this.serial.values = serial.values
    }

    /** un-select given item */
    removeItem(item: T): void {
        // ensure item was selected
        const indexOf = this.serial.values.findIndex((i) => i.id === item.id)
        if (indexOf < 0) return console.log(`[🔶] WidgetSelectMany.removeItem: item not found`)
        // remove it
        this.runInValueTransaction(() => {
            this.serial.values = this.serial.values.filter((v) => v.id !== item.id) // filter just in case of duplicate
        })
    }

    /** select given item */
    addItem(item: T): void {
        // ensure item is not selected yet
        const i = this.serial.values.indexOf(item)
        if (i >= 0) return console.log(`[🔶] WidgetSelectMany.addItem: item already in list`)
        // insert it
        this.runInValueTransaction(() => this.serial.values.push(item))
    }

    /** select item if item was not selected, un-select if item was selected */
    toggleItem(item: T): void {
        this.runInValueTransaction(() => {
            const i = this.serial.values.findIndex((i) => i.id === item.id)
            if (i < 0) {
                this.serial.values.push(item)
            } else {
                this.serial.values = this.serial.values.filter((v) => v.id !== item.id) // filter just in case of duplicate
            }
        })
    }

    get value(): Field_selectMany_value<T> {
        return this.serial.values
    }

    set value(next: Field_selectMany_value<T>) {
        if (this.serial.values === next) return
        this.runInValueTransaction(() => (this.serial.values = next))
    }
}

// DI
registerFieldClass('selectMany', Field_selectMany)
