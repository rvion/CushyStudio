import type { ComfyNodeType } from './Comfy'

export type ComfyNodeJSON = {
    inputs: { [key: string]: any }
    class_type: ComfyNodeType
}

export type ComfyProjectJSON = {
    [key: string]: ComfyNodeJSON
}
