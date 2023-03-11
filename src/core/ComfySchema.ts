/** type of the file sent by the backend at /object_info */
export type ComfySchema = { [nodeTypeName: string]: ComfyNodeSchema }

export type ComfyNodeSchema = {
    input: { required: { [inputName: string]: ComfyInputSpec } }
    output: string[]
    name: string
    description: string
    category: string
}

export type ComfyInputSpec = [ComfyInputType] | [ComfyInputType, ComfyInputOpts]

export type ComfyInputType =
    /** node name or primitive */
    | string
    /** enum */
    | string[]

export type ComfyInputOpts = {
    [key: string]: any
}
