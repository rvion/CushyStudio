import type { FormBuilder } from './FormBuilder'
import type { ComfySchemaL } from 'src/models/Schema'
import type { ComfyUIManagerKnownCustomNode_Files, ComfyUIManagerKnownCustomNode_Title } from 'src/wiki/customNodeListTypes'
import type { KnownInstallableCustomNodeCushyName } from 'src/wiki/extension-node-map/extension-node-map-enums'
import type { RecommendedModelDownload } from './EnumDefault'

export type WidgetTypeHelpers<T, I, X extends { type: T }, S, O> = {
    $Input: I
    $Serial: X
    $Output: O
}

type IIII = {
    $Type: any
    $Input: any
    $Serial: any
    $Output: any
}

export type WidgetTypeHelpers2<K extends IIII> = {
    $Type: K['$Type']
    $Input: K['$Input']
    $Serial: K['$Serial']
    $Output: K['$Output']
}

export type IWidget<T, I, X, S, O> = {
    id: string
    isOptional: boolean
    isVerticalByDefault: boolean
    isCollapsible: boolean
    type: T
    // state: S
    readonly result: O
    readonly serial: X
    readonly builder: FormBuilder
    readonly schema: ComfySchemaL
    readonly config: WidgetConfigFields<any>
}

export type IWidget2<K extends IIII> = {
    id: string
    isOptional: boolean
    isVerticalByDefault: boolean
    isCollapsible: boolean
    type: K['$Type']
    readonly result: K['$Output']
    readonly serial: K['$Serial']
    readonly builder: FormBuilder
    readonly schema: ComfySchemaL
    readonly config: WidgetConfigFields<any>
}

export type GetWidgetResult<Req> = Req extends WidgetTypeHelpers<any, any, any, any, infer O> ? O : never
export type GetWidgetState<Req> = Req extends WidgetTypeHelpers<any, any, any, infer S, any> ? S : never

export type LabelPos = 'start' | 'end'
export type WidgetStateFields<X> = X & {
    id: string
    active?: boolean
    collapsed?: boolean
    vertical?: boolean
}

// do not need to be serializable
export type WidgetConfigFields<X> = X & {
    label?: string | false
    // labelPos?: LabelPos
    layout?: 'H' | 'V'
    group?: string
    tooltip?: string
    i18n?: { [key: string]: string }
    className?: string
    startCollapsed?: boolean
    showID?: boolean
    recommandedModels?: RecommendedModelDownload
    // summary?: (self: X) => string
} & CustomNodeRecommandation

export type CustomNodeRecommandation = {
    customNodesByTitle?: ComfyUIManagerKnownCustomNode_Title | ComfyUIManagerKnownCustomNode_Title[]
    customNodesByURI?: ComfyUIManagerKnownCustomNode_Files | ComfyUIManagerKnownCustomNode_Files[]
    customNodesByNameInCushy?: KnownInstallableCustomNodeCushyName | KnownInstallableCustomNodeCushyName[]
    // customNodesByNameInComfy?: KnownInstallableCustomNodeComfyName | KnownInstallableCustomNodeComfyName[]
}
