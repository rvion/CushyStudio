// import type { ComfyNodeType } from './Comfy'

export type ComfyPromptJSON = {
    [nodeUID: string]: ComfyNodeJSON
}

export type ComfyNodeJSON = {
    inputs: { [key: string]: any }
    class_type: string
}
