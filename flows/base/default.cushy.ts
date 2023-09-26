action('Prompt-V1', {
    priority: 1,
    help: 'load model with optional clip-skip, loras, tome ratio, etc.',
    ui: (form) => ({
        // load
        model: form.enum({
            enumName: 'Enum_EfficientLoader_Ckpt_name',
            default: 'dynavisionXLAllInOneStylized_beta0411Bakedvae.safetensors',
        }),
        freeU: form.bool({ default: false }),
        // prompt
        positive: form.str({ textarea: true }),
        negative: form.strOpt({ textarea: true }),
        cfg: form.int({ default: 8 }),
        denoise: form.float({ default: 1 }),
        loras: form.loras({}),
        vae: form.enumOpt({ enumName: 'Enum_VAELoader_Vae_name' }),
        clipSkip: form.intOpt({
            label: 'Clip Skip',
            tooltip: 'same as ClipSetLastLayer; you can use both positive and negative values',
        }),
        highResFix: form.groupOpt({
            items: {
                scaleFactor: form.int({}),
                steps: form.int({ default: 15 }),
                denoise: form.float({ default: 0.5 }),
                saveIntermediaryImage: form.bool({ default: true }),
            },
        }),
        batchSize: form.int({ default: 1 }),
        seed: form.intOpt({}),
        steps: form.int({ default: 20 }),
        width: form.int({ default: 1024 }),
        height: form.int({ default: 1024 }),

        // startImage
        startImage: form.selectImage('Start image'),
        removeBG: form.bool({ default: false }),
        extra: form.groupOpt({
            items: { reversePrompt: form.bool({ default: false }) },
        }),
    }),
    run: async (flow, p) => {
        const graph = flow.nodes

        // MODEL AND LORAS
        const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: p.model })
        let clipAndModel: HasSingle_CLIP & HasSingle_MODEL = ckpt
        for (const lora of p.loras ?? []) {
            clipAndModel = graph.LoraLoader({
                model: clipAndModel,
                clip: clipAndModel,
                lora_name: lora.name,
                strength_clip: lora.strength_clip ?? 1.0,
                strength_model: lora.strength_model ?? 1.0,
            })
        }

        // CLIP
        let clip = clipAndModel._CLIP
        let model: _MODEL = clipAndModel._MODEL
        if (p.freeU) model = graph.FreeU({ model })

        if (p.clipSkip) {
            clip = graph.CLIPSetLastLayer({ clip, stop_at_clip_layer: -Math.abs(p.clipSkip) }).CLIP
        }

        // VAE
        let vae: VAE = ckpt._VAE
        if (p.vae) vae = graph.VAELoader({ vae_name: p.vae }).VAE

        // CLIPS
        const positive = graph.CLIPTextEncode({ clip: flow.AUTO, text: p.positive })
        const negative = graph.CLIPTextEncode({ clip: flow.AUTO, text: p.negative ?? '' })

        flow.print(`startImage: ${p.startImage}`)

        const startImage = p.startImage
            ? graph.VAEEncode({
                  pixels: await flow.loadImageAnswer(p.startImage),
                  vae,
              })
            : graph.EmptyLatentImage({
                  batch_size: p.batchSize,
                  height: p.height,
                  width: p.width,
              })

        let LATENT = graph.KSampler({
            seed: p.seed == null ? flow.randomSeed() : p.seed,
            latent_image: startImage,
            model,
            positive: positive,
            negative: negative,
            sampler_name: 'dpmpp_2m',
            scheduler: 'simple',
            denoise: p.denoise ?? undefined,
            steps: p.steps,
            cfg: 8,
        })

        // HIGHRES FIX
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
            const finalH = p.height * p.highResFix.scaleFactor
            const finalW = p.width * p.highResFix.scaleFactor
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
                sampler_name: 'ddim',
                scheduler: 'karras',
                steps: p.highResFix.steps,
                denoise: 0.5,
            })
        }

        // DECODE
        graph.SaveImage({
            images: graph.VAEDecode({
                samples: LATENT,
                vae: vae, // flow.AUTO,
            }),
        })

        if (p.removeBG) {
            graph.SaveImage({
                images: graph.RemoveImageBackgroundAbg({
                    image: flow.AUTO,
                }),
            })
        }
        // PROMPT
        await flow.PROMPT()

        if (p.extra?.reversePrompt) {
            // FUNNY PROMPT REVERSAL
            positive.set({ text: p.negative ?? '' })
            negative.set({ text: p.positive ?? '' })
            await flow.PROMPT()
        }

        // patch
        // if (p.tomeRatio != null && p.tomeRatio !== false) {
        //     const tome = graph.TomePatchModel({ model, ratio: p.tomeRatio })
        //     model = tome.MODEL
        // }
    },
})
