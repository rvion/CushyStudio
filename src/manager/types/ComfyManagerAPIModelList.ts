import type { KnownModel_Name } from '../../CUSHY'

import * as v from 'valibot'

/**
 * manually checked on: ❌ // TODO
 */
export type ComfyManagerAPIModelList = {
   models: {
      name: KnownModel_Name
      installed: 'False' | 'True' | 'Update' /* ... */
   }[]
}

// #region valibot
export const ComfyManagerAPIModelList_valibot = v.strictObject({
   models: v.array(
      v.strictObject({
         name: v.custom<KnownModel_Name>((v) => typeof v === 'string', 'not a valid string'),
         installed: v.union([v.literal('False'), v.literal('True'), v.literal('Update')]),
      }),
   ),
})

// check that the valibot schema match the manually written type
/* ✅ */ type T1 = v.InferInput<typeof ComfyManagerAPIModelList_valibot>
/* ✅ */ const t1a: ComfyManagerAPIModelList = 0 as any as T1
/* ✅ */ const t1b: T1 = 0 as any as ComfyManagerAPIModelList
