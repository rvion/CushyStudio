import type { ComfyNodeType } from './Comfy'

export type ComfyPromptJSON = {
    [key: string]: ComfyNodeJSON
}

export type ComfyNodeJSON = {
    inputs: { [key: string]: any }
    class_type: ComfyNodeType
}
