action('A. load model', {
    help: 'load model with optional clip-skip, loras, etc.', // <- action help text
    ui: (form) => ({
        model: form.enum({ enumName: 'Enum_EfficientLoader_ckpt_name' }),
    }),
    run: (flow, deps) => {
        flow.presets.loadModel({
            ckptName: deps.model,
        })
    },
})

action('A. prompt', {
    help: 'extract a mak for the given clothes', // <- action help text
    ui: (form) => ({
        positive: form.str({}),
        negative: form.strOpt({}),
    }),
    run: async (flow, deps) => {
        flow.nodes.PreviewImage({
            images: flow.nodes.VAEDecode({
                samples: flow.nodes.KSampler({
                    seed: flow.randomSeed(),
                    latent_image: flow.nodes.EmptyLatentImage({}),
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
    run: (flow, reqs) => {
        const image = reqs.image
        const clothesMask = flow.nodes.MasqueradeMaskByText({
            image: image,
            prompt: reqs.clothes,
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
