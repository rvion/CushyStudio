import type { IconName } from '../icons/icons'
import type { Box } from '../rsuite/box/Box'
import type { Kolor } from '../rsuite/kolor/Kolor'
import type { BaseWidget } from './BaseWidget'
import type { Form } from './Form'
import type { ISpec } from './ISpec'
import type { CovariantFn } from './utils/BivariantHack'
import type { CovariantFC } from './utils/CovariantFC'
import type { Problem_Ext } from './Validation'

/**
 * base widget type; default type-level param when we work with unknown widget
 * still allow to use SharedConfig properties, and SharedSerial properties
 * */
export type $WidgetTypes = {
    $Type: string
    $Config: SharedWidgetConfig<any>
    $Serial: SharedWidgetSerial
    $Value: any
    $Widget: IWidget<$WidgetTypes>
}

export const isWidget = (x: any): x is IWidget => {
    return (
        x != null && //
        typeof x === 'object' &&
        '$WidgetSym' in x &&
        x.$WidgetSym === $WidgetSym
    )
}

export interface IWidget<K extends $WidgetTypes = $WidgetTypes> extends BaseWidget {
    // ---------------------------------------------------------------------------------------------------
    $Type: K['$Type'] /** type only properties; do not use directly; used to make typings good and fast */
    $Config: K['$Config'] /** type only properties; do not use directly; used to make typings good and fast */
    $Serial: K['$Serial'] /** type only properties; do not use directly; used to make typings good and fast */
    $Value: K['$Value'] /** type only properties; do not use directly; used to make typings good and fast */
    $Widget: K['$Widget'] /** type only properties; do not use directly; used to make typings good and fast */

    // ---------------------------------------------------------------------------------------------------
    /** unique ID; each node in the form tree has one; persisted in serial */
    readonly id: string

    /** spec used to instanciate this widget */
    readonly spec: ISpec<any>

    /** widget type; can be used instead of `instanceof` to known which wiget it is */
    readonly type: K['$Type']

    /** the provided config  */
    readonly config: K['$Config']

    /** wiget value is the simple/easy-to-use representation of that widget  */
    readonly value: K['$Value']

    /** wiget serial is the full serialized representation of that widget  */
    readonly serial: K['$Serial']

    /** base validation errors specific to this widget; */
    readonly baseErrors: Problem_Ext

    /** unified api to allow setting serial from value */
    setValue(val: K['$Value']): void

    // ---------------------------------------------------------------------------------------------------

    /** if specified, override the default algorithm to decide if the widget should have label aligned */
    alignLabel?: boolean

    // 2024-03-27 rvion: not really a fan of those options
    /** if specified, override the default algorithm to decide if the widget container should have a background of base-100 */
    background?: boolean

    // ---------------------------------------------------------------------------------------------------
    /** default header UI */
    readonly DefaultHeaderUI: CovariantFC<{ widget: K['$Widget'] }> | undefined

    /** default body UI */
    readonly DefaultBodyUI: CovariantFC<{ widget: K['$Widget'] }> | undefined
}

export const $WidgetSym = Symbol('Widget')

/** 🔶 2024-03-13 rvion: TODO: remove that function; use ['$Value'] instead */
export type GetWidgetResult<Widget> = Widget extends { $Value: infer Value } ? Value : never

/** 🔶 2024-03-13 rvion: TODO: remove that function; use ['$Serial'] instead */
export type GetWidgetState<Widget> = Widget extends { $Serial: infer Serial } ? Serial : never

/** common properties we expect to see in a widget serial */
export type SharedWidgetSerial = {
    id?: string
    /** name of the widget, so we can later re-instanciate a widget from this */
    type: string
    /** if true, widget should be displayed folded when it make sense in given context */
    collapsed?: boolean
    /** timestap this widget was last updated */
    lastUpdatedAt?: number
    /** unused internally, here so you can add whatever you want inside */
    custom?: any

    /**
     * DO NOT MANUALLY SET THIS VALUE;
     * this value will be set by the init() function (BaseWidget class)
     * use to know if the onCreate function should be re-run or not
     * */
    _creationKey?: string
}

export type WidgetSerialFields<X> = X & SharedWidgetSerial
export type WidgetConfigFields<X, T extends $WidgetTypes> = X & SharedWidgetConfig<T>

export type WidgetMenuAction<T extends $WidgetTypes> = {
    /** https://pictogrammers.com/library/mdi/ */
    label: string
    icon?: IconName
    apply: (form: T['$Widget']) => void
}

export type SharedWidgetConfig<T extends $WidgetTypes> = {
    /**
     * @since 2024-05-20
     * @stability beta
     * Icon name from the icon library.
     *   - "mdi..." for Material design icons - 7000+ icons https://pictogrammers.com/library/mdi/)
     *   - "cdi..." for Cushy design icons - 1+ custom icon by the cushy team
     */
    icon?: IconName | CovariantFn<T['$Widget'], IconName> // IconName
    /**
     * @since 2024-05-19
     * @stability beta
     * Appearance box props
     */
    box?: Box

    /**
     * @since 2024-05-14
     * @stability beta
     * This function will be executed either on first creation, or when the
     * evaluationKey changes. The evaluationKey is stored in the group serial.
     */
    onCreate?: CovariantFn<T['$Widget'], void> & { evaluationKey?: string }

    /**
     * @since 2024-05-14
     * @stability beta
     * This function will be executed either on every widget instanciation.
     */
    onInit?: CovariantFn<T['$Widget'], void>

    /** allow to specify custom headers */
    header?: null | ((p: { widget: T['$Widget'] }) => JSX.Element)

    /** allow to specify custom body */
    body?: null | ((p: { widget: T['$Widget'] }) => JSX.Element)

    /** will be called when value changed */
    onValueChange?: (val: T['$Value'], self: T['$Widget']) => void

    /** allow to set custom actions on your widgets */
    presets?: WidgetMenuAction<T>[]

    /** custom type checking;
     * valid:
     *  - true,
     *  - [],
     * invalid:
     *  - false,
     *  - ["errMsg", ...]
     *  - "errMsg"
     * */
    check?: (val: T['$Widget']) => Problem_Ext

    /**
     * The label to display.
     * If none provided, the parent key is going to be converted as label.
     * - use false to disable
     * - use "" for an emtpy string label
     */
    label?: string | false

    /** The layout direction, H for 'horizontal' or V for 'vertical' */
    layout?: 'H' | 'V'

    /** if provided, will dispaly a tooltip when hovering over the label */
    tooltip?: string

    /**
     * Will be injected around the widget;
     * Allow you to customize look and feel a bit without having
     * to use custom widgets
     * */

    className?: string

    /**
     * [DEBUG FEATURE] show the ID right after the label
     * may be usefull when debugging dynamic widgets referencing themselves.
     */
    showID?: boolean

    // ⏸️ /** The widget requirements */
    // ⏸️ requirements?: Requirements[]

    /**
     * override the default `collapsed` status
     * only taken into account when widget is collapsible
     */
    startCollapsed?: boolean

    /** if false, the widget will always be expanded */
    collapsed?: false

    /** if provided, override the default logic to decide if the widget need to be bordered */
    border?: boolean

    /** if provided, override the default logic to decide if the widget need to be bordered */
    alignLabel?: boolean

    /** if provided, widget will be hidden */
    hidden?: boolean

    /** unused internally, here so you can add whatever you want inside */
    custom?: any
}
