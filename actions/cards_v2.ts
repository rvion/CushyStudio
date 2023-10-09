action('cards', {
    author: '',
    description: 'play with cards',
    ui: (form) => ({
        model: form.enum({
            enumName: 'Enum_CheckpointLoaderSimple_ckpt_name',
            default: 'dynavisionXLAllInOneStylized_beta0411Bakedvae.safetensors',
            group: 'model',
        }),
        generalTheme: form.string({ default: 'horror' }),
        logoSize: form.int({ default: 200 }),
        W: form.int({ default: 726, group: 'size' }),
        H: form.int({ default: 1300, group: 'size' }),

        theme1: form.string({ default: 'spring', group: 'theme' }),
        theme2: form.string({ default: 'summer', group: 'theme' }),
        theme3: form.string({ default: 'autumn', group: 'theme' }),
        theme4: form.string({ default: 'boobs winter', group: 'theme' }),
        // what kind of border do we want
        margin: form.intOpt({ default: 50 }),
        symetry: form.bool({ default: false }),
        logos: form.groupOpt({
            items: {
                spades: form.imageOpt({}),
                hearts: form.imageOpt({}),
                clubs: form.imageOpt({}),
                diamonds: form.imageOpt({}),
            },
        }),
        // borderImage: form.imageOpt({}),
    }),
    run: async (flow, p) => {
        const graph = flow.nodes
        const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: p.model })
        const W = p.W
        const H = p.H

        // --------------------------------------------------
        const suits = ['spades', 'hearts', 'clubs' /*'diamonds'*/] as const
        const values = ['1', '2', /* '3',  '4', '5', '6', '7', '8',*/ '9', /*'10',*/ 'Jack', 'Queen', 'King']

        // --------------------------------------------------
        // generate a logo for every
        const suitsoLatent = graph.EmptyLatentImage({ width: 1024, height: 1024 })
        const suitsImages = new Map<(typeof suits)[number], _IMAGE>()
        for (const color of suits) {
            const colorImage = graph.VAEDecode({
                vae: ckpt,
                samples: graph.KSampler({
                    seed: flow.randomSeed(),
                    latent_image: suitsoLatent,
                    sampler_name: 'euler',
                    scheduler: 'karras',
                    model: ckpt,
                    negative: graph.CLIPTextEncode({ clip: ckpt, text: '' }),
                    positive: graph.CLIPTextEncode({ clip: ckpt, text: `centered logo of ${color}, white_background` }),
                }),
            })
            const colorImageWithTransparentBackground = graph.Image_Rembg_$1Remove_Background$2({
                images: colorImage,
                model: 'u2net',
                background_color: 'none',
                transparency: true,
            })
            suitsImages.set(color, colorImageWithTransparentBackground)
            // generate an image of this logo
            graph.PreviewImage({ images: colorImageWithTransparentBackground })
        }
        // --------------------------------------------------
        const suitsBackground = new Map<(typeof suits)[number], _LATENT>()
        const suitsBackgroundLatent = graph.EmptyLatentImage({ width: W, height: H })
        for (const color of suits) {
            const colorImage = graph.KSampler({
                seed: flow.randomSeed(),
                latent_image: suitsBackgroundLatent,
                sampler_name: 'euler',
                scheduler: 'karras',
                model: ckpt,
                negative: graph.CLIPTextEncode({ clip: ckpt, text: 'text, watermarks, logo' }),
                positive: graph.CLIPTextEncode({
                    clip: ckpt,
                    text: `dark background pattern for ${color} subtle, (dark:1.8), theme: ${p.generalTheme}`,
                }),
            })
            graph.PreviewImage({ images: graph.VAEDecode({ samples: colorImage, vae: ckpt }) })
            suitsBackground.set(color, colorImage)
        }
        // --------------------------------------------------
        const themeFor = { spades: p.theme1, hearts: p.theme2, clubs: p.theme3, diamonds: p.theme4 }
        const emptyLatent = graph.EmptyLatentImage({ width: W, height: H })

        const margin = p.margin ?? 50
        // prettier-ignore
        const maskImage = graph.Create_Rect_Mask({
            image_width: W, image_height: H,
            mode: 'pixels', origin: 'topleft',
            x: margin, y: margin,
            width: W - 2 * margin,
            height: H - 2 * margin,
        })
        graph.PreviewImage({ images: maskImage })
        const negativeText = 'text, watermarks, logo'
        for (const suit of suits) {
            for (const value of values) {
                // PROMPT
                const theme = themeFor[suit]
                const suitLogo = suitsImages.get(suit)!
                const positiveText = `illustration, ${p.generalTheme} for the ${value} of ${suit}. theme is ${theme}`
                const positive = graph.CLIPTextEncode({ clip: ckpt, text: positiveText })

                // MAIN IMAGE
                // ----------------------------------------
                let latent: _LATENT = suitsBackground.get(suit)! // emptyLatent

                const mask = graph.Image_To_Mask({ image: maskImage, method: 'intensity' })
                latent = graph.SetLatentNoiseMask({ mask, samples: latent })
                let sample = graph.KSampler({
                    seed: flow.randomSeed(),
                    latent_image: latent,
                    model: ckpt,
                    positive: positive,
                    negative: graph.CLIPTextEncode({ clip: ckpt, text: negativeText }),
                    sampler_name: 'euler',
                    scheduler: 'karras',
                })

                // test
                if (value === '9') {
                    // paste logos
                    let xxx: _IMAGE = graph.VAEDecode({ vae: ckpt, samples: sample })
                    for (const x of [1, 2]) {
                        const atX = Math.floor(Math.random() * (W - p.logoSize))
                        const atY = Math.floor(Math.random() * (H - p.logoSize))
                        xxx = graph.Image_Paste_Crop_by_Location({ image: xxx, top: atY, left: atX, right: atX + p.logoSize, bottom: atY + p.logoSize, crop_image: suitLogo, crop_sharpening: 0, crop_blending: .5, }).IMAGE // prettier-ignore
                        // graph.PreviewImage({ images: xxx })
                    }
                    latent = graph.VAEEncode({ pixels: xxx, vae: ckpt })
                    sample = graph.KSampler({
                        seed: flow.randomSeed(),
                        latent_image: latent,
                        model: ckpt,
                        positive: positive,
                        negative: graph.CLIPTextEncode({ clip: ckpt, text: negativeText }),
                        sampler_name: 'euler',
                        scheduler: 'karras',
                        denoise: 0.6,
                    })
                }
                let result: _IMAGE = graph.VAEDecode({ vae: ckpt, samples: sample })
                result = graph.Image_Paste_Crop_by_Location({ image: result, top: 0, left: 0, right: p.logoSize, bottom: p.logoSize, crop_image: suitLogo, crop_sharpening: 0, crop_blending: .5, }).IMAGE // prettier-ignore
                result = graph.Image_Paste_Crop_by_Location({ image: result, top: H - p.logoSize, left: W - p.logoSize, right: W, bottom: H, crop_image: suitLogo, crop_sharpening: 0, crop_blending: .5, }).IMAGE // prettier-ignore
                // ----------------------------------------

                // preview
                graph.PreviewImage({ images: result })
            }
        }
        await flow.PROMPT()
    },
})
