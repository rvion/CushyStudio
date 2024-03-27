import type { Form } from '../../Form'
import type { IWidget, IWidgetMixins, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Widget_group } from '../group/WidgetGroup'

import { makeAutoObservable, runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { applyWidgetMixinV2 } from '../../Mixins'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetSelectOneUI } from './WidgetSelectOneUI'

export type BaseSelectEntry<T = string> = { id: T; label?: string }

// CONFIG
export type Widget_selectOne_config<T extends BaseSelectEntry> = WidgetConfigFields<
    {
        default?: T
        choices: T[] | ((formRoot: Widget_group<any>, self: Widget_selectOne<T>) => T[])
        appearance?: 'select' | 'tab'
    },
    Widget_selectOne_types<T>
>

// SERIAL
export type Widget_selectOne_serial<T extends BaseSelectEntry> = WidgetSerialFields<{
    type: 'selectOne'
    query: string
    val: T
}>

// VALUE
export type Widget_selectOne_output<T extends BaseSelectEntry> = T

// TYPES
export type Widget_selectOne_types<T extends BaseSelectEntry> = {
    $Type: 'selectOne'
    $Config: Widget_selectOne_config<T>
    $Serial: Widget_selectOne_serial<T>
    $Value: Widget_selectOne_output<T>
    $Widget: Widget_selectOne<T>
}

// STATE
export interface Widget_selectOne<T> extends Widget_selectOne_types<T>, IWidgetMixins {}
export class Widget_selectOne<T extends BaseSelectEntry> implements IWidget<Widget_selectOne_types<T>> {
    DefaultHeaderUI = WidgetSelectOneUI
    DefaultBodyUI = undefined

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
            return _choices(this.form._ROOT, this)
        }
        return _choices
    }

    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public config: Widget_selectOne_config<T>,
        serial?: Widget_selectOne_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        const choices = this.choices
        this.serial = serial ?? {
            type: 'selectOne',
            collapsed: config.startCollapsed,
            id: this.id,
            query: '',
            val: config.default ?? choices[0]!,
        }
        if (this.serial.val == null && Array.isArray(this.config.choices)) this.serial.val = choices[0]!
        applyWidgetMixinV2(this)
        makeAutoObservable(this)
    }

    set value(next: Widget_selectOne_output<T>) {
        if (this.serial.val === next) return
        runInAction(() => {
            this.serial.val = next
            this.bumpValue()
        })
    }
    get value(): Widget_selectOne_output<T> {
        return this.serial.val
    }
}

// DI
registerWidgetClass('selectOne', Widget_selectOne)
