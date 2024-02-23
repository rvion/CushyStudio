// import { Static, Type } from '@sinclair/typebox'
// import { Value, ValueError } from '@sinclair/typebox/value'
// import { Either, resultFailure, resultSuccess } from 'src/types/Either'
// import { optionalString, string } from './schema'

// RAW -----------------------------------------------------------------
/** type of the file sent by the backend at /object_info */

import { z, ZodType } from 'zod'

// --------------------------------------------------------------------
export const ComfySchemaJSON_zod: ZodType<ComfySchemaJSON> = z.record(z.lazy(() => ComfyNodeSchemaJSON_zod))
export type ComfySchemaJSON = {
    [nodeTypeName: string]: ComfyNodeSchemaJSON
}

// --------------------------------------------------------------------
export const ComfyNodeSchemaJSON_zod: ZodType<ComfyNodeSchemaJSON> = z.object({
    input: z.object({
        required: z.record(z.lazy(() => ComfyInputSpec_zod)).optional(),
        optional: z.record(z.lazy(() => ComfyInputSpec_zod)).optional(),
    }),
    output: z.array(z.lazy(() => ComfyInputType_zod)),
    output_is_list: z.array(z.boolean()),
    output_name: z.array(z.string()),
    name: z.string(),
    display_name: z.string(),
    description: z.string(),
    category: z.string(),
    output_node: z.boolean(),
})
export type ComfyNodeSchemaJSON = {
    input: {
        required?: { [inputName: string]: ComfyInputSpec }
        optional?: { [inputName: string]: ComfyInputSpec }
    }
    output: ComfyInputType[]
    output_is_list: boolean[]
    output_name: string[]
    name: string
    display_name: string
    description: string
    category: string
    output_node: boolean
}

// --------------------------------------------------------------------
export const ComfyInputSpec_zod: ZodType<ComfyInputSpec> = z
    .union([
        //
        z.tuple([z.lazy(() => ComfyInputType_zod)]),
        z.tuple([z.lazy(() => ComfyInputType_zod), z.lazy(() => ComfyInputOpts_zod)]),
    ])
    .describe('ComfyInputSpec')

// prettier-ignore
export type ComfyInputSpec =
    | [ComfyInputType]
    | [ComfyInputType, ComfyInputOpts]

// --------------------------------------------------------------------
export const ComfyInputType_zod: ZodType<ComfyInputType> = z
    .union([
        //
        z.string().describe('node name or primitive'),
        z.lazy(() => ComfyEnumDef_zod),
    ])
    .describe('ComfyInputType')

export type ComfyInputType =
    /** node name or primitive */
    | string
    /** enum */
    | ComfyEnumDef

// --------------------------------------------------------------------
export const ComfyEnumDef_zod: ZodType<ComfyEnumDef> = z
    .array(
        z.union([
            //
            z.string(),
            z.number(),
            z.boolean(),
            z.object({
                content: z.string(),
                image: z.string().nullable().optional(),
            }),
        ]),
    )
    .describe('enum')
export type ComfyEnumDef = (string | boolean | number | { content: string; image?: any })[]

// --------------------------------------------------------------------
export const ComfyInputOpts_zod: ZodType<ComfyInputOpts> = z
    .union([
        z.string(), // <--- ❌ why does one node use "" as default ?
        z.object({
            multiline: z.boolean().nullable().optional(),
            default: z.union([z.boolean(), z.number(), z.string()]).nullable().optional(),
            forceInput: z.boolean().nullable().optional(),
            min: z.number().nullable().optional(),
            max: z.number().nullable().optional(),
            step: z.number().nullable().optional(),
        }),
    ])
    .describe('ComfyInputOpts')

export type ComfyInputOpts =
    | {
          multiline?: Maybe<boolean>
          default?: Maybe<boolean | number | string>
          forceInput?: Maybe<boolean>
          min?: Maybe<number>
          max?: Maybe<number>
          step?: Maybe<number>
      }
    | string

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
