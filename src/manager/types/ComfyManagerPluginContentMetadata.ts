import type { Static } from '@sinclair/typebox'

import { Type } from '@sinclair/typebox'
import * as v from 'valibot'

export type ComfyManagerPluginContentMetadata = {
   // always present
   title_aux: string // "Jovimetrix Composition Nodes",

   // optional
   author?: string // "amorano",
   nickname?: string // "Comfy Deploy",
   description?: string // "Webcams, GLSL shader, Media Streaming, Tick animation, Image manipulation,",
   nodename_pattern?: string // " \\(jov\\)$",
   title?: string // "Jovimetrix",
   preemptions?: string[] // ❓
}

// #region valibot
export const ComfyManagerPluginContentMetadata_valibot = v.strictObject({
   // always present
   title_aux: v.string(),

   // optional
   author: v.optional(v.string()),
   nickname: v.optional(v.string()),
   description: v.optional(v.string()),
   nodename_pattern: v.optional(v.string()),
   title: v.optional(v.string()),
   preemptions: v.optional(v.array(v.string())),
})

// check that the valibot schema match the manually written type
/* ✅ */ type T1 = v.InferInput<typeof ComfyManagerPluginContentMetadata_valibot>
/* ✅ */ const t1a: ComfyManagerPluginContentMetadata = 0 as any as T1
/* ✅ */ const t1b: T1 = 0 as any as ComfyManagerPluginContentMetadata

// #region typebox
export const ComfyManagerPluginContentMetadata_typebox = Type.Object(
   {
      title_aux: Type.String(),

      //
      author: Type.Optional(Type.String()),
      nickname: Type.Optional(Type.String()),
      description: Type.Optional(Type.String()),
      nodename_pattern: Type.Optional(Type.String()),
      title: Type.Optional(Type.String()),
      preemptions: Type.Optional(Type.Array(Type.String())),
   },
   { additionalProperties: false },
)

// check that the Typebox schema match the manually written type
/* ✅ */ type T2 = Static<typeof ComfyManagerPluginContentMetadata_typebox>
/* ✅ */ const t2a: ComfyManagerPluginContentMetadata = 0 as any as T2
/* ✅ */ const t2b: T2 = 0 as any as ComfyManagerPluginContentMetadata
