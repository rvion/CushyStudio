import type { Form } from './Form'
import type { FC } from 'react'
import type { KnownCustomNode_File } from 'src/manager/custom-node-list/KnownCustomNode_File'
import type { KnownCustomNode_Title } from 'src/manager/custom-node-list/KnownCustomNode_Title'
import type { KnownCustomNode_CushyName } from 'src/manager/extension-node-map/KnownCustomNode_CushyName'
import type { KnownModel_Base } from 'src/manager/model-list/KnownModel_Base'
import type { KnownModel_Name } from 'src/manager/model-list/KnownModel_Name'
import type { ModelInfo } from 'src/manager/model-list/model-list-loader-types'

/**
 * base widget type; default type-level param when we work with unknown widget
 * still allow to use SharedConfig properties, and SharedSerial properties
 * */
export type $WidgetTypes = {
    $Type: string
    $Config: SharedWidgetConfig<any>
    $Serial: SharedWidgetSerial
    $Value: any
    $Widget: any
}

// prettier-ignore
export interface IWidget<K extends $WidgetTypes = $WidgetTypes> extends IWidgetMixins {
    $Type  : K['$Type']   /** type only properties; do not use directly; used to make typings good and fast */
    $Config: K['$Config'] /** type only properties; do not use directly; used to make typings good and fast */
    $Serial: K['$Serial'] /** type only properties; do not use directly; used to make typings good and fast */
    $Value : K['$Value']  /** type only properties; do not use directly; used to make typings good and fast */
    $Widget: K['$Widget'] /** type only properties; do not use directly; used to make typings good and fast */

    /** unique ID; each node in the form tree has one; persisted in serial */
    readonly id: string

    /** temporary hack; will get removed soon */
    readonly serialHash: string

    /** widget type; can be used instead of `instanceof` to known which wiget it is */
    readonly type: K['$Type']

    /** the provided config  */
    readonly config: K['$Config']

    /** wiget value is the simple/easy-to-use representation of that widget  */
    readonly value: K['$Value']

    /** wiget serial is the full serialized representation of that widget  */
    readonly serial: K['$Serial']

    /** root form this widget has benn registered to */
    readonly form: Form<any, any>

    /** if specified by the widget, override the default algorithm to decide if the widget shouldhave borders */
    border?: boolean

    /** if specified, override the default algorithm to decide if we should have label aligned */
    alignLabel?: boolean

    /** default header UI */
    readonly DefaultHeaderUI: FC<{ widget: K['$Widget'] }> | undefined

    /** default body UI */
    readonly DefaultBodyUI: FC<{ widget: K['$Widget'] }> | undefined
}

/**
 * those properties will be dynamically injected in every widget
 * by calling `applyWidgetMixinV2(this)` in the constructor,
 * Before the makeAutoObservable(this) call. If you're adding a new
 * base widget, you're expected to do that too.
 */
export type IWidgetMixins = {
    // UI ------------------------------------------------------
    // value stuff
    ui(): JSX.Element
    body(): JSX.Element | undefined
    header(): JSX.Element | undefined
    defaultBody(): JSX.Element | undefined
    defaultHeader(): JSX.Element | undefined

    // FOLD ----------------------------------------------------
    setCollapsed(
        /** true: collapse; false: expanded */
        val: boolean | undefined,
    ): void

    /** toggle widget fold <-> unfolded */
    toggleCollapsed(): void

    // BUMP ----------------------------------------------------
    /**
     * Notify form that the value has been udpated
     * (and bump serial.lastUpdatedAt to Date.now())
     * 👉 Every widget must call this when value has been updated
     * */
    bumpValue(): void

    /**
     * Notify form that a non-value serial has been udpated
     * 👉 every widget must call this when non-value serial has been updated
     * */
    bumpSerial(): void
}

/** 🔶 2024-03-13 rvion: TODO: remove that function; use ['$Value'] instead */
export type GetWidgetResult<Widget> = Widget extends { $Value: infer Value } ? Value : never

/** 🔶 2024-03-13 rvion: TODO: remove that function; use ['$Serial'] instead */
export type GetWidgetState<Widget> = Widget extends { $Serial: infer Serial } ? Serial : never

/** common properties we expect to see in a widget serial */
export type SharedWidgetSerial = {
    id: string
    type: string
    collapsed?: boolean
    lastUpdatedAt?: number
    /** unused internally, here so you can add whatever you want inside */
    custom?: any
}

export type WidgetSerialFields<X> = X & SharedWidgetSerial
export type WidgetConfigFields<X, T extends $WidgetTypes> = X & SharedWidgetConfig<T>
export type SharedWidgetConfig<T extends $WidgetTypes> = {
    /** allow to specify custom headers */
    header?: null | ((p: { widget: T['$Widget'] }) => JSX.Element)

    /** allow to specify custom body */
    body?: null | ((p: { widget: T['$Widget'] }) => JSX.Element)

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

    /** The widget requirements */
    requirements?: Requirements[]

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
}

/**
 * cushy-specific types to allow
 * 2024-03-13 rvion: TODO: split outside of this file, add a new type-level config for
 * project-specific FormNode metadata
 */
export type Requirements =
    // models
    | { type: 'modelInCivitai'; civitaiURL: string; optional?: true; base: KnownModel_Base }
    | { type: 'modelInManager'; modelName: KnownModel_Name; optional?: true }
    | { type: 'modelCustom'; infos: ModelInfo; optional?: true }

    // custom nodes
    | { type: 'customNodesByTitle'; title: KnownCustomNode_Title; optional?: true }
    | { type: 'customNodesByURI'; uri: KnownCustomNode_File; optional?: true }
    | { type: 'customNodesByNameInCushy'; nodeName: KnownCustomNode_CushyName; optional?: true }
