action({
    author: 'rvion',
    name: 'realtime',
    help: 'load model with optional clip-skip, loras, tome ratio, etc.',
    ui: (form) => ({
        // load
        model: form.enum({
            enumName: 'Enum_CheckpointLoaderSimple_ckpt_name',
            default: 'revAnimated_v122.safetensors',
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
        positive: form.promptOpt({}),
        negative: form.promptOpt({}),

        // latent
        strength: form.float({ default: 0.5, group: 'latent' }),
        cnet: form.enum({ enumName: 'Enum_ControlNetLoader_control_net_name' }),
        startImage: form.image({ group: 'latent', default: { type: 'PaintImage', base64: '' } }),
        // width: form.int({ default: 1024, group: 'latent' }),
        // height: form.int({ default: 1024, group: 'latent' }),
        batchSize: form.int({ default: 1, group: 'latent', min: 1 }),

        //
        CFG: form.int({ default: 8, group: 'sampler' }),
        sampler: form.enum({ enumName: 'Enum_KSampler_sampler_name', default: 'dpmpp_2m_sde', group: 'sampler' }),
        scheduler: form.enum({ enumName: 'Enum_KSampler_scheduler', default: 'karras', group: 'sampler' }),
        denoise: form.float({ default: 1, group: 'sampler' }),
        steps: form.int({ default: 20, group: 'sampler' }),
        seed: form.intOpt({ group: 'sampler' }),

        // startImage
        removeBG: form.bool({ default: false }),
        extra: form.groupOpt({
            items: () => ({
                freeU: form.bool({ default: false }),
                reverse: form.bool({ default: false }),
                loras: form.loras({ default: [] }),
            }),
        }),
    }),
    run: async (flow, p) => {
        const graph = flow.nodes
        // MODEL AND LORAS
        const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: p.model })
        let clipAndModel: HasSingle_CLIP & HasSingle_MODEL = ckpt
        let positiveText = ''
        const positivePrompt = p.positive
        if (positivePrompt) {
            for (const tok of positivePrompt.tokens) {
                if (tok.type === 'booru') positiveText += ` ${tok.tag.text}`
                else if (tok.type === 'text') positiveText += ` ${tok.text}`
                else if (tok.type === 'embedding') positiveText += ` embedding:${tok.embeddingName}`
                else if (tok.type === 'wildcard') {
                    const options = (flow.wildcards as any)[tok.payload]
                    if (Array.isArray(options)) positiveText += ` ${flow.pick(options)}`
                } else if (tok.type === 'lora') {
                    clipAndModel = graph.LoraLoader({
                        model: clipAndModel,
                        clip: clipAndModel,
                        lora_name: tok.loraDef.name,
                        strength_clip: tok.loraDef.strength_clip,
                        strength_model: tok.loraDef.strength_model,
                    })
                }
            }
        }

        let negativeText = ''
        const negativePrompt = p.negative
        if (negativePrompt) {
            for (const tok of negativePrompt.tokens) {
                if (tok.type === 'booru') negativeText += ` ${tok.tag.text}`
                else if (tok.type === 'text') negativeText += ` ${tok.text}`
                else if (tok.type === 'embedding') negativeText += ` embedding:${tok.embeddingName}`
                else if (tok.type === 'wildcard') {
                    const options = (flow.wildcards as any)[tok.payload]
                    if (Array.isArray(options)) negativeText += ` ${flow.pick(options)}`
                } else if (tok.type === 'lora') {
                    flow.print('unsupported: lora in negative prompt; check the default.cushy.ts file')
                    // clipAndModel = graph.LoraLoader({
                    //     model: clipAndModel,
                    //     clip: clipAndModel,
                    //     lora_name: tok.loraName,
                    //     strength_clip: /*lora.strength_clip ??*/ 1.0,
                    //     strength_model: /*lora.strength_model ??*/ 1.0,
                    // })
                }
            }
        }

        // CLIP
        let clip: _CLIP = clipAndModel._CLIP
        let model: _MODEL = clipAndModel._MODEL
        if (p.extra?.freeU) model = graph.FreeU({ model })
        if (p.clipSkip) clip = graph.CLIPSetLastLayer({ clip, stop_at_clip_layer: -Math.abs(p.clipSkip) })

        // VAE
        let vae: _VAE = ckpt._VAE
        if (p.vae) vae = graph.VAELoader({ vae_name: p.vae })

        // CLIPS
        const negative = graph.CLIPTextEncode({ clip: flow.AUTO, text: negativeText })

        const scribble = await flow.loadImageAnswer(p.startImage)
        const positive = graph.ControlNetApply({
            image: graph.ImageInvert({ image: scribble }),
            strength: p.strength,
            conditioning: graph.CLIPTextEncode({ clip: flow.AUTO, text: positiveText }),
            control_net: (t) => t.ControlNetLoader({ control_net_name: p.cnet }),
        })

        const size = graph.Image_Size_to_Number({ image: scribble })
        const startImage = graph.EmptyLatentImage({
            batch_size: p.batchSize ?? 1,
            height: size.outputs.height_int,
            width: size.outputs.width_int,
        })

        // graph.VAEEncode({ pixels: scribble, vae }),
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

        // DECODE --------------------------------------------------------------------------------
        graph.SaveImage({ images: graph.VAEDecode({ samples: LATENT, vae: vae }) })

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
    },
})
