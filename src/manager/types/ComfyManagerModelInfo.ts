import type { KnownModel_Base } from '../generated/KnownModel_Base'
import type { KnownModel_Name } from '../generated/KnownModel_Name'
import type { KnownModel_SavePath } from '../generated/KnownModel_SavePath'
import type { KnownModel_Type } from '../generated/KnownModel_Type'
import type { Static } from '@sinclair/typebox'

import { Type } from '@sinclair/typebox'
import * as v from 'valibot'

export type ComfyManagerModelInfo = {
   name: KnownModel_Name // e.g. "ip-adapter_sd15_light.safetensors",
   type: KnownModel_Type // e.g. "IP-Adapter",
   base: KnownModel_Base // e.g. "SD1.5",
   save_path: KnownModel_SavePath // e.g. "ipadapter",
   description: string // e.g. "You can use this model in the [a/ComfyUI IPAdapter plus](https://github.com/cubiq/ComfyUI_IPAdapter_plus) extension.",
   reference: string // e.g. "https://huggingface.co/h94/IP-Adapter",
   filename: string // e.g. "ip-adapter_sd15_light.safetensors",
   url: string // e.g. "https://huggingface.co/h94/IP-Adapter/resolve/main/models/ip-adapter_sd15_light.safetensors"
   size?: string // e.g.  "698.4MB"
}

// #region Valibot
export const ComfyManagerModelInfo_valibot = v.strictObject({
   name: v.string(),
   type: v.string(),
   base: v.string(),
   save_path: v.string(),
   description: v.string(),
   reference: v.string(),
   filename: v.string(),
   url: v.string(),
   size: v.optional(v.string()),
})

// #region Typebox
export const ComfyManagerModelInfo_typebox = Type.Object(
   {
      name: Type.Any(),
      type: Type.Any(),
      base: Type.Any(),
      save_path: Type.Any(),
      description: Type.String(),
      reference: Type.String(),
      filename: Type.String(),
      url: Type.String(),
      size: Type.Optional(Type.String()),
   },
   { additionalProperties: false },
)

/* ✅ */ type ModelInfo2 = Static<typeof ComfyManagerModelInfo_typebox>
/* ✅ */ const _t1: ComfyManagerModelInfo = 0 as any as ModelInfo2
/* ✅ */ const _t2: ModelInfo2 = 0 as any as ComfyManagerModelInfo
