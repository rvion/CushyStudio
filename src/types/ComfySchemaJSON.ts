// RAW -----------------------------------------------------------------
/** type of the file sent by the backend at /object_info */

export type ComfySchemaJSON = {
    [nodeTypeName: string]: ComfyNodeSchemaJSON
}

export type ComfyNodeSchemaJSON = {
    input: {
        required: { [inputName: string]: ComfyInputSpec }
        optional: { [inputName: string]: ComfyInputSpec }
    }
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
    multiline?: boolean
    default?: boolean | number | string
    min?: number
    max?: number
    step?: number
}

// export type ComfyInputOpts_String = {
//     multiline?: boolean
//     default?: string
// }

// export type ComfyInputOpts_Number = {
//     default?: number
//     min?: number
//     max?: number
//     step?: number
// }

// export type ComfyInputOpts_Boolean = {
//     default?: boolean
// }

// // prettier-ignore
// export type ComfyInputOpts =
//     | ComfyInputOpts_String
//     | ComfyInputOpts_Number
//     | ComfyInputOpts_Boolean
