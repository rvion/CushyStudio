import type { KnownComfyPluginTitle } from '../generated/KnownComfyPluginTitle'

import * as v from 'valibot'

/**
 * manually checked on: ❌ // TODO
 */
export type ComfyManagerAPIPluginList = {
   custom_nodes: {
      title: KnownComfyPluginTitle
      installed: 'False' | 'True' | 'Update' /* ... */
   }[]
   // TODO: check enums
   chanel: string
}

// #region valibot
export const ComfyManagerAPIPluginList_valibot = v.strictObject({
   custom_nodes: v.array(
      v.strictObject({
         title: v.custom<KnownComfyPluginTitle>((v) => typeof v === 'string', 'not a valid string'),
         installed: v.union([v.literal('False'), v.literal('True'), v.literal('Update')]),
      }),
   ),
   chanel: v.string(),
})

// check that the valibot schema match the manually written type
/* ✅ */ type T1 = v.InferInput<typeof ComfyManagerAPIPluginList_valibot>
/* ✅ */ const t1a: ComfyManagerAPIPluginList = 0 as any as T1
/* ✅ */ const t1b: T1 = 0 as any as ComfyManagerAPIPluginList
