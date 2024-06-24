import type { IconName } from '../../icons/icons'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { IBlueprint } from '../../model/IBlueprint'
import type { Model } from '../../model/Model'
import type { TabPositionConfig } from '../choices/TabPositionConfig'

import { runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { BaseField } from '../../model/BaseField'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetSelectOneUI } from './WidgetSelectOneUI'

export type BaseSelectEntry<T = string> = {
    id: T
    label?: string
    icon?: IconName
}

export type SelectOneSkin = 'select' | 'tab' | 'roll'

// CONFIG
export type Widget_selectOne_config<T extends BaseSelectEntry> = FieldConfig<
    {
        default?: NoInfer<T>
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
        appearance?: SelectOneSkin

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
export type Widget_selectOne_serial<T extends BaseSelectEntry> = FieldSerial<{
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
    $Field: Widget_selectOne<T>
}

// STATE

const FAILOVER_VALUE: any = Object.freeze({ id: '❌', label: '❌' })

export class Widget_selectOne<T extends BaseSelectEntry> //
    extends BaseField<Widget_selectOne_types<T>>
{
    DefaultHeaderUI = WidgetSelectOneUI
    DefaultBodyUI = undefined

    readonly id: string

    readonly type: 'selectOne' = 'selectOne'
    readonly serial: Widget_selectOne_serial<T>

    get baseErrors(): Maybe<string> {
        if (this.serial.val == null) return 'no value selected'
        const selected = this.choices.find((c) => c.id === this.serial.val.id)
        if (selected == null && !this.config.disableLocalFiltering) return 'selected value not in choices'
        return
    }

    get defaultValue(): T {
        return this.config.default ?? this.choices[0] ?? FAILOVER_VALUE
    }
    get hasChanges() {
        return this.serial.val.id !== this.defaultValue.id
    }
    reset = () => {
        this.value = this.defaultValue
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
        public readonly form: Model,
        public readonly parent: BaseField | null,
        public readonly spec: IBlueprint<Widget_selectOne<T>>,
        serial?: Widget_selectOne_serial<T>,
    ) {
        super()
        this.id = serial?.id ?? nanoid()
        const config = spec.config
        const choices = this.choices
        this.serial = serial ?? {
            type: 'selectOne',
            collapsed: config.startCollapsed,
            id: this.id,
            query: '',
            val: config.default ?? choices[0] ?? FAILOVER_VALUE,
        }
        if (this.serial.val == null && Array.isArray(this.config.choices)) this.serial.val = choices[0] ?? FAILOVER_VALUE
        this.init({
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    setValue(val: Widget_selectOne_value<T>) {
        this.value = val
    }
    set value(next: Widget_selectOne_value<T>) {
        if (this.serial.val === next) return
        const nextHasSameID = this.serial.val.id === next.id
        runInAction(() => {
            this.serial.val = next
            if (!nextHasSameID) this.bumpValue()
            else this.bumpSerial()
        })
    }
    get value(): Widget_selectOne_value<T> {
        return this.serial.val
    }
}

// DI
registerWidgetClass('selectOne', Widget_selectOne)
