// RAW -----------------------------------------------------------------
/** type of the file sent by the backend at /object_info */

export type ComfySchemaJSON = { [nodeTypeName: string]: ComfyNodeSchemaJSON }

export type ComfyNodeSchemaJSON = {
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
