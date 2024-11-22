import { _defaultModel } from '../../../src/csuite/fields/enum/_trustMedefault'
import {
   type $schemaModelExtras,
   evalModelExtras_part1,
   schemaModelExtras,
} from '../_prefabs/prefab_model_extras'

export type $prefabModelSD3 = X.XGroup<{
   ckpt_name: X.XEnum<'CheckpointLoaderSimple.ckpt_name'>
   clip1: X.XEnum<'CLIPLoader.clip_name'>
   clip2: X.XEnum<'CLIPLoader.clip_name'>
   clip3: X.XEnum<'CLIPLoader.clip_name'>
   extra: $schemaModelExtras
}>

export const prefabModelSD3 = (): $prefabModelSD3 => {
   const b = getCurrentForm()
   // const ckpts = cushy.managerRepository.getKnownCheckpoints()
   return b
      .fields({
         ckpt_name: b.enum['CheckpointLoaderSimple.ckpt_name']({ label: 'Checkpoint' }),
         clip1: b.enum['TripleCLIPLoader.clip_name1']({ default: _defaultModel('google_t5-v1_1-xxl_encoderonly-fp16.safetensors'), }), // prettier-ignore
         clip2: b.enum['TripleCLIPLoader.clip_name2']({ default: _defaultModel('clip_l.safetensors') }),
         clip3: b.enum['TripleCLIPLoader.clip_name3']({ default: _defaultModel('clip_vision_g.safetensors') }), // prettier-ignore
         extra: schemaModelExtras(),
      })
      .addRequirements([
         { type: 'modelInManager', modelName: 'google-t5/t5-v1_1-xxl_encoderonly-fp16' },
         { type: 'modelInManager', modelName: 'comfyanonymous/clip_l' },
         { type: 'modelInManager', modelName: 'CLIPVision model (stabilityai/clip_vision_g)' },
      ])
}

export function eval_model_SD3(doc: $prefabModelSD3['$Value']): {
   ckpt: Comfy.Signal['MODEL']
   vae: Comfy.Signal['VAE']
   clip: Comfy.Signal['CLIP']
} {
   const run = getCurrentRun()
   const graph = run.nodes
   let ckpt: Comfy.Signal['MODEL']
   let vae: Comfy.Signal['VAE'] | undefined = undefined

   // SD3 Specific Part ------------------------
   const ckptLoader = graph.CheckpointLoaderSimple({
      ckpt_name: doc.ckpt_name,
   })
   ckpt = ckptLoader._MODEL
   vae = ckptLoader._VAE
   const clipLoader = graph.TripleCLIPLoader({
      clip_name1: doc.clip1,
      clip_name2: doc.clip2,
      clip_name3: doc.clip3,
   })
   const clip: Comfy.Signal['CLIP'] = clipLoader._CLIP
   ckpt = graph.ModelSamplingSD3({ model: ckpt, shift: 3 })

   return evalModelExtras_part1(doc.extra, { vae, clip, ckpt })
}
