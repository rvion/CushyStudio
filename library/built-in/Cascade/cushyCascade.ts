app({
   metadata: {
      author: 'unknown',
      name: 'Stable Cascade.json',
      description: 'Mini Stable Cascade app',
      requirements: [
         { type: 'modelInManager', modelName: 'stabilityai/Stable Cascade: stage_a.safetensors (VAE)' },
         { type: 'modelInManager', modelName: 'stabilityai/Stable Cascade: stage_b_bf16.safetensors (UNET)' },
         { type: 'modelInManager', modelName: 'stabilityai/Stable Cascade: stage_b_lite.safetensors (UNET)' },
         { type: 'modelInManager', modelName: 'stabilityai/Stable Cascade: stage_b.safetensors (UNET)' },
         { type: 'modelInManager', modelName: 'stabilityai/Stable Cascade: stage_c_bf16.safetensors (UNET)' },
         { type: 'modelInManager', modelName: 'stabilityai/Stable Cascade: stage_c_lite.safetensors (UNET)' },
         { type: 'modelInManager', modelName: 'stabilityai/Stable Cascade: stage_c.safetensors (UNET)' },
         { type: 'modelInManager', modelName: 'stabilityai/Stable Cascade: text_encoder (CLIP)' },
      ],
   },
   ui: (b) =>
      b.fields({
         models: b.group({
            items: {
               stage_a_vae: b.enum['VAELoader.input.vae_name']({
                  default: 'Stable-Cascade\\stage_a.safetensors',
               }),
               stage_b: b.enum['UNETLoader.input.unet_name']({
                  default: 'Stable-Cascade\\stage_b_bf16.safetensors',
               }),
               stage_b_type: b.enum['UNETLoader.input.weight_dtype']({ default: 'default' }),
               stage_c: b.enum['UNETLoader.input.unet_name']({
                  // @ts-ignore
                  default: 'Stable-Cascade\\stage_c_bf16.safetensors',
               }),
               stage_c_type: b.enum['UNETLoader.input.weight_dtype']({ default: 'default' }),
            },
         }),
         startingLatent: b.fields({
            width: b.int({ default: 1024, min: 256, max: 8192, step: 8 }),
            height: b.int({ default: 1024, min: 256, max: 8192, step: 8 }),
            compression: b.int({ default: 42, min: 32, max: 64, step: 1 }),
            batch_size: b.int({ default: 1, min: 1, max: 64 }),
         }),
         clip: b.fields({
            type: b.enum['CLIPLoader.input.type']({ default: 'stable_cascade' }),
            clip_name: b.enum['CLIPLoader.input.clip_name']({
               extraDefaults: ['stabilityai/stable-cascade/text_encoder/model.safetensors'],
               default: 'Stable-Cascade\\model.safetensors',
            }),
         }),
         prompt: b.fields({
            text: b.string({
               textarea: true,
               default: 'beautiful scenery nature glass bottle landscape, , purple galaxy bottle,',
            }),
         }),
         negative: b.group({ items: { text_1: b.string({ default: '' }) } }),
         KSampler: b.group({
            items: {
               seed: b.seed({ default: 762626426130783 }),
               steps: b.int({ default: 20, min: 1, max: 10000 }),
               cfg: b.float({ default: 4, min: 0, max: 100, step: 0.1 }),
               sampler_name: b.enum['KSampler.input.sampler_name']({ default: 'euler_ancestral' }),
               scheduler: b.enum['KSampler.input.scheduler']({ default: 'simple' }),
               denoise: b.float({ default: 1, min: 0, max: 1, step: 0.01 }),
            },
         }),
         KSampler_1: b.group({
            items: {
               seed_1: b.int({ default: 150623345818947, min: 0, max: 18446744073709552000 }),
               steps_1: b.int({ default: 10, min: 1, max: 10000 }),
               cfg_1: b.float({ default: 1.1, min: 0, max: 100, step: 0.1 }),
               sampler_name_1: b.enum['KSampler.input.sampler_name']({ default: 'euler_ancestral' }),
               scheduler_1: b.enum['KSampler.input.scheduler']({ default: 'simple' }),
               denoise_1: b.float({ default: 1, min: 0, max: 1, step: 0.01 }),
            },
         }),
         SaveImage: b.group({ items: { filename_prefix: b.string({ default: 'ComfyUI' }) } }),
      }),

   run: async (run, ui) => {
      const graph = run.nodes
      const vae = graph.VAELoader({ vae_name: ui.models.stage_a_vae })
      const stagec = graph.UNETLoader({
         weight_dtype: ui.models.stage_c_type,
         unet_name: ui.models.stage_c,
      })
      const stageb = graph.UNETLoader({
         weight_dtype: ui.models.stage_b_type,
         unet_name: ui.models.stage_b,
      })

      // latent
      const latentOpts = ui.startingLatent
      const stableCascade$_EmptyLatent_2 = graph.StableCascade$_EmptyLatentImage({
         width: latentOpts.width,
         height: latentOpts.height,
         compression: latentOpts.compression,
         batch_size: latentOpts.batch_size,
      })
      const cLIP_2 = graph.CLIPLoader({ clip_name: ui.clip.clip_name, type: ui.clip.type })
      const posEmbedding = graph.CLIPTextEncode({ text: ui.prompt.text, clip: cLIP_2.outputs.CLIP })
      const negEmbedding = graph.CLIPTextEncode({ text: ui.negative.text_1, clip: cLIP_2.outputs.CLIP })
      const kSampler_4 = graph.KSampler({
         seed: ui.KSampler.seed,
         steps: ui.KSampler.steps,
         cfg: ui.KSampler.cfg,
         sampler_name: ui.KSampler.sampler_name,
         scheduler: ui.KSampler.scheduler,
         denoise: ui.KSampler.denoise,
         model: stagec,
         positive: posEmbedding.outputs.CONDITIONING,
         negative: negEmbedding.outputs.CONDITIONING,
         latent_image: stableCascade$_EmptyLatent_2.outputs.stage_c,
      })
      const conditioningZeroOut_2 = graph.ConditioningZeroOut({
         conditioning: posEmbedding.outputs.CONDITIONING,
      })
      const stableCascade$_StageB$_Conditioning_2 = graph.StableCascade$_StageB$_Conditioning({
         conditioning: conditioningZeroOut_2.outputs.CONDITIONING,
         stage_c: kSampler_4.outputs.LATENT,
      })
      const kSampler_5 = graph.KSampler({
         seed: ui.KSampler_1.seed_1,
         steps: ui.KSampler_1.steps_1,
         cfg: ui.KSampler_1.cfg_1,
         sampler_name: ui.KSampler_1.sampler_name_1,
         scheduler: ui.KSampler_1.scheduler_1,
         denoise: ui.KSampler_1.denoise_1,
         model: stageb.outputs.MODEL,
         positive: stableCascade$_StageB$_Conditioning_2.outputs.CONDITIONING,
         negative: conditioningZeroOut_2.outputs.CONDITIONING,
         latent_image: stableCascade$_EmptyLatent_2.outputs.stage_b,
      })
      const vAEDecode_2 = graph.VAEDecode({ samples: kSampler_5.outputs.LATENT, vae: vae.outputs.VAE })
      const save_2 = graph.SaveImage({
         filename_prefix: ui.SaveImage.filename_prefix,
         images: vAEDecode_2.outputs.IMAGE,
      })
      await run.PROMPT()
   },
})
