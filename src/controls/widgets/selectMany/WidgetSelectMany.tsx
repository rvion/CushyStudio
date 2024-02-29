import type { Widget_group } from '../group/WidgetGroup'
import type { BaseSelectEntry } from '../selectOne/WidgetSelectOne'
import type { Form } from 'src/controls/Form'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from 'src/controls/IWidget'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { hash } from 'ohash'

import { WidgetDI } from '../WidgetUI.DI'
import { WidgetSelectManyUI } from './WidgetSelectManyUI'

// CONFIG
export type Widget_selectMany_config<T extends BaseSelectEntry> = WidgetConfigFields<{
    default?: T[]
    choices: T[] | ((formRoot: Maybe<Widget_group<any>>) => T[])
    appearance?: 'select' | 'tab'
}>

// SERIAL
export type Widget_selectMany_serial<T extends BaseSelectEntry> = WidgetSerialFields<{
    type: 'selectMany'
    query: string
    values: T[]
}>

// OUT
export type Widget_selectMany_output<T extends BaseSelectEntry> = T[]

// TYPES
export type Widget_selectMany_types<T extends BaseSelectEntry> = {
    $Type: 'selectMany'
    $Input: Widget_selectMany_config<T>
    $Serial: Widget_selectMany_serial<T>
    $Output: Widget_selectMany_output<T>
    $Widget: Widget_selectMany<T>
}

// STATE
export interface Widget_selectMany<T extends BaseSelectEntry> extends Widget_selectMany_types<T> {}
export class Widget_selectMany<T extends BaseSelectEntry> implements IWidget<Widget_selectMany_types<T>> {
    HeaderUI = WidgetSelectManyUI
    BodyUI = undefined
    get serialHash() {
        return hash(this.value)
    }
    readonly id: string
    readonly type: 'selectMany' = 'selectMany'
    readonly serial: Widget_selectMany_serial<T>

    get choices(): T[] {
        const _choices = this.config.choices
        return typeof _choices === 'function' //
            ? _choices(this.form._ROOT)
            : _choices
    }

    get errors(): Maybe<string[]> {
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
        public form: Form<any>,
        public config: Widget_selectMany_config<T>,
        serial?: Widget_selectMany_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'selectMany',
            collapsed: config.startCollapsed,
            id: this.id,
            query: '',
            values: config.default ?? [],
        }
        makeAutoObservable(this)
    }

    removeItem = (item: T): void => {
        if (this.serial.values == null) {
            this.serial.values = []
            return
        } // just in case
        this.serial.values = this.serial.values.filter((v) => v.id !== item.id) // filter just in case of duplicate
    }

    addItem = (item: T): void => {
        if (this.serial.values == null) {
            this.serial.values = [item]
            return
        } // just in case
        const i = this.serial.values.indexOf(item)
        if (i < 0) this.serial.values.push(item)
    }

    toggleItem = (item: T): void => {
        if (this.serial.values == null) {
            this.serial.values = [item]
            return
        } // just in case
        const i = this.serial.values.findIndex((i) => i.id === item.id)
        if (i < 0) this.serial.values.push(item)
        else this.serial.values = this.serial.values.filter((v) => v.id !== item.id) // filter just in case of duplicate
    }

    get value(): Widget_selectMany_output<T> {
        return this.serial.values
    }
}

// DI
WidgetDI.Widget_selectMany = Widget_selectMany
