/** having a bunch of sensible default will help slightly */
export function getUnionNameBasedOnFirstFoundEnumName(
   //
   enumName: string,
   hash: string,
   hashContent: string,
): string {
   // core enums
   if (enumName === 'KSampler.sampler_name') return 'E_SamplerName'
   if (enumName === 'KSampler.scheduler') return 'E_SchedulerName'
   if (enumName === 'CheckpointLoaderSimple.ckpt_name') return 'E_CkptName'
   if (enumName === 'VAELoader.vae_name') return 'E_VaeName'
   if (enumName === 'LoraLoader.lora_name') return 'E_LoraName'
   // upscape methods
   if (enumName === 'LatentUpscale.upscale_method') return 'E_LatentUpscaleMethod'
   if (enumName === 'ImageScale.upscale_method') return 'E_ImageUpscaleMethod'
   // core objects
   if (enumName === 'LoadImage.image') return 'E_Image'
   if (enumName === 'LoadImageMask.channel') return 'E_Channel'
   // misc
   if (enumName === 'KSamplerAdvanced.add_noise') return 'E_EnableOrDisable'
   if (enumName === 'LatentRotate.rotation') return 'E_Rotation'
   if (enumName === 'LatentFlip.flip_method') return 'E_FlipMethod'
   if (enumName === 'CLIPLoader.type') return 'E_ClipType'
   if (enumName === 'UNETLoader.weight_dtype') return 'E_WeightDType'
   if (enumName === 'DualCLIPLoader.type') return 'E_DualClipType'
   if (enumName === 'CheckpointLoader.config_name') return 'E_CkptConfigName'

   // civitai_comfy_nodes
   if (enumName === 'civitai_comfy_nodes.CivitAI_Checkpoint_Loader.ckpt_name') return 'E_CivitAICkptName'

   // Impact-Specific
   if (enumName === 'Impact-Pack.SAMDetectorCombined.detection_hint') return 'E_ImpactDetectionHint'

   // Misc
   if (hashContent === 'false|true') return 'E_TrueOrFalse'
   if (hashContent === 'CPU|GPU') return 'E_CpuOrGpu'
   return 'E_' + hash
}
