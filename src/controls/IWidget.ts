import type { Form } from './Form'
import type { FC } from 'react'
import type { KnownCustomNode_File } from 'src/manager/custom-node-list/KnownCustomNode_File'
import type { KnownCustomNode_Title } from 'src/manager/custom-node-list/KnownCustomNode_Title'
import type { KnownCustomNode_CushyName } from 'src/manager/extension-node-map/KnownCustomNode_CushyName'
import type { KnownModel_Base } from 'src/manager/model-list/KnownModel_Base'
import type { KnownModel_Name } from 'src/manager/model-list/KnownModel_Name'
import type { ModelInfo } from 'src/manager/model-list/model-list-loader-types'

export type $WidgetTypes = {
    $Type: string
    $Input: SharedWidgetConfig
    $Serial: SharedWidgetSerial
    $Output: any
    $Widget: any
}

export type IWidget<K extends $WidgetTypes = $WidgetTypes> = {
    $Type: K['$Type']
    $Input: K['$Input']
    $Serial: K['$Serial']
    $Output: K['$Output']
    $Widget: K['$Widget']

    id: string
    readonly serialHash: string
    readonly type: K['$Type']
    readonly value: K['$Output']
    readonly serial: K['$Serial']
    readonly form: Form<any>
    readonly config: K['$Input'] // WidgetConfigFields<any>

    /** if specified, override the default algorithm to decide if we should have borders */
    border?: boolean
    /** if specified, override the default algorithm to decide if we should have label aligned */
    alignLabel?: boolean
    HeaderUI: FC<{ widget: K['$Widget'] }> | undefined
    BodyUI: FC<{ widget: K['$Widget'] }> | undefined
    // FULLY_CUSTOM_RENDER?: boolean
}

export type GetWidgetResult<Widget> = Widget extends { $Output: infer O } ? O : never
export type GetWidgetState<Widget> = Widget extends { $Serial: infer S } ? S : never

export type LabelPos = 'start' | 'end'
export type SharedWidgetSerial = {
    id: string
    type: string
    collapsed?: boolean
}

export type WidgetSerialFields<X> = X & SharedWidgetSerial
export type WidgetConfigFields<X> = X & SharedWidgetConfig
export type SharedWidgetConfig = {
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
}

export type Requirements =
    // models
    | { type: 'modelInCivitai'; civitaiURL: string; optional?: true; base: KnownModel_Base }
    | { type: 'modelInManager'; modelName: KnownModel_Name; optional?: true }
    | { type: 'modelCustom'; infos: ModelInfo; optional?: true }
    // custom nodes
    | { type: 'customNodesByTitle'; title: KnownCustomNode_Title; optional?: true }
    | { type: 'customNodesByURI'; uri: KnownCustomNode_File; optional?: true }
    | { type: 'customNodesByNameInCushy'; nodeName: KnownCustomNode_CushyName; optional?: true }
