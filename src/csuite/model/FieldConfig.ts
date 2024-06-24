import type { Box } from '../box/Box'
import type { IconName } from '../icons/icons'
import type { TintExt } from '../kolor/Tint'
import type { CovariantFn, CovariantFnX } from '../variance/BivariantHack'
import type { CovariantFC } from '../variance/CovariantFC'
import type { $FieldTypes } from './$FieldTypes'
import type { Problem_Ext } from './Validation'

export type FieldConfig<X, T extends $FieldTypes> = X & FieldConfig_CommonProperties<T>

export interface FieldConfig_CommonProperties<out T extends $FieldTypes> {
    /**
     * @since 2024-05-20
     * @stability beta
     * Icon name from the icon library.
     *   - "mdi..." for Material design icons - 7000+ icons https://pictogrammers.com/library/mdi/)
     *   - "cdi..." for Cushy design icons - 1+ custom icon by the cushy team
     *   - "ldi..." for Locomotive design icons
     */
    icon?: IconName

    // ❌ warning: 2024-06-14 rvion: using this expression with an union here will
    // ❌ CHOKE typescript typechecking performances.
    // icon?: IconName | CovariantFn<T['$Field'], IconName> // IconName

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
    onCreate?: CovariantFn<T['$Field'], void> // & { evaluationKey?: string }
    onCreateKey?: string

    /**
     * @since 2024-05-14
     * @stability beta
     * This function will be executed either on every widget instanciation.
     */
    onInit?: CovariantFn<T['$Field'], void>

    /** allow to specify custom headers */
    header?: null | CovariantFC<{ widget: T['$Field'] }>

    /** allow to specify custom body */
    body?: null | CovariantFC<{ widget: T['$Field'] }>

    /** will be called when value changed */
    onValueChange?: CovariantFnX<[val: T['$Value'], self: T['$Field']], void>

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
    check?: CovariantFnX<[val: T['$Field']], Problem_Ext>

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
    border?: TintExt

    /** frame background used in the widget with label */
    background?: TintExt

    /** if provided, override the default logic to decide if the widget need to be bordered */
    justifyLabel?: boolean

    /** if provided, widget will be hidden */
    hidden?: boolean

    /** unused internally, here so you can add whatever you want inside */
    custom?: any
}

export interface WidgetMenuAction<out T extends $FieldTypes> {
    /** https://pictogrammers.com/library/mdi/ */
    label: string
    icon?: IconName
    apply(form: T['$Field']): void
}
