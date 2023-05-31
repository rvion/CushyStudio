action('💬 Prompt', {
    help: 'extract a mak for the given clothes', // <- action help text
    ui: (form) => ({
        positive: form.str({}),
        negative: form.strOpt({}),
        batchSize: form.int({ default: 1 }),
    }),
    run: async (flow, deps) => {
        flow.print(deps.batchSize)
        flow.nodes.PreviewImage({
            images: flow.nodes.VAEDecode({
                samples: flow.nodes.KSampler({
                    seed: flow.randomSeed(),
                    latent_image: flow.nodes.EmptyLatentImage({
                        batch_size: deps.batchSize,
                    }),
                    model: flow.AUTO,
                    positive: flow.nodes.CLIPTextEncode({ clip: flow.AUTO, text: deps.positive }),
                    negative: flow.nodes.CLIPTextEncode({ clip: flow.AUTO, text: deps.negative ?? '' }),
                    sampler_name: 'ddim',
                    scheduler: 'karras',
                }),
                vae: flow.AUTO,
            }),
        })
        await flow.PROMPT()
    },
})

action('A. mask-clothes', {
    help: 'extract a mak for the given clothes', // <- action help text
    // vv action require an image and an input text with tag 'clothes'
    // requirement: (kk) => ({
    //     image: kk.IMAGE({}),
    //     clothes: kk.STRING({ tag: 'clothes' }),
    // }),
    ui: (form) => ({
        match: form.str({ default: 'dress' }),
        image: form.selectImage('test', []),
    }),
    run: (flow, reqs) => {
        const image = reqs.image
        const clothesMask = flow.nodes.MasqueradeMaskByText({
            image: image,
            prompt: reqs.match,
            negative_prompt: 'face, arms, hands, legs, feet, background',
            normalize: 'no',
            precision: 0.3,
        })
        flow.nodes.PreviewImage({ images: clothesMask.IMAGE })
    },
})

action('B. auto-mask-face', {
    help: 'extract a mak for the face', // <- action help text
    // requirement: (kk) => ({
    //     image: kk.IMAGE({}),
    // }),
    run: (flow, deps) => {
        const clothesMask = flow.nodes.MasqueradeMaskByText({
            image: deps.image,
            prompt: 'face',
            negative_prompt: 'face, arms, hands, legs, feet, background',
            normalize: 'no',
            precision: 0.3,
        })
        flow.nodes.PreviewImage({ images: clothesMask.IMAGE })
    },
})
