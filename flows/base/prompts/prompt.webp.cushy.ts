action('💬 prompt webp', {
    priority: 2,
    help: 'simple prompting tool',
    ui: (form) => ({
        positive: form.str({ textarea: true }),
        negative: form.strOpt({ textarea: true }),
        batchSize: form.int({ default: 1 }),
        seed: form.intOpt({}),
    }),
    run: async (flow, deps) => {
        // flow.print(`batchSize: deps.batchSize`)
        flow.nodes.Save_as_webp({
            mode: 'lossless',
            compression: 50,
            images: flow.nodes.VAEDecode({
                samples: flow.nodes.KSampler({
                    seed: deps.seed == null ? flow.randomSeed() : deps.seed,
                    latent_image: flow.nodes.EmptyLatentImage({
                        batch_size: deps.batchSize,
                    }),
                    model: flow.AUTO,
                    positive: flow.nodes.CLIPTextEncode({ clip: flow.AUTO, text: deps.positive }),
                    negative: flow.nodes.CLIPTextEncode({ clip: flow.AUTO, text: deps.negative ?? '' }),
                    sampler_name: 'ddim',
                    scheduler: 'karras',
                    steps: 20,
                }),
                vae: flow.AUTO,
            }),
        })
        await flow.PROMPT()
    },
})
