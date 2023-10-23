// action({
//     author: 'rvion',
//     name: 'Prompt-V1',
//     help: 'load model with optional clip-skip, loras, tome ratio, etc.',
//     ui: (form) => ({
//         // load
//         model: form.enum({
//             enumName: 'Enum_CheckpointLoaderSimple_ckpt_name',
//             default: 'dynavisionXLAllInOneStylized_beta0411Bakedvae.safetensors',
//             group: 'model',
//         }),
//         vae: form.enumOpt({ enumName: 'Enum_VAELoader_vae_name', group: 'model' }),
//         positive: form.str({}),
//         negative: form.str({}),
//         // latent
//         latent: form.group({
//             items: () => ({
//                 width: form.int({ default: 1024, group: 'latent' }),
//                 height: form.int({ default: 1024, group: 'latent' }),
//                 batchSize: form.int({ default: 1, group: 'latent', min: 1 }),
//             }),
//         }),

//         //
//         CFG: form.int({ default: 8, group: 'sampler' }),
//     }),
//     run: async (flow, p) => {
//         const graph = flow.nodes

//         // MODEL AND LORAS
//         const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: p.model })

//         let clipAndModel: HasSingle_CLIP & HasSingle_MODEL = ckpt
//         for (const lora of p.extra?.loras ?? []) {
//             clipAndModel = graph.LoraLoader({
//                 model: clipAndModel,
//                 clip: clipAndModel,
//                 lora_name: lora.name,
//                 strength_clip: lora.strength_clip ?? 1.0,
//                 strength_model: lora.strength_model ?? 1.0,
//             })
//         }

//         let positiveText = ''
//         const positivePrompt = p.positive
//         if (positivePrompt) {
//             for (const tok of positivePrompt.tokens) {
//                 if (tok.type === 'booru') positiveText += ` ${tok.tag.text}`
//                 else if (tok.type === 'text') positiveText += ` ${tok.text}`
//                 else if (tok.type === 'embedding') positiveText += ` embedding:${tok.embeddingName}`
//                 else if (tok.type === 'wildcard') {
//                     const options = (flow.wildcards as any)[tok.payload]
//                     if (Array.isArray(options)) positiveText += ` ${flow.pick(options)}`
//                 } else if (tok.type === 'lora') {
//                     clipAndModel = graph.LoraLoader({
//                         model: clipAndModel,
//                         clip: clipAndModel,
//                         lora_name: tok.loraDef.name,
//                         strength_clip: tok.loraDef.strength_clip,
//                         strength_model: tok.loraDef.strength_model,
//                     })
//                 }
//             }
//         }

//         let negativeText = ''
//         const negativePrompt = p.negative
//         if (negativePrompt) {
//             for (const tok of negativePrompt.tokens) {
//                 if (tok.type === 'booru') negativeText += ` ${tok.tag.text}`
//                 else if (tok.type === 'text') negativeText += ` ${tok.text}`
//                 else if (tok.type === 'embedding') negativeText += ` embedding:${tok.embeddingName}`
//                 else if (tok.type === 'wildcard') {
//                     const options = (flow.wildcards as any)[tok.payload]
//                     if (Array.isArray(options)) negativeText += ` ${flow.pick(options)}`
//                 } else if (tok.type === 'lora') {
//                     flow.print('unsupported: lora in negative prompt; check the default.cushy.ts file')
//                     // clipAndModel = graph.LoraLoader({
//                     //     model: clipAndModel,
//                     //     clip: clipAndModel,
//                     //     lora_name: tok.loraName,
//                     //     strength_clip: /*lora.strength_clip ??*/ 1.0,
//                     //     strength_model: /*lora.strength_model ??*/ 1.0,
//                     // })
//                 }
//             }
//         }

//         // CLIP
//         let clip: _CLIP = clipAndModel._CLIP
//         let model: _MODEL = clipAndModel._MODEL
//         if (p.extra?.freeU) model = graph.FreeU({ model })

//         if (p.clipSkip) {
//             clip = graph.CLIPSetLastLayer({ clip, stop_at_clip_layer: -Math.abs(p.clipSkip) })
//         }

//         // VAE
//         let vae: _VAE = ckpt._VAE
//         if (p.vae) vae = graph.VAELoader({ vae_name: p.vae })

//         // CLIPS
//         const positive = graph.CLIPTextEncode({ clip: flow.AUTO, text: positiveText })
//         const negative = graph.CLIPTextEncode({ clip: flow.AUTO, text: negativeText })

//         // flow.print(`startImage: ${p.startImage}`)

//         const startImage = p.latent.startImage
//             ? graph.VAEEncode({
//                   pixels: await flow.loadImageAnswer(p.latent.startImage),
//                   vae,
//               })
//             : graph.EmptyLatentImage({
//                   batch_size: p.latent.batchSize ?? 1,
//                   height: p.latent.height,
//                   width: p.latent.width,
//               })

//         let LATENT = graph.KSampler({
//             seed: p.seed == null ? flow.randomSeed() : p.seed,
//             latent_image: startImage,
//             model,
//             positive: positive,
//             negative: negative,
//             sampler_name: p.sampler ?? 'dpmpp_2m',
//             scheduler: p.scheduler ?? 'simple',
//             denoise: p.denoise ?? undefined,
//             steps: p.steps,
//             cfg: p.CFG,
//         })

//         // HIGHRES FIX --------------------------------------------------------------------------------
//         if (p.highResFix) {
//             if (p.highResFix.saveIntermediaryImage) {
//                 // DECODE
//                 graph.SaveImage({
//                     images: graph.VAEDecode({
//                         samples: LATENT,
//                         vae: vae, // flow.AUTO,
//                     }),
//                 })
//             }
//             const finalH = p.latent.height * p.highResFix.scaleFactor
//             const finalW = p.latent.width * p.highResFix.scaleFactor
//             const _1 = graph.LatentUpscale({
//                 samples: LATENT,
//                 crop: 'disabled',
//                 upscale_method: 'nearest-exact',
//                 height: finalH,
//                 width: finalW,
//             })
//             flow.print(`target dimension: W=${finalW} x H=${finalH}`)
//             LATENT = graph.KSampler({
//                 model,
//                 positive: positive,
//                 negative: negative,
//                 latent_image: _1,
//                 sampler_name: p.sampler ?? 'dpmpp_2m',
//                 scheduler: p.scheduler ?? 'karras',
//                 steps: p.highResFix.steps,
//                 denoise: p.highResFix.denoise,
//             })
//         }

//         // DECODE --------------------------------------------------------------------------------
//         graph.SaveImage({
//             images: graph.VAEDecode({
//                 samples: LATENT,
//                 vae: vae, // flow.AUTO,
//             }),
//         })

//         if (p.removeBG) {
//             graph.SaveImage({
//                 images: graph.Image_Rembg_$1Remove_Background$2({
//                     images: flow.AUTO,
//                     model: 'u2net',
//                     background_color: 'magenta',
//                 }),
//             })
//         }
//         // PROMPT
//         await flow.PROMPT()

//         // if (p.extra?.reversePrompt) {
//         //     // FUNNY PROMPT REVERSAL
//         //     positive.set({ text: p.negative ?? '' })
//         //     negative.set({ text: p.positive ?? '' })
//         //     await flow.PROMPT()
//         // }

//         // patch
//         // if (p.tomeRatio != null && p.tomeRatio !== false) {
//         //     const tome = graph.TomePatchModel({ model, ratio: p.tomeRatio })
//         //     model = tome.MODEL
//         // }
//     },
// })
