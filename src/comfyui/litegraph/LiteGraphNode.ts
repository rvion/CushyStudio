import type { IsEqual } from '../../types/Misc'

import * as v from 'valibot'

import { type LiteGraphNodeInput, LiteGraphNodeInput_valibot } from './LiteGraphNodeInput'
import { type LiteGraphNodeOutput, LiteGraphNodeOutput_valibot } from './LiteGraphNodeOutput'

// prettier-ignore
export type LiteGraphNode = {
   id: number                        // 5
   type: string                      // 'CLIPTextEncode'

   // cosmetics
   title?: string                    // "Inpaint (Positive)",
   color?: string                    // "#222", or  "#3f789e"
   bgColor?: string                  // "#3f789e"
   pos: { '0': number; '1': number } // was: [number, number]
   size: { '0': number; '1': number }
   flags?: {}
   order?: number
   /**
    * 0 = normal
    * 1 = ?????
    * 2 = muted
    * */
   mode?: number
   inputs?: LiteGraphNodeInput[]
   outputs: LiteGraphNodeOutput[]

   isVirtualNode?: boolean // frontend only
   properties?: {
      /**
       * S&R stands for search and replace
       * // 💬 2024-11-13 rvion: do we want to populate taht someday soon
       */
      'Node name for S&R'?: string,

      /** when set to true, it.... */
      showOutputText?: boolean

      /** no clue what it does */
      horizontal?: boolean
   }
   widgets_values?: any[]
}

export const LiteGraphNode_valibot = v.strictObject({
   id: v.number(),
   title: v.optional(v.string()),
   color: v.optional(v.string()),
   bgcolor: v.optional(v.string()),
   type: v.string(),
   pos: v.strictObject({ 0: v.number(), 1: v.number() }),
   size: v.strictObject({ '0': v.number(), '1': v.number() }),
   flags: v.optional(v.strictObject({})),
   order: v.optional(v.number()),
   mode: v.optional(v.number()),
   inputs: v.optional(v.array(LiteGraphNodeInput_valibot)),
   outputs: v.array(LiteGraphNodeOutput_valibot),
   isVirtualNode: v.optional(v.boolean()),
   properties: v.optional(
      v.strictObject({
         horizontal: v.optional(v.boolean()),
         'Node name for S&R': v.optional(v.string()),
         showOutputText: v.optional(v.boolean()),
      }),
   ),
   widgets_values: v.optional(v.array(v.any())),
})

const check: IsEqual<LiteGraphNode, v.InferInput<typeof LiteGraphNode_valibot>> = true
