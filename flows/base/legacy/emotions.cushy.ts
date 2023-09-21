//
action('vn3', {
    run: async ($) => {
        const vae: Enum_VAELoader_Vae_name = 'kl-f8-anime2.ckpt'
        const A___ = $.actions.loadModel({ vae, ckptName: 'mistoonAnime_v10.safetensors', tomeRatio: false }) // stop_at_clip_layer: -2
        const B___ = $.actions.loadModel({ vae, ckptName: 'mistoonAnime_v10Inpainting.safetensors', tomeRatio: false }) // stop_at_clip_layer: -2

        const CLOTHES = 'dress'
        const EMOTION = 'neutral emotion'

        const base = `(masterpiece:1.2), 1girl, beautifull, ${CLOTHES}, ${EMOTION}`
        const seed = $.randomSeed()
        const negativeEmbeddings = [
            //
            $.embedding('EasyNegative'),
            $.embedding('ng_deepnegative_v1_75t'),
            $.embedding('bad-artist-anime'),
            $.embedding('bad-artist'),
            $.embedding('badquality'),
        ].join(', ')

        const positive = $.nodes.CLIPTextEncode({ text: base, clip: A___.ckpt })
        const negative = $.nodes.CLIPTextEncode({ text: negativeEmbeddings, clip: A___.ckpt })

        // base image
        const sampler1 = $.nodes.KSampler({
            seed: seed,
            sampler_name: 'ddim',
            steps: 20,
            cfg: 7,
            scheduler: 'karras',
            denoise: 1,
            model: A___.model,
            positive,
            negative,
            latent_image: $.nodes.EmptyLatentImage({ batch_size: 1 }),
        })
        const image = $.nodes.VAEDecode({ samples: sampler1, vae: A___.vae })
        $.nodes.PreviewImage({ images: image })

        // CLOTHE VARIATION ----------------------------------------------------------------------
        // "fishnets", "naked", "dark dress", "bdsm suite", "santa suite", "pikachu suit", "ropes"]
        // $.nodes.PreviewImage({ images: boobMask.IMAGE_1 })
        const clothesMask = $.nodes.MasqueradeMaskByText({
            image: image,
            prompt: CLOTHES,
            negative_prompt: 'face, arms, hands, legs, feet, background',
            normalize: 'no',
            precision: 0.3,
        })
        $.nodes.PreviewImage({ images: clothesMask.IMAGE })
        const maskedLatent1 = $.nodes.VAEEncodeForInpaint({
            mask: (m) => m.MasqueradeImageToMask({ image: clothesMask.IMAGE, method: 'intensity' }),
            pixels: image,
            vae: B___.vae,
            grow_mask_by: 20,
        })
        const replacements_1 = ['blue dress', 'yellow dress', 'zelda']
        for (const e of replacements_1) {
            const sampler = $.nodes.KSampler({
                seed,
                steps: 20,
                cfg: 5,
                sampler_name: 'ddim',
                scheduler: 'karras',
                denoise: 1,
                model: B___.model,
                positive: $.nodes.CLIPTextEncode({ text: base.replace(CLOTHES, `(${e}:1.1)`), clip: B___.clip }),
                negative,
                latent_image: maskedLatent1,
            })
            $.nodes.PreviewImage({ images: $.nodes.VAEDecode({ samples: sampler, vae: B___.vae }) })
        }

        // EMOTION VARIATION ----------------------------------------------------------------------
        const faceMask = $.nodes.MasqueradeMaskByText({
            image: image,
            prompt: `face`,
            negative_prompt: `hair`,
            normalize: 'no',
            precision: 0.3,
        })
        $.nodes.PreviewImage({ images: faceMask.IMAGE })
        $.nodes.PreviewImage({ images: faceMask.IMAGE_1 })
        const maskedLatent2 = $.nodes.VAEEncodeForInpaint({
            mask: (m) => m.MasqueradeImageToMask({ image: faceMask.IMAGE, method: 'intensity' }),
            pixels: image,
            vae: B___.vae,
            grow_mask_by: 20,
        })
        const replacements_2 = ['happy', 'sad', 'surprised']
        for (const e of replacements_2) {
            const sampler = $.nodes.KSampler({
                seed,
                steps: 30,
                cfg: 9,
                sampler_name: 'ddim',
                scheduler: 'karras',
                denoise: 0.6,
                model: B___.model,
                positive: $.nodes.CLIPTextEncode({ text: base.replace(EMOTION, `(${e}:1.1)`), clip: B___.clip }),
                negative,
                latent_image: maskedLatent2,
            })
            $.nodes.PreviewImage({ images: $.nodes.VAEDecode({ samples: sampler, vae: B___.vae }) })
        }
        await $.PROMPT()
        await $.createAnimation(undefined, 1000)
    },
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
//     const faceMask = $.nodes.MasqueradeMaskByText({
//         image: image,
//         prompt: `face`,
//         negative_prompt: `hair`,
//         normalize: 'no',
//         precision: 0.3,
//     })
//     $.nodes.PreviewImage({ images: faceMask.IMAGE })
//     $.nodes.PreviewImage({ images: faceMask.IMAGE_1 })
//     const maskedLatent2 = $.nodes.VAEEncodeForInpaint({
//         mask: (m) => m.MasqueradeImageToMask({ image: faceMask.IMAGE, method: 'intensity' }),
//         pixels: image,
//         vae: B___.vae,
//         grow_mask_by: 20,
//     })
//     const replacements_2 = ['happy', 'sad', 'surprised']
//     for (const e of replacements_2) {
//         const sampler = $.nodes.KSampler({
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
