// Import all valibot functions under the namespace 'v'
import * as v from 'valibot'

// #region ComfySchemaJSON
export type ComfySchemaJSON = v.InferInput<typeof ComfySchemaJSON_valibot>
export const ComfySchemaJSON_valibot = v.record(
   v.string(),
   v.lazy(() => ComfyNodeSchemaJSON_valibot),
)

// #region ComfyNodeSchemaJSON
export type ComfyNodeSchemaJSON = v.InferInput<typeof ComfyNodeSchemaJSON_valibot>
export const ComfyNodeSchemaJSON_valibot = v.strictObject({
   input: v.strictObject({
      required: v.optional(
         v.record(
            v.string(),
            v.lazy(() => ComfyInputSpec_valibot),
         ),
      ),
      optional: v.optional(
         v.record(
            v.string(),
            v.lazy(() => ComfyInputSpec_valibot),
         ),
      ),
      hidden: v.optional(
         v.record(
            v.string(),
            v.lazy(() => ComfyInputHiddenEntry_valibot),
         ),
      ),
   }),
   input_order: v.optional(
      v.strictObject({
         required: v.optional(v.array(v.string())),
         optional: v.optional(v.array(v.string())),
         hidden: v.optional(v.array(v.string())),
      }),
   ),
   output: v.array(v.lazy(() => ComfyInputType_valibot)),
   output_is_list: v.array(v.boolean()),
   output_name: v.array(v.string()),
   name: v.string(),
   display_name: v.string(),
   description: v.string(),
   /**  */
   python_module: v.string(),
   category: v.string(),
   output_node: v.boolean(),
   output_tooltips: v.optional(v.array(v.string())),
   // Stability Flags
   deprecated: v.optional(v.boolean()),
   experimental: v.optional(v.boolean()),
})

// #region  ComfyInputSpec

export type ComfyInputSpec = v.InferInput<typeof ComfyInputSpec_valibot>
export const ComfyInputSpec_valibot = v.union([
   v.tuple([v.lazy(() => ComfyInputType_valibot), v.lazy(() => ComfyInputOpts_valibot)]),
   v.tuple([v.lazy(() => ComfyInputType_valibot)]),
   // means it's broken,
   // example: https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/d80fcc5e2db2fe0eea071f6065b1f4a4ad354b2f.jpg
   v.tuple([v.null()]),
])
// .description('ComfyInputSpec')

// #region  ComfyInputHiddenEntry
export type ComfyInputHiddenEntrySpec = v.InferInput<typeof ComfyInputHiddenEntry_valibot>
export const ComfyInputHiddenEntry_valibot = v.union([
   //
   v.string(),
   // BROKEN STUFF (e.g. found in several 'rgthree' nodes)
   v.array(v.array(v.literal('CHOOSE'))),
   // BROKEN STUFF (e.g. found in "ttN xyPlot")
   v.array(v.record(v.string(), v.any())),
]) //'ComfyInputHiddenEntry'

// #region  ComfyInputType
export type ComfyInputType = v.InferInput<typeof ComfyInputType_valibot>
export const ComfyInputType_valibot = v.union([
   v.string(), //, 'node name or primitive'),
   v.lazy(() => ComfyEnumDef_valibot),
])
// .description('ComfyInputType')

// #region  ComfyEnumDef
export type ComfyEnumDef = v.InferInput<typeof ComfyEnumDef_valibot>
export const ComfyEnumDef_valibot = v.array(
   v.union([
      v.string(),
      v.number(),
      v.boolean(),
      v.strictObject({
         content: v.string(),
         image: v.optional(v.nullable(v.string())),
      }),
   ]),
)
// .description('enum')

// #region  ComfyInputOpts
export type ComfyInputOpts = v.InferInput<typeof ComfyInputOpts_valibot>
export const ComfyInputOpts_valibot = v.union([
   v.string(),
   v.strictObject({
      tooltip: v.optional(v.nullable(v.string())),
      multiline: v.optional(v.nullable(v.boolean())),
      default: v.optional(v.nullable(v.union([v.boolean(), v.number(), v.string()]))),
      forceInput: v.optional(v.nullable(v.boolean())),
      min: v.optional(v.nullable(v.number())),
      round: v.optional(v.nullable(v.union([v.boolean(), v.number()]))),
      max: v.optional(v.nullable(v.number())),
      step: v.optional(v.nullable(v.number())),
      /** Observed on 2024-11-01; 171 occurrences */
      dynamicPrompts: v.optional(v.boolean()),
      padding: v.optional(v.boolean()),
   }),
])
// .description('ComfyInputOpts')
