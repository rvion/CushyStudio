import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { IBlueprint } from '../../model/IBlueprint'
import type { Model } from '../../model/Model'
import type { TabPositionConfig } from '../choices/TabPositionConfig'
import type { BaseSelectEntry } from '../selectOne/WidgetSelectOne'

import { runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { BaseField } from '../../model/BaseField'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetSelectMany_ListUI } from './WidgetSelectMany_ListUI'
import { WidgetSelectManyUI } from './WidgetSelectManyUI'

export type SelectManyAppearance = 'select' | 'tab' | 'list'
// CONFIG
export type Widget_selectMany_config<T extends BaseSelectEntry> = FieldConfig<
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
        choices: T[] | ((self: Widget_selectMany<T>) => T[])
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
    Widget_selectMany_types<T>
>

// SERIAL
export type Widget_selectMany_serial<T extends BaseSelectEntry> = FieldSerial<{
    type: 'selectMany'
    query: string
    values: T[]
}>

// SERIAL FROM VALUE
export const Widget_selectMany_fromValue = <T extends BaseSelectEntry>(
    values: Widget_selectMany_value<T>,
): Widget_selectMany_serial<T> => ({
    type: 'selectMany',
    query: '',
    values,
})

// VALUE
export type Widget_selectMany_value<T extends BaseSelectEntry> = T[]

// TYPES
export type Widget_selectMany_types<T extends BaseSelectEntry> = {
    $Type: 'selectMany'
    $Config: Widget_selectMany_config<T>
    $Serial: Widget_selectMany_serial<T>
    $Value: Widget_selectMany_value<T>
    $Field: Widget_selectMany<T>
}

// STATE
export class Widget_selectMany<T extends BaseSelectEntry> extends BaseField<Widget_selectMany_types<T>> {
    DefaultHeaderUI = WidgetSelectManyUI
    DefaultBodyUI = WidgetSelectMany_ListUI

    readonly id: string

    readonly type: 'selectMany' = 'selectMany'
    readonly serial: Widget_selectMany_serial<T>

    get defaultValue(): Widget_selectMany_value<T> {
        return this.config.default ?? []
    }
    get hasChanges() {
        if (this.serial.values.length !== this.defaultValue.length) return true
        for (const item of this.serial.values) {
            if (!this.defaultValue.find((i) => i.id === item.id)) return true
        }
        return false
    }
    reset = () => {
        this.value = this.defaultValue
    }
    wrap = this.config.wrap ?? false
    get choices(): T[] {
        const _choices = this.config.choices
        return typeof _choices === 'function' //
            ? _choices(this)
            : _choices
    }

    get baseErrors(): Maybe<string[]> {
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
        public readonly form: Model,
        public readonly parent: BaseField | null,
        public readonly spec: IBlueprint<Widget_selectMany<T>>,
        serial?: Widget_selectMany_serial<T>,
    ) {
        super()
        this.id = serial?.id ?? nanoid()
        const config = spec.config
        this.serial = serial ?? {
            type: 'selectMany',
            collapsed: config.startCollapsed,
            id: this.id,
            query: '',
            values: config.default ?? [],
        }
        /* 💊 */ if (this.serial.values == null) this.serial.values = []
        this.init({
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    /** un-select given item */
    removeItem = (item: T): void => {
        // ensure item was selected
        const indexOf = this.serial.values.findIndex((i) => i.id === item.id)
        if (indexOf < 0) return console.log(`[🔶] WidgetSelectMany.removeItem: item not found`)

        // remove it
        this.serial.values = this.serial.values.filter((v) => v.id !== item.id) // filter just in case of duplicate
        this.bumpValue()
    }

    /** select given item */
    addItem = (item: T): void => {
        // ensure item is not selected yet
        const i = this.serial.values.indexOf(item)
        if (i >= 0) return console.log(`[🔶] WidgetSelectMany.addItem: item already in list`)

        // insert & bump
        this.serial.values.push(item)
        this.bumpValue()
    }

    /** select item if item was not selected, un-select if item was selected */
    toggleItem = (item: T): void => {
        const i = this.serial.values.findIndex((i) => i.id === item.id)
        if (i < 0) {
            this.serial.values.push(item)
            this.bumpValue()
        } else {
            this.serial.values = this.serial.values.filter((v) => v.id !== item.id) // filter just in case of duplicate
            this.bumpValue()
        }
    }

    setValue(val: Widget_selectMany_value<T>) {
        this.value = val
    }

    set value(next: Widget_selectMany_value<T>) {
        if (this.serial.values === next) return
        runInAction(() => {
            this.serial.values = next
            this.bumpValue()
        })
    }

    get value(): Widget_selectMany_value<T> {
        return this.serial.values
    }
}

// DI
registerWidgetClass('selectMany', Widget_selectMany)
