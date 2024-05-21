import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'

import { runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { makeAutoObservableInheritance } from '../../../utils/mobx-store-inheritance'
import { BaseWidget } from '../../BaseWidget'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetSelectOneUI } from './WidgetSelectOneUI'

export type BaseSelectEntry<T = string> = { id: T; label?: string }

// CONFIG
export type Widget_selectOne_config<T extends BaseSelectEntry> = WidgetConfigFields<
    {
        default?: T
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
        choices: T[] | ((self: Widget_selectOne<T>) => T[])
        /** set this to true if your choices are dynamically generated from the query directly, to disable local filtering */
        disableLocalFiltering?: boolean
        getLabelUI?: (t: T) => React.ReactNode
        appearance?: 'select' | 'tab'
    },
    Widget_selectOne_types<T>
>

// SERIAL FROM VALUE
export const Widget_selectOne_fromValue = <T extends BaseSelectEntry>(
    val: Widget_selectOne_value<T>,
): Widget_selectOne_serial<T> => ({
    type: 'selectOne',
    query: '',
    val,
})

// SERIAL
export type Widget_selectOne_serial<T extends BaseSelectEntry> = WidgetSerialFields<{
    type: 'selectOne'
    query: string
    val: T
}>

// VALUE
export type Widget_selectOne_value<T extends BaseSelectEntry> = T

// TYPES
export type Widget_selectOne_types<T extends BaseSelectEntry> = {
    $Type: 'selectOne'
    $Config: Widget_selectOne_config<T>
    $Serial: Widget_selectOne_serial<T>
    $Value: Widget_selectOne_value<T>
    $Widget: Widget_selectOne<T>
}

// STATE
export interface Widget_selectOne<T> extends Widget_selectOne_types<T> {}
export class Widget_selectOne<T extends BaseSelectEntry> extends BaseWidget implements IWidget<Widget_selectOne_types<T>> {
    DefaultHeaderUI = WidgetSelectOneUI
    DefaultBodyUI = undefined

    readonly id: string
    get config() { return this.spec.config } // prettier-ignore
    readonly type: 'selectOne' = 'selectOne'
    readonly serial: Widget_selectOne_serial<T>

    get baseErrors(): Maybe<string> {
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
            return _choices(this)
        }
        return _choices
    }

    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public readonly spec: ISpec<Widget_selectOne<T>>,
        serial?: Widget_selectOne_serial<T>,
    ) {
        super()
        const config = spec.config
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
        makeAutoObservableInheritance(this)
    }

    setValue(val: Widget_selectOne_value<T>) {
        this.value = val
    }
    set value(next: Widget_selectOne_value<T>) {
        if (this.serial.val === next) return
        runInAction(() => {
            this.serial.val = next
            this.bumpValue()
        })
    }
    get value(): Widget_selectOne_value<T> {
        return this.serial.val
    }
}

// DI
registerWidgetClass('selectOne', Widget_selectOne)
