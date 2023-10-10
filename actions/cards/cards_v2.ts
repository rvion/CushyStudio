import { prettifyIcon } from './icons/TEST'

action('cards', {
    author: '',
    description: 'play with cards',
    ui: (form) => ({
        // [UI] MODEL --------------------------------------
        model: form.enum({
            enumName: 'Enum_CheckpointLoaderSimple_ckpt_name',
            default: 'dynavisionXLAllInOneStylized_beta0411Bakedvae.safetensors',
            group: 'model',
        }),

        // [UI] CARD ---------------------------------------
        cards: form.matrix({
            cols: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
            rows: ['spades', 'hearts', 'clubs', 'diamonds'],
            default: [],
        }),

        // Main cards
        illustrationJack: form.str({ default: 'gold, Knight', group: 'illusration' }),
        illustrationQueen: form.str({ default: 'gold, Queen', group: 'illusration' }),
        illustrationKing: form.str({ default: 'gold, King', group: 'illusration' }),

        // [UI] THEME --------------------------------------
        generalTheme: form.string({ default: 'fantasy' }),
        theme1: form.string({ default: 'underwater, sea, fish, tentacles, ocean', group: 'theme' }),
        theme2: form.string({ default: 'volcanic, lava, rock, fire', group: 'theme' }),
        theme3: form.string({ default: 'forest, nature, branches, trees', group: 'theme' }),
        theme4: form.string({ default: 'snow, ice, mountain, transparent winter', group: 'theme' }),

        colors: form.group({
            default: {
                spades: 'blue',
                hearts: 'red',
                clubs: 'green',
                diamonds: 'white',
            },
            items: {
                spades: form.string({ default: 'blue' }),
                hearts: form.string({ default: 'red' }),
                clubs: form.string({ default: 'green' }),
                diamonds: form.string({ default: 'white' }),
            },
        }),

        // theme5: form.string({ default: 'winter', group: 'theme' }),
        logos: form.groupOpt({
            items: {
                spades: form.imageOpt({}),
                hearts: form.imageOpt({}),
                clubs: form.imageOpt({}),
                diamonds: form.imageOpt({}),
            },
        }),

        // [UI] SIZES --------------------------------------
        logoSize: form.int({ default: 200 }),
        W: form.int({ default: 726, group: 'size' }),
        H: form.int({ default: 1300, group: 'size' }),

        // [UI] BORDERS ------------------------------------
        margin: form.intOpt({ default: 50 }),
        symetry: form.bool({ default: false }),
    }),

    run: async (flow, p) => {
        // 1. SETUP --------------------------------------------------
        const graph = flow.nodes
        const seed = flow.randomSeed()
        const floor = (x: number) => Math.floor(x)
        const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: p.model })
        const suits = Array.from(new Set(p.cards.map((c) => c.row)))
        const values = Array.from(new Set(p.cards.map((c) => c.col)))
        const W = p.W, W2 = floor(W / 2), W3 = floor(W / 3), W4 = floor(W / 4) // prettier-ignore
        const H = p.H, H2 = floor(H / 2), H3 = floor(H / 3), H4 = floor(H / 4) // prettier-ignore

        // 2. LOGOS --------------------------------------------------
        flow.print(`generating logos for ${suits.join(', ')}`)
        const suitsoLatent = graph.EmptyLatentImage({ width: 1024, height: 1024 })
        const suitsImages = new Map<(typeof suits)[number], _IMAGE>()
        for (const suit of suits) {
            const ima = p.logos?.[suit as keyof typeof p.logos]
            // either the logo is provided
            if (ima) {
                let y: _IMAGE & _MASK = await flow.loadImageAnswer(ima)
                let x = prettifyIcon(flow, { image: y, scaleRatio: 1.15 })
                suitsImages.set(suit, x)
                continue
            }
            // either we generate one
            const color = p.colors[suit as keyof typeof p.colors]
            let suitPos = `white_background, ${color} (symbol:1) ${suit} poker card`
            let suitImg: _IMAGE = graph.VAEDecode({
                vae: ckpt,
                samples: graph.KSampler({
                    seed,
                    latent_image: suitsoLatent,
                    // steps: 5,
                    sampler_name: 'euler',
                    scheduler: 'karras',
                    model: ckpt,
                    negative: graph.CLIPTextEncode({ clip: ckpt, text: '' }),
                    positive: graph.CLIPTextEncode({ clip: ckpt, text: suitPos }),
                }),
            })
            // suitImg = graph.Image_Rembg_$1Remove_Background$2({
            //     images: suitImg,
            //     model: 'u2net',
            //     background_color: 'none',
            //     transparency: true,
            // })
            suitsImages.set(suit, suitImg)
            graph.PreviewImage({ images: suitImg })
        }

        // 3. BACKGROUND --------------------------------------------------
        flow.print('generating backgrounds')
        const suitsBackground = new Map<(typeof suits)[number], _LATENT>()
        const suitsBackgroundLatent = graph.EmptyLatentImage({ width: W, height: H })
        for (const suit of suits) {
            const suitColor = p.colors[suit as keyof typeof p.colors]
            const suitBGPrompt = `${suitColor} background, pattern, ${p.generalTheme}`
            flow.print(`generating background for ${suit} with prompt "${suitBGPrompt}"`)
            const colorImage = graph.KSampler({
                seed,
                latent_image: suitsBackgroundLatent,
                sampler_name: 'euler',
                scheduler: 'karras',
                // steps: 5,
                model: ckpt,
                negative: graph.CLIPTextEncode({ clip: ckpt, text: 'text, watermarks, logo' }),
                positive: graph.CLIPTextEncode({ clip: ckpt, text: suitBGPrompt }),
            })
            graph.PreviewImage({ images: graph.VAEDecode({ samples: colorImage, vae: ckpt }) })
            suitsBackground.set(suit, colorImage)
        }

        // 4. CARDS --------------------------------------------------
        const themeFor = {
            spades: p.theme1,
            hearts: p.theme2,
            clubs: p.theme3,
            diamonds: p.theme4,
        }
        const margin = p.margin ?? 50
        // const emptyLatent = graph.EmptyLatentImage({ width: W, height: H })
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
        const cardsSorted = p.cards.sort((a, b) => {
            const scoreA = 100 * a.x + a.y
            const scoreB = 100 * b.x + b.y
            return scoreA - scoreB
        })
        flow.print(`🔴 ${cardsSorted.map((c) => `${c.col}${c.row}`)}`)
        for (const card of cardsSorted) {
            const { col: value, row: suit } = card
            // PROMPT  ----------------------------------------
            const theme = themeFor[suit as keyof typeof themeFor]
            const suitColor = p.colors[suit as keyof typeof p.colors]
            const suitLogo = suitsImages.get(suit)!
            const basePrompt =
                {
                    J: p.illustrationJack,
                    Q: p.illustrationQueen,
                    K: p.illustrationKing,
                }[value] ?? `background`

            const positiveText = `masterpiece, monster, monster-girl, pixar, strong expression rpg, ${basePrompt}, ${suitColor} of ${suit} color, intricate details, theme of ${theme} and ${p.generalTheme}, 4k`
            flow.print(`👉 ${value}${suit} : ${positiveText}`)
            const positive = graph.CLIPTextEncode({ clip: ckpt, text: positiveText })
            const crop_blending = 0

            // MAIN IMAGE ----------------------------------------
            const mask = graph.Image_To_Mask({ image: maskImage, method: 'intensity' })
            let latent: _LATENT = suitsBackground.get(suit)! // emptyLatent
            latent = graph.SetLatentNoiseMask({ mask, samples: latent })
            let sample: _LATENT = graph.KSampler({
                seed: flow.randomSeed(),
                latent_image: latent,
                model: ckpt,
                positive: positive,
                negative: graph.CLIPTextEncode({ clip: ckpt, text: negativeText }),
                sampler_name: 'euler',
                scheduler: 'karras',
            })

            // ADD LOGOS ----------------------------------------
            let pixels: _IMAGE = graph.VAEDecode({ vae: ckpt, samples: sample })
            const addLogo = (
                //
                pixels: _IMAGE,
                atX_: number,
                atY_: number,
                factor = 1,
            ) => {
                const finalLogoSize = p.logoSize * factor
                const atX = floor(atX_ - finalLogoSize / 2)
                const atY = floor(atY_ - finalLogoSize / 2)
                return graph.Image_Paste_Crop_by_Location({
                    // base image
                    image: pixels,
                    // image to add
                    crop_image: suitLogo,
                    crop_sharpening: 0,
                    crop_blending,
                    // Y
                    top: atY,
                    bottom: atY + finalLogoSize,
                    // X
                    left: atX,
                    right: atX + finalLogoSize,
                }).IMAGE
            }
            if (value === '1') {
                flow.print('adding "1" logo')
                pixels = addLogo(pixels, W / 2, H / 2, 3)
            } else if (value == '2') {
                flow.print('adding "2" logo')
                pixels = addLogo(pixels, W2, H3)
                pixels = addLogo(pixels, W2, 2 * H3)
            } else if (value == '3') {
                flow.print('adding "3" logo')
                pixels = addLogo(pixels, W2, H4)
                pixels = addLogo(pixels, W2, 2 * H4)
                pixels = addLogo(pixels, W2, 3 * H4)
            } else if (value == '4') {
                flow.print('adding "3" logo')
                pixels = addLogo(pixels, W3, H4)
                pixels = addLogo(pixels, 2 * W3, H4)
                pixels = addLogo(pixels, W3, 3 * H4)
                pixels = addLogo(pixels, 2 * W3, 3 * H4)
            } else if (value == '5') {
                flow.print('adding "3" logo')
                pixels = addLogo(pixels, W3, H4)
                pixels = addLogo(pixels, 2 * W3, H4)
                pixels = addLogo(pixels, W3, 3 * H4)
                pixels = addLogo(pixels, 2 * W3, 3 * H4)
                pixels = addLogo(pixels, W2, H2)
            } else if (value === '9') {
                flow.print('adding "9" logo')
                // paste logos
                for (const x of [1, 2]) {
                    const atX = Math.floor(Math.random() * (W - p.logoSize))
                    const atY = Math.floor(Math.random() * (H - p.logoSize))
                    pixels = addLogo(pixels, atX, atY)
                }
            }

            // SMOOTH LOGOS ----------------------------------------
            sample = graph.VAEEncode({ pixels: pixels, vae: ckpt })
            sample = graph.KSampler({
                seed: flow.randomSeed(),
                latent_image: sample,
                model: ckpt,
                positive: positive,
                negative: graph.CLIPTextEncode({ clip: ckpt, text: negativeText }),
                sampler_name: 'euler',
                scheduler: 'karras',
                denoise: 0.6,
            })

            // ADD CORNERS ----------------------------------------
            pixels = graph.VAEDecode({ vae: ckpt, samples: sample })
            const sideSize = 2 * margin

            pixels = addLogo(pixels, sideSize, sideSize, sideSize / p.logoSize)
            pixels = addLogo(pixels, W - sideSize, H - sideSize, sideSize / p.logoSize)
            const text = graph.ImageTextOutlined({
                font: 'Roboto-Regular.ttf',
                text: value,
                outline_size: 8,
                size: 100,
                outline_blue: 10,
                outline_red: 10,
                outline_green: 10,
                blue: 255,
                red: 255,
                green: 255,
            })
            const textRotated = graph.Image_Rotate({ images: text, mode: 'transpose', rotation: 180, sampler: 'bilinear' })
            // corner numbers
            pixels = graph.ImageCompositeAbsolute({
                images_a: pixels,
                images_b: text,
                images_b_x: margin,
                images_b_y: margin,
                background: 'images_a',
                method: 'pair',
            })
            pixels = graph.ImageCompositeAbsolute({
                images_a: pixels,
                images_b: textRotated,
                images_b_x: W - margin - 100,
                images_b_y: H - margin - 100,
                background: 'images_a',
                method: 'pair',
            })

            // round corners
            pixels = graph.ImageTransformCropCorners({
                images: pixels,
                bottom_left_corner: 'true',
                bottom_right_corner: 'true',
                top_left_corner: 'true',
                top_right_corner: 'true',
                method: 'lanczos',
                radius: 100,
                SSAA: 4,
            })

            // DONE ----------------------------------------
            graph.PreviewImage({ images: pixels })
        }
        await flow.PROMPT()
    },
})
