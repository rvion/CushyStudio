import type { Widget_group } from '../group/WidgetGroup'
import type { Form } from 'src/controls/Form'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from 'src/controls/IWidget'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { hash } from 'ohash'

import { WidgetDI } from '../WidgetUI.DI'

export type BaseSelectEntry = { id: string; label?: string }

// CONFIG
export type Widget_selectOne_config<T extends BaseSelectEntry> = WidgetConfigFields<{
    default?: T
    choices: T[] | ((formRoot: Widget_group<any>) => T[])
    appearance?: 'select' | 'tab'
}>

// SERIAL
export type Widget_selectOne_serial<T extends BaseSelectEntry> = WidgetSerialFields<{ type: 'selectOne'; query: string; val: T }>

// OUT
export type Widget_selectOne_output<T extends BaseSelectEntry> = T

// TYPES
export type Widget_selectOne_types<T extends BaseSelectEntry> = {
    $Type: 'selectOne'
    $Input: Widget_selectOne_config<T>
    $Serial: Widget_selectOne_serial<T>
    $Output: Widget_selectOne_output<T>
}

// STATE
export interface Widget_selectOne<T> extends Widget_selectOne_types<T> {}
export class Widget_selectOne<T extends BaseSelectEntry> implements IWidget<Widget_selectOne_types<T>> {
    get serialHash() {
        return hash(this.value)
    }
    readonly isCollapsible = false
    readonly id: string
    readonly type: 'selectOne' = 'selectOne'
    readonly serial: Widget_selectOne_serial<T>

    get errors(): Maybe<string> {
        if (this.serial.val == null) return 'no value selected'
        const selected = this.choices.find((c) => c.id === this.serial.val.id)
        if (selected == null) return 'selected value not in choices'
        return
    }

    get choices(): T[] {
        const _choices = this.config.choices
        if (typeof _choices === 'function') {
            if (!this.form.ready) return []
            if (this.form._ROOT == null) throw new Error('❌ IMPOSSIBLE: this.form._ROOT is null')
            return _choices(this.form._ROOT)
        }
        return _choices
    }
    constructor(public form: Form<any>, public config: Widget_selectOne_config<T>, serial?: Widget_selectOne_serial<T>) {
        this.id = serial?.id ?? nanoid()
        const choices = this.choices
        this.serial = serial ?? {
            type: 'selectOne',
            collapsed: config.startCollapsed,
            id: this.id,
            query: '',
            val: config.default ?? choices[0],
        }
        if (this.serial.val == null && Array.isArray(this.config.choices)) this.serial.val = choices[0]
        makeAutoObservable(this)
    }
    get value(): Widget_selectOne_output<T> {
        return this.serial.val
    }
}

// DI
WidgetDI.Widget_selectOne = Widget_selectOne
