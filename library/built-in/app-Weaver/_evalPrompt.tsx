import type { ComfyWorkflowBuilder } from '../../../src/back/NodeBuilder'
import type { Field_group_value } from '../../../src/csuite/fields/group/FieldGroup'
import type { UI_cnet } from '../_controlNet/prefab_cnet'
import type { $extra1 } from '../_extra/extra1'
import type { $extra2 } from '../_extra/extra2'
import type { UI_IPAdapterV2 } from '../_ipAdapter/prefab_ipAdapter_baseV2'
import type { UI_IPAdapterFaceIDV2 } from '../_ipAdapter/prefab_ipAdapter_faceV2'
import type { UI_LatentV3 } from '../_prefabs/prefab_latent_v3'
import type { UI_Sampler_Advanced } from '../_prefabs/prefab_sampler_advanced'
import type { UI_customSave } from '../_prefabs/saveSmall'
import type { $prefabModelSD15andSDXL } from '../SD15/_model_SD15_SDXL'

import { run_prompt } from '../_prefabs/prefab_prompt'

export function _evalPrompt(
   text: string,
   ui: Field_group_value<{
      positive: Z.Group<{
         prompts: Z.List<Z.Optional<Z.Prompt>>
      }>
      negative: Z.List<Z.Optional<Z.Prompt>>
      model: $prefabModelSD15andSDXL
      latent: UI_LatentV3
      sampler: UI_Sampler_Advanced
      customSave: UI_customSave
      controlnets: UI_cnet
      ipAdapter: Z.Optional<UI_IPAdapterV2>
      faceID: Z.Optional<UI_IPAdapterFaceIDV2>
      extra: $extra1
      extra2: $extra2
   }>,
   initialClip: Comfy.Signal['CLIP'],
   initialCkpt: Comfy.Signal['MODEL'],
   graph: ComfyWorkflowBuilder,
): {
   conditioning: Comfy.Signal['CONDITIONING']
   ckpt: Comfy.Signal['MODEL']
   clip: Comfy.Signal['CLIP']
} {
   const posPrompt = run_prompt({
      prompt: { text },
      clip: initialClip,
      ckpt: initialCkpt,
      printWildcards: true,
   })
   const clip = posPrompt.clip
   let ckpt = posPrompt.ckpt
   let conditioning: Comfy.Signal['CONDITIONING'] = posPrompt.conditioning // graph.CLIPTextEncode({ clip: clipPos, text: finalText })
   return { conditioning, ckpt, clip }
}
