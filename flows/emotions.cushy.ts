//
WORKFLOW('vn3', async ({ graph, flow, presets }) => {
    const vae: Enum_VAELoader_vae_name = 'kl-f8-anime2.ckpt'
    const A___ = presets.loadModel({ vae, ckptName: 'mistoonAnime_v10.safetensors', tomeRatio: false }) // stop_at_clip_layer: -2
    const B___ = presets.loadModel({ vae, ckptName: 'mistoonAnime_v10Inpainting.safetensors', tomeRatio: false }) // stop_at_clip_layer: -2

    const CLOTHES = 'dress'
    const EMOTION = 'neutral emotion'

    const base = `(masterpiece:1.2), 1girl, beautifull, ${CLOTHES}, ${EMOTION}`
    const seed = flow.randomSeed()
    const negativeEmbeddings = [
        //
        flow.embedding('easynegative'),
        flow.embedding('ng_deepnegative_v1_75t'),
        flow.embedding('bad-artist-anime'),
        flow.embedding('bad-artist'),
        flow.embedding('badquality'),
    ].join(', ')

    const positive = graph.CLIPTextEncode({ text: base, clip: A___.ckpt })
    const negative = graph.CLIPTextEncode({ text: negativeEmbeddings, clip: A___.ckpt })

    // base image
    const sampler1 = graph.KSampler({
        seed: seed,
        sampler_name: 'ddim',
        steps: 20,
        cfg: 7,
        scheduler: 'karras',
        denoise: 1,
        model: A___.model,
        positive,
        negative,
        latent_image: graph.EmptyLatentImage({ batch_size: 1 }),
    })
    const image = graph.VAEDecode({ samples: sampler1, vae: A___.vae })
    graph.PreviewImage({ images: image })

    // CLOTHE VARIATION ----------------------------------------------------------------------
    // "fishnets", "naked", "dark dress", "bdsm suite", "santa suite", "pikachu suit", "ropes"]
    // graph.PreviewImage({ images: boobMask.IMAGE_1 })
    const clothesMask = graph.MasqueradeMaskByText({
        image: image,
        prompt: CLOTHES,
        negative_prompt: 'face, arms, hands, legs, feet, background',
        normalize: 'no',
        precision: 0.3,
    })
    graph.PreviewImage({ images: clothesMask.IMAGE })
    const maskedLatent1 = graph.VAEEncodeForInpaint({
        mask: (m) => m.MasqueradeImageToMask({ image: clothesMask.IMAGE, method: 'intensity' }),
        pixels: image,
        vae: B___.vae,
        grow_mask_by: 20,
    })
    const replacements_1 = ['blue dress', 'yellow dress', 'zelda']
    for (const e of replacements_1) {
        const sampler = graph.KSampler({
            seed,
            steps: 20,
            cfg: 5,
            sampler_name: 'ddim',
            scheduler: 'karras',
            denoise: 1,
            model: B___.model,
            positive: graph.CLIPTextEncode({ text: base.replace(CLOTHES, `(${e}:1.1)`), clip: B___.clip }),
            negative,
            latent_image: maskedLatent1,
        })
        graph.PreviewImage({ images: graph.VAEDecode({ samples: sampler, vae: B___.vae }) })
    }

    // EMOTION VARIATION ----------------------------------------------------------------------
    const faceMask = graph.MasqueradeMaskByText({
        image: image,
        prompt: `face`,
        negative_prompt: `hair`,
        normalize: 'no',
        precision: 0.3,
    })
    graph.PreviewImage({ images: faceMask.IMAGE })
    graph.PreviewImage({ images: faceMask.IMAGE_1 })
    const maskedLatent2 = graph.VAEEncodeForInpaint({
        mask: (m) => m.MasqueradeImageToMask({ image: faceMask.IMAGE, method: 'intensity' }),
        pixels: image,
        vae: B___.vae,
        grow_mask_by: 20,
    })
    const replacements_2 = ['happy', 'sad', 'surprised']
    for (const e of replacements_2) {
        const sampler = graph.KSampler({
            seed,
            steps: 30,
            cfg: 9,
            sampler_name: 'ddim',
            scheduler: 'karras',
            denoise: 0.6,
            model: B___.model,
            positive: graph.CLIPTextEncode({ text: base.replace(EMOTION, `(${e}:1.1)`), clip: B___.clip }),
            negative,
            latent_image: maskedLatent2,
        })
        graph.PreviewImage({ images: graph.VAEDecode({ samples: sampler, vae: B___.vae }) })
    }
    await flow.PROMPT()
    await flow.createAnimation(undefined, 1000)
})

// WORKFLOW('generate-emotions', async ({ graph, flow, presets }) => {
//     require({
//         image: { type: 'IMAGE', priority: ['lastCreated']}
//         vae: { type: 'VAE', priority: ['lastCreated'] }
//         model: { type: 'IMAGE', priority: [{taggedWith: 'inpainting'}, 'lastCreated'] }
//     })
//     const image = SLOT({type: 'ASK'})
//     const vae = SLOT('VAE') // <-- ??

//     // EMOTION VARIATION ----------------------------------------------------------------------
//     const faceMask = graph.MasqueradeMaskByText({
//         image: image,
//         prompt: `face`,
//         negative_prompt: `hair`,
//         normalize: 'no',
//         precision: 0.3,
//     })
//     graph.PreviewImage({ images: faceMask.IMAGE })
//     graph.PreviewImage({ images: faceMask.IMAGE_1 })
//     const maskedLatent2 = graph.VAEEncodeForInpaint({
//         mask: (m) => m.MasqueradeImageToMask({ image: faceMask.IMAGE, method: 'intensity' }),
//         pixels: image,
//         vae: B___.vae,
//         grow_mask_by: 20,
//     })
//     const replacements_2 = ['happy', 'sad', 'surprised']
//     for (const e of replacements_2) {
//         const sampler = graph.KSampler({
//             seed,
//             steps: 30,
//             cfg: 9,
//             sampler_name: 'ddim',
//             scheduler: 'karras',
//             denoise: 0.6,
//             model: B___.model,
//             positive: graph.CLIPTextEncode({ text: base.replace(EMOTION, `(${e}:1.1)`), clip: B___.clip }),
//             negative,
//             latent_image: maskedLatent2,
//         })
//         graph.PreviewImage({ images: graph.VAEDecode({ samples: sampler, vae: B___.vae }) })
//     }
//     await flow.PROMPT()
// })
