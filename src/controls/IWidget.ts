import type { KnownCustomNodes } from 'src/wiki/customNodeList'
import { ComfyUIManagerKnownModelNames } from 'src/wiki/modelListType'

export type WidgetTypeHelpers<T, I, X extends { type: T }, S, O> = {
    $Input: I
    $Serial: X
    $State: S
    $Output: O
}
export type IWidget<T, I, X, S, O> = {
    id: string
    isOptional: boolean
    isVerticalByDefault: boolean
    isCollapsible: boolean
    type: T
    state: S
    readonly result: O
    readonly serial: X
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
export type WidgetInputFields<X> = X & {
    label?: string | false
    // labelPos?: LabelPos
    layout?: 'H' | 'V'
    group?: string
    tooltip?: string
    i18n?: { [key: string]: string }
    className?: string
    startCollapsed?: boolean
    showID?: boolean
    customNodes?: KnownCustomNodes | KnownCustomNodes[]
    customModels?: ComfyUIManagerKnownModelNames | ComfyUIManagerKnownModelNames[]
    // summary?: (self: X) => string
}
