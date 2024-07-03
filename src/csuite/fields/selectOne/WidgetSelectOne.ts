import type { IconName } from '../../icons/icons'
import type { Entity } from '../../model/Entity'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { TabPositionConfig } from '../choices/TabPositionConfig'

import { runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { Field } from '../../model/Field'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetSelectOneUI } from './WidgetSelectOneUI'

export type BaseSelectEntry<T = string> = {
    id: T
    label?: string
    icon?: IconName
}

export type SelectOneSkin = 'select' | 'tab' | 'roll'

// CONFIG
export type Field_selectOne_config<T extends BaseSelectEntry> = FieldConfig<
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
        choices: T[] | ((self: Field_selectOne<T>) => T[])
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
    Field_selectOne_types<T>
>

// SERIAL FROM VALUE
export const Field_selectOne_fromValue = <T extends BaseSelectEntry>(
    val: Field_selectOne_value<T>,
): Field_selectOne_serial<T> => ({ type: 'selectOne', val })

// SERIAL
export type Field_selectOne_serial<T extends BaseSelectEntry> = FieldSerial<{
    type: 'selectOne'
    query?: string
    val?: T
}>

// VALUE
export type Field_selectOne_value<T extends BaseSelectEntry> = T

// TYPES
export type Field_selectOne_types<T extends BaseSelectEntry> = {
    $Type: 'selectOne'
    $Config: Field_selectOne_config<T>
    $Serial: Field_selectOne_serial<T>
    $Value: Field_selectOne_value<T>
    $Field: Field_selectOne<T>
}

// STATE

const FAILOVER_VALUE: any = Object.freeze({ id: '❌', label: '❌' })

export class Field_selectOne<T extends BaseSelectEntry> //
    extends Field<Field_selectOne_types<T>>
{
    static readonly type: 'selectOne' = 'selectOne'
    DefaultHeaderUI = WidgetSelectOneUI
    DefaultBodyUI = undefined
    get baseErrors(): Maybe<string> {
        if (this.serial.val == null) return 'no value selected'
        const selected = this.choices.find((c) => c.id === this.serial.val.id)
        if (selected == null && !this.config.disableLocalFiltering) return 'selected value not in choices'
        return
    }

    get defaultValue(): T {
        return this.config.default ?? this.choices[0] ?? FAILOVER_VALUE
    }
    get hasChanges(): boolean {
        return this.serial.val.id !== this.defaultValue.id
    }
    reset(): void {
        this.value = this.defaultValue
    }

    get choices(): T[] {
        const _choices = this.config.choices
        if (typeof _choices === 'function') {
            if (!this.entity.ready) return []
            return _choices(this)
        }
        return _choices
    }

    constructor(
        // 2024-06-27 TODO: rename that
        // |            VVVV
        entity: Entity,
        parent: Field | null,
        schema: ISchema<Field_selectOne<T>>,
        serial?: Field_selectOne_serial<T>,
    ) {
        super(entity, parent, schema)
        const config = schema.config
        const choices = this.choices
        this.serial = serial ?? {
            type: 'selectOne',
            collapsed: config.startCollapsed,
            val: config.default ?? choices[0] ?? FAILOVER_VALUE,
        }
        if (this.serial.val == null && Array.isArray(this.config.choices)) this.serial.val = choices[0] ?? FAILOVER_VALUE
        this.init({
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    get value(): Field_selectOne_value<T> {
        return (
            this.serial.val ?? //
            this.config.default ??
            this.choices[0] ??
            FAILOVER_VALUE
        )
    }

    set value(next: Field_selectOne_value<T>) {
        if (this.serial.val === next) return
        const nextHasSameID = this.value.id === next.id
        runInAction(() => {
            this.serial.val = next
            if (!nextHasSameID) this.applyValueUpdateEffects()
            else this.applySerialUpdateEffects()
        })
    }
}

// DI
registerWidgetClass('selectOne', Field_selectOne)
