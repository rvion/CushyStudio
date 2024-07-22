import type { IconName } from '../../icons/icons'
import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { TabPositionConfig } from '../choices/TabPositionConfig'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'
import { WidgetSelectOne_CellUI } from './WidgetSelectOne_CellUI'
import { WidgetSelectOneUI } from './WidgetSelectOneUI'

export type BaseSelectEntry<T = string> = {
    id: T
    label?: string
    icon?: IconName
    hue?: number
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
): Field_selectOne_serial<T> => ({ $: 'selectOne', val })

// SERIAL
export type Field_selectOne_serial<T extends BaseSelectEntry> = FieldSerial<{
    $: 'selectOne'
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
    DefaultCellUI = WidgetSelectOne_CellUI

    get ownProblems(): Maybe<string> {
        if (this.serial.val == null) return 'no value selected'
        const selected = this.choices.find((c) => c.id === this.serial.val?.id)
        if (selected == null && !this.config.disableLocalFiltering) return 'selected value not in choices'
        return
    }

    get hasChanges(): boolean {
        return this.serial.val?.id !== this.defaultValue.id
    }

    reset(): void {
        this.value = this.defaultValue
    }

    get choices(): T[] {
        const _choices = this.config.choices
        if (typeof _choices === 'function') {
            if (!this.root.ready) return []
            return _choices(this)
        }
        return _choices
    }

    constructor(
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_selectOne<T>>,
        serial?: Field_selectOne_serial<T>,
    ) {
        super(repo, root, parent, schema)
        this.init(serial, {
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
            DefaultCellUI: false,
        })
    }

    get defaultValue(): T {
        return (
            this.config.default ?? //
            this.choices[0] ??
            FAILOVER_VALUE
        )
    }

    protected setOwnSerial(serial: Maybe<Field_selectOne_serial<T>>): void {
        this.serial.val = serial?.val ?? this.defaultValue
        this.serial.query = serial?.query
    }

    get value(): Field_selectOne_value<T> {
        // 🔴 si pas de serial.val "ma valeur par défaut" s'affiche dans l'UI
        // mais n'est pas saved dans le serial?
        // (en fait non l'UI utilise serial.val, mais quand même, confusing que JSON(field.value) != JSON(field.serial).value) non?
        return this.serial.val ?? this.defaultValue
    }

    set value(next: Field_selectOne_value<T>) {
        if (this.serial.val === next) return

        this.runInValueTransaction(() => {
            this.serial.val = next

            // 2024-07-08 rvion:
            // | when setting a value with equal id, we may be actually changing the SelectEntry
            // | (cached name could be different, etc.)
            // | since it's a bit complicated, let's not care today. if this cause a bug, let's improve
            // | that later

            // ⏸️ const nextHasSameID = this.value.id === next.id
            // ⏸️ if (!nextHasSameID) this.applyValueUpdateEffects()
            // ⏸️ else this.applySerialUpdateEffects()
        })
    }

    renderAsCell(this: Field_selectOne<T>, p?: { reveal?: boolean }): JSX.Element {
        return <this.DefaultCellUI field={this} opts={p} {...p} />
    }
}

// DI
registerFieldClass('selectOne', Field_selectOne)
