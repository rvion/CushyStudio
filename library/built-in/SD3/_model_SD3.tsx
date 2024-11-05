import {
   type $schemaModelExtras,
   evalModelExtras_part1,
   schemaModelExtras,
} from '../_prefabs/prefab_model_extras'

export type $prefabModelSD3 = X.XGroup<{
   ckpt_name: X.XEnum<Comfy.Enums['CheckpointLoaderSimple.ckpt_name']>
   clip1: X.XEnum<Comfy.Enums['CLIPLoader.clip_name']>
   clip2: X.XEnum<Comfy.Enums['CLIPLoader.clip_name']>
   clip3: X.XEnum<Comfy.Enums['CLIPLoader.clip_name']>
   extra: $schemaModelExtras
}>

export const prefabModelSD3 = (): $prefabModelSD3 => {
   const b = getCurrentForm()
   // const ckpts = cushy.managerRepository.getKnownCheckpoints()
   return b
      .fields({
         ckpt_name: b.enum['CheckpointLoaderSimple.input.ckpt_name']({ label: 'Checkpoint' }),
         clip1: b.enum['TripleCLIPLoader.input.clip_name1']({
            // @ts-ignore
            default: 't5xxl_fp16.safetensors',
         }),
         clip2: b.enum['TripleCLIPLoader.input.clip_name2']({ default: 'clip_l.safetensors' }),
         clip3: b.enum['TripleCLIPLoader.input.clip_name3']({
            // @ts-ignore
            default: 'clip_g.safetensors',
         }),
         extra: schemaModelExtras(),
      })
      .addRequirements([
         //
      ])
}

export function eval_model_SD3(doc: $prefabModelSD3['$Value']): {
   ckpt: Comfy.Input.MODEL
   vae: Comfy.Input.VAE
   clip: Comfy.Input.CLIP
} {
   const run = getCurrentRun()
   const graph = run.nodes
   let ckpt: Comfy.Input.MODEL
   let clip: Comfy.Input.CLIP
   let vae: Comfy.Input.VAE | undefined = undefined

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
   clip = clipLoader._CLIP
   ckpt = graph.ModelSamplingSD3({ model: ckpt, shift: 3 })

   return evalModelExtras_part1(doc.extra, { vae, clip, ckpt })
}
