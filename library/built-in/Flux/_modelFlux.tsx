import {
   type $schemaModelExtras,
   evalModelExtras_part1,
   schemaModelExtras,
} from '../_prefabs/prefab_model_extras'

export type $prefabModelFlux = X.XGroup<{
   ckpt_name: X.XEnum<Comfy.Enums['UNETLoader.unet_name']>
   weight_type: X.XEnum<Comfy.Enums['UNETLoader.weight_dtype']>
   clip1: X.XEnum<Comfy.Enums['CLIPLoader.clip_name']>
   clip2: X.XEnum<Comfy.Enums['CLIPLoader.clip_name']>
   type: X.XEnum<Comfy.Enums['DualCLIPLoader.type']>
   extra: $schemaModelExtras
}>

export const prefabModelFlux = (): $prefabModelFlux => {
   const b = getCurrentForm()
   // const ckpts = cushy.managerRepository.getKnownCheckpoints()
   return b
      .fields({
         ckpt_name: b.enum['UNETLoader.input.unet_name']({
            // @ts-ignore
            default: 'flux1-dev.sft',
         }),
         weight_type: b.enum['UNETLoader.input.weight_dtype']({
            label: 'Weight Type',
            default: 'fp8_e4m3fn',
         }),
         clip1: b.enum
            .Enum_DualCLIPLoader_clip_name1({
               // @ts-ignore
               default: 't5xxl_fp16.safetensors',
            })
            .addRequirementOnComfyManagerModel('google-t5/t5-v1_1-xxl_encoderonly-fp16')
            .addRequirementOnComfyManagerModel('google-t5/t5-v1_1-xxl_encoderonly-fp8_e4m3fn'),
         clip2: b.enum
            .Enum_DualCLIPLoader_clip_name2({ default: 'clip_l.safetensors' })
            .addRequirementOnComfyManagerModel('comfyanonymous/clip_l'),
         type: b.enum['DualCLIPLoader.input.type']({ default: 'flux' }),
         extra: schemaModelExtras({
            defaultVAE: 'FLUX1\\ae.sft',
            vaeActiveByDefault: true,
         }),
      })
      .addRequirements([
         { type: 'modelInManager', modelName: 'FLUX.1 VAE model' },
         { type: 'modelInManager', modelName: 'FLUX.1 [Schnell] Diffusion model' },
         { type: 'modelInManager', modelName: 'kijai/FLUX.1 [dev] Diffusion model (float8_e4m3fn)' },
         { type: 'modelInManager', modelName: 'kijai/FLUX.1 [schnell] Diffusion model (float8_e4m3fn)' },
         { type: 'modelInManager', modelName: 'Comfy Org/FLUX.1 [dev] Checkpoint model (fp8)' },
         { type: 'modelInManager', modelName: 'Comfy Org/FLUX.1 [schnell] Checkpoint model (fp8)' },
      ])
   // .addPreset({
   //     icon: 'mdiStar',
   //     label: 'FLUX',
   //     apply: (w): void => {
   //         w.setValue({
   //             FLUX: {
   //                 type: 'flux',
   //                 ckpt_name: 'flux1-dev.sft' as Enum_UNETLoader_unet_name,
   //                 weight_type: 'fp8_e4m3fn',
   //                 clip1: 't5xxl_fp16.safetensors' as Enum_DualCLIPLoader_clip_name1,
   //                 clip2: 'clip_l.safetensors' as Enum_DualCLIPLoader_clip_name2,
   //             },
   //             extra: { vae: 'ae.sft' as Enum_VAELoader_vae_name },
   //         })
   //     },
   // })
}

export const evalModelFlux = (
   doc: $prefabModelFlux['$Value'],
): {
   ckpt: _MODEL
   vae: _VAE
   clip: _CLIP
} => {
   const run = getCurrentRun()
   const graph = run.nodes
   const vae: _VAE | undefined = undefined
   const ckptLoader: _MODEL = graph.UNETLoader({
      unet_name: doc.ckpt_name,
      weight_dtype: doc.weight_type,
   })
   const ckpt = ckptLoader._MODEL
   const clipLoader = graph.DualCLIPLoader({
      clip_name1: doc.clip1,
      clip_name2: doc.clip2,
      type: doc.type,
   })
   const clip: _CLIP = clipLoader._CLIP
   //Flux requires a vae to be selected
   if (!doc.extra.vae) {
      throw new Error('No VAE selected')
   }

   return evalModelExtras_part1(doc.extra, { vae, clip, ckpt })
}
