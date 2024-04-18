import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, IWidgetMixins, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Problem_Ext } from '../../Validation'
import type { Widget_group } from '../group/WidgetGroup'
import type { BaseSelectEntry } from '../selectOne/WidgetSelectOne'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

import { applyWidgetMixinV2 } from '../../Mixins'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetSelectManyUI } from './WidgetSelectManyUI'

// CONFIG
export type Widget_selectMany_config<T extends BaseSelectEntry> = WidgetConfigFields<
    {
        default?: T[]
        choices: T[] | ((formRoot: Maybe<IWidget>) => T[])
        appearance?: 'select' | 'tab'
    },
    Widget_selectMany_types<T>
>

// SERIAL
export type Widget_selectMany_serial<T extends BaseSelectEntry> = WidgetSerialFields<{
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
    $Widget: Widget_selectMany<T>
}

// STATE
export interface Widget_selectMany<T extends BaseSelectEntry> extends Widget_selectMany_types<T>, IWidgetMixins {}
export class Widget_selectMany<T extends BaseSelectEntry> implements IWidget<Widget_selectMany_types<T>> {
    DefaultHeaderUI = WidgetSelectManyUI
    DefaultBodyUI = undefined

    readonly id: string
    get config() { return this.spec.config } // prettier-ignore
    readonly type: 'selectMany' = 'selectMany'
    readonly serial: Widget_selectMany_serial<T>

    get choices(): T[] {
        const _choices = this.config.choices
        return typeof _choices === 'function' //
            ? _choices(this.form._ROOT)
            : _choices
    }

    get baseErrors(): Maybe<string[]> {
        if (this.serial.values == null) return null
        let errors: string[] = []
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
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public readonly spec: ISpec<Widget_selectMany<T>>,
        serial?: Widget_selectMany_serial<T>,
    ) {
        const config = spec.config
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'selectMany',
            collapsed: config.startCollapsed,
            id: this.id,
            query: '',
            values: config.default ?? [],
        }
        /* 💊 */ if (this.serial.values == null) this.serial.values = []
        applyWidgetMixinV2(this)
        makeAutoObservable(this)
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

    get value(): Widget_selectMany_value<T> {
        return this.serial.values
    }
}

// DI
registerWidgetClass('selectMany', Widget_selectMany)
