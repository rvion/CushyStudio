import type { Box } from '../csuite/box/Box'
import type { IconName } from '../csuite/icons/icons'
import type { KolorExt } from '../csuite/kolor/Kolor'
import type { $WidgetTypes } from './$WidgetTypes'
import type { CovariantFn } from './utils/BivariantHack'
import type { Problem_Ext } from './Validation'

export type WidgetConfig<X, T extends $WidgetTypes> = X & WidgetConfig_CommonProperties<T>

export type WidgetConfig_CommonProperties<T extends $WidgetTypes> = {
    /**
     * @since 2024-05-20
     * @stability beta
     * Icon name from the icon library.
     *   - "mdi..." for Material design icons - 7000+ icons https://pictogrammers.com/library/mdi/)
     *   - "cdi..." for Cushy design icons - 1+ custom icon by the cushy team
     *   - "ldi..." for Locomotive design icons
     */
    icon?: IconName // | CovariantFn<T['$Widget'], IconName> // IconName

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

    /**
     * override the default `collapsed` status
     * only taken into account when widget is collapsible
     */
    startCollapsed?: boolean

    /** if false, the widget will always be expanded */
    collapsed?: false

    /** if provided, override the default logic to decide if the widget need to be bordered */
    border?: KolorExt

    /** frame background used in the widget with label */
    background?: KolorExt

    /** if provided, override the default logic to decide if the widget need to be bordered */
    justifyLabel?: boolean

    /** if provided, widget will be hidden */
    hidden?: boolean

    /** unused internally, here so you can add whatever you want inside */
    custom?: any
}

export type WidgetMenuAction<T extends $WidgetTypes> = {
    /** https://pictogrammers.com/library/mdi/ */
    label: string
    icon?: IconName
    apply: (form: T['$Widget']) => void
}
