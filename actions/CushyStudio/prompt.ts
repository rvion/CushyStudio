import { Action_Helper } from './_run'

action({
    author: 'rvion',
    name: 'Prompt-V1',
    help: 'load model with optional clip-skip, loras, tome ratio, etc.',
    ui: (form) => ({
        // load
        model: form.enum({
            enumName: 'Enum_CheckpointLoaderSimple_ckpt_name',
            default: 'dynavisionXLAllInOneStylized_beta0411Bakedvae.safetensors',
            group: 'model',
        }),
        vae: form.enumOpt({ enumName: 'Enum_VAELoader_vae_name', group: 'model' }),
        clipSkip: form.int({
            label: 'Clip Skip',
            tooltip: 'same as ClipSetLastLayer; you can use both positive and negative values',
            default: 0,
            group: 'model',
        }),

        // prompt
        positive: form.prompt({}),
        negative: form.prompt({}),

        // latent
        latent: form.group({
            items: () => ({
                startImage: form.imageOpt({ group: 'latent' }),
                width: form.int({ default: 1024, group: 'latent', step: 128, min: 128, max: 4096 }),
                height: form.int({ default: 1024, group: 'latent', step: 128, min: 128, max: 4096 }),
                batchSize: form.int({ default: 1, group: 'latent', min: 1, max: 20 }),
            }),
        }),

        //
        CFG: form.int({ default: 8, group: 'sampler' }),
        sampler: form.enum({ enumName: 'Enum_KSampler_sampler_name', default: 'dpmpp_2m_sde', group: 'sampler' }),
        scheduler: form.enum({ enumName: 'Enum_KSampler_scheduler', default: 'karras', group: 'sampler' }),
        denoise: form.float({ default: 1, group: 'sampler' }),
        steps: form.int({ default: 20, group: 'sampler' }),
        seed: form.intOpt({ group: 'sampler' }),

        highResFix: form.groupOpt({
            items: () => ({
                scaleFactor: form.int({ default: 1 }),
                steps: form.int({ default: 15 }),
                denoise: form.float({ default: 0.5 }),
                saveIntermediaryImage: form.bool({ default: true }),
            }),
        }),
        loop: form.groupOpt({
            items: () => ({
                batchCount: form.int({ default: 1 }),
                delayBetween: form.int({
                    tooltip: 'in ms',
                    default: 0,
                }),
            }),
        }),

        // startImage
        removeBG: form.bool({ default: false }),
        extra: form.groupOpt({
            items: () => ({
                freeU: form.bool({ default: false }),
                reverse: form.bool({ default: false }),
            }),
        }),
    }),
    run: async (flow, p) => {
        const graph = flow.nodes
        const _ = new Action_Helper(flow)

        // MODEL AND LORAS
        const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: p.model })

        let clipAndModelPositive: _CLIP & _MODEL = ckpt
        let clipAndModelNegative: _CLIP & _MODEL = ckpt

        const x = _.procesPromptResult(p.positive, clipAndModelPositive)
        clipAndModelPositive = x.clipAndModel
        const positiveText = x.text

        const y = _.procesPromptResult(p.negative, clipAndModelPositive)
        clipAndModelNegative = y.clipAndModel
        const negativeText = y.text

        // CLIP
        let clipPos: _CLIP = clipAndModelPositive._CLIP
        let clipNeg: _CLIP = clipAndModelNegative._CLIP
        let model: _MODEL = clipAndModelPositive._MODEL
        if (p.extra?.freeU) model = graph.FreeU({ model })

        // CLIP SKIP
        if (p.clipSkip) {
            clipPos = graph.CLIPSetLastLayer({ clip: clipPos, stop_at_clip_layer: -Math.abs(p.clipSkip) })
            clipNeg = graph.CLIPSetLastLayer({ clip: clipNeg, stop_at_clip_layer: -Math.abs(p.clipSkip) })
        }

        // OPTIONAL CUSTOM VAE
        let vae: _VAE = ckpt._VAE
        if (p.vae) vae = graph.VAELoader({ vae_name: p.vae })

        // CLIPS
        const positive = graph.CLIPTextEncode({ clip: clipPos, text: positiveText })
        const negative = graph.CLIPTextEncode({ clip: clipNeg, text: negativeText })

        // flow.print(`startImage: ${p.startImage}`)

        const startImage = p.latent.startImage
            ? graph.VAEEncode({
                  pixels: await flow.loadImageAnswer(p.latent.startImage),
                  vae,
              })
            : graph.EmptyLatentImage({
                  batch_size: p.latent.batchSize ?? 1,
                  height: p.latent.height,
                  width: p.latent.width,
              })

        let LATENT = graph.KSampler({
            seed: p.seed == null ? flow.randomSeed() : p.seed,
            latent_image: startImage,
            model,
            positive: positive,
            negative: negative,
            sampler_name: p.sampler ?? 'dpmpp_2m',
            scheduler: p.scheduler ?? 'simple',
            denoise: p.denoise ?? undefined,
            steps: p.steps,
            cfg: p.CFG,
        })

        // HIGHRES FIX --------------------------------------------------------------------------------
        if (p.highResFix) {
            if (p.highResFix.saveIntermediaryImage) {
                // DECODE
                graph.SaveImage({
                    images: graph.VAEDecode({
                        samples: LATENT,
                        vae: vae, // flow.AUTO,
                    }),
                })
            }
            const finalH = p.latent.height * p.highResFix.scaleFactor
            const finalW = p.latent.width * p.highResFix.scaleFactor
            const _1 = graph.LatentUpscale({
                samples: LATENT,
                crop: 'disabled',
                upscale_method: 'nearest-exact',
                height: finalH,
                width: finalW,
            })
            flow.print(`target dimension: W=${finalW} x H=${finalH}`)
            LATENT = graph.KSampler({
                model,
                positive: positive,
                negative: negative,
                latent_image: _1,
                sampler_name: p.sampler ?? 'dpmpp_2m',
                scheduler: p.scheduler ?? 'karras',
                steps: p.highResFix.steps,
                denoise: p.highResFix.denoise,
            })
        }

        // DECODE --------------------------------------------------------------------------------
        graph.SaveImage({
            images: graph.VAEDecode({
                samples: LATENT,
                vae: vae, // flow.AUTO,
            }),
        })

        if (p.removeBG) {
            graph.SaveImage({
                images: graph.Image_Rembg_$1Remove_Background$2({
                    images: flow.AUTO,
                    model: 'u2net',
                    background_color: 'magenta',
                }),
            })
        }
        // PROMPT
        await flow.PROMPT()

        // if (p.extra?.reversePrompt) {
        //     // FUNNY PROMPT REVERSAL
        //     positive.set({ text: p.negative ?? '' })
        //     negative.set({ text: p.positive ?? '' })
        //     await flow.PROMPT()
        // }

        // patch
        // if (p.tomeRatio != null && p.tomeRatio !== false) {
        //     const tome = graph.TomePatchModel({ model, ratio: p.tomeRatio })
        //     model = tome.MODEL
        // }
    },
})
