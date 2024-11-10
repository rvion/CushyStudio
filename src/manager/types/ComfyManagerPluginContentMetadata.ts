import * as v from 'valibot'

export type ComfyManagerPluginContentMetadata = {
   // optional because on damn validation on comfy manager! 😬
   title_aux: string | null // "Jovimetrix Composition Nodes",

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
   // should have been always present
   title_aux: v.nullable(v.string()),

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
