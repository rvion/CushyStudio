import type { KnownCustomNode_File } from 'src/manager/custom-node-list/KnownCustomNode_File'
import type { KnownCustomNode_Title } from 'src/manager/custom-node-list/KnownCustomNode_Title'
import type { KnownCustomNode_CushyName } from 'src/manager/extension-node-map/KnownCustomNode_CushyName'
import type { KnownModel_Base } from 'src/manager/model-list/KnownModel_Base'
import type { KnownModel_Name } from 'src/manager/model-list/KnownModel_Name'
import type { ModelInfo } from 'src/manager/model-list/model-list-loader-types'
import type { FormBuilder } from './FormBuilder'

export type WidgetTypeHelpers_OLD<T, I, X extends { type: T }, S, O> = {
    $Input: I
    $Serial: X
    $Output: O
}

type $WidgetTypes = {
    $Type: any
    $Input: any
    $Serial: any
    $Output: any
}

export type WidgetTypeHelpers<K extends $WidgetTypes> = {
    $Type: K['$Type']
    $Input: K['$Input']
    $Serial: K['$Serial']
    $Output: K['$Output']
}

export type IWidget_OLD<T, I, X, S, O> = {
    id: string
    isVerticalByDefault: boolean
    isCollapsible: boolean
    readonly serialHash: string
    readonly type: T
    readonly value: O
    readonly serial: X
    readonly form: FormBuilder
    readonly config: WidgetConfigFields<any>
}

export type IWidget<K extends $WidgetTypes> = {
    id: string
    isVerticalByDefault: boolean
    isCollapsible: boolean
    readonly serialHash: string
    readonly type: K['$Type']
    readonly value: K['$Output']
    readonly serial: K['$Serial']
    readonly form: FormBuilder
    readonly config: WidgetConfigFields<any>
}

export type GetWidgetResult<Req> = Req extends WidgetTypeHelpers_OLD<any, any, any, any, infer O> ? O : never
export type GetWidgetState<Req> = Req extends WidgetTypeHelpers_OLD<any, any, any, infer S, any> ? S : never

export type LabelPos = 'start' | 'end'
export type WidgetSerialFields<X> = X & {
    id: string
    collapsed?: boolean
    // vertical?: boolean
}

// do not need to be serializable
export type WidgetConfigFields<X> = X & {
    label?: string | false
    layout?: 'H' | 'V'
    tooltip?: string
    i18n?: { [key: string]: string }
    className?: string
    startCollapsed?: boolean
    showID?: boolean
    requirements?: Requirements[]
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
