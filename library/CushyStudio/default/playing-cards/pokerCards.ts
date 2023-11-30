import type { FormBuilder } from 'src/controls/FormBuilder'
import { CardSuit, CardValue } from './_cardLayouts'
import { _drawCard } from './_drawCard'

const ui = (form: FormBuilder) => ({
    // [UI] MODEL --------------------------------------
    // generate
    _1: form.markdown({ markdown: `# Model` }),
    model: form.enum({
        enumName: 'Enum_CheckpointLoaderSimple_ckpt_name',
        default: 'revAnimated_v122.safetensors',
        group: 'model',
    }),
    // foo: form.selectOne({
    //     choices: [{ type: 'foo' }, { type: 'bar' }],
    //     group: 'model',
    // }),

    // [UI] CARD ---------------------------------------
    _2: form.markdown({ markdown: `# Cards` }),
    cards: form.matrix({
        cols: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
        rows: ['spades', 'hearts', 'clubs', 'diamonds'],
        default: [],
    }),

    logos: form.group({
        layout: 'H',
        // className: 'flex flex-wrap',
        items: () => ({
            spades: form.imageOpt({}),
            hearts: form.imageOpt({}),
            clubs: form.imageOpt({}),
            diamonds: form.imageOpt({}),
        }),
    }),

    _3: form.markdown({ markdown: `# Prompts` }),
    generalTheme: form.string({ default: 'fantasy' }),
    // Main cards
    illustrations: form.group({
        layout: 'H',
        // className: 'p-2 bg-red-800',
        items: () => ({
            Jack: form.str({ default: 'gold, Knight', group: 'illusration' }),
            Queen: form.str({ default: 'gold, Queen', group: 'illusration' }),
            King: form.str({ default: 'gold, King', group: 'illusration' }),
        }),
    }),

    // [UI] THEME --------------------------------------
    themes: form.group({
        items: () => ({
            spades: form.string({ default: 'underwater, sea, fish, tentacles, ocean', group: 'theme' }),
            hearts: form.string({ default: 'volcanic, lava, rock, fire', group: 'theme' }),
            clubs: form.string({ default: 'forest, nature, branches, trees', group: 'theme' }),
            diamonds: form.string({ default: 'snow, ice, mountain, transparent winter', group: 'theme' }),
        }),
    }),

    colors: form.group({
        items: () => ({
            spades: form.string({ default: 'blue' }),
            hearts: form.string({ default: 'red' }),
            clubs: form.string({ default: 'green' }),
            diamonds: form.string({ default: 'white' }),
        }),
    }),

    // theme5: form.string({ default: 'winter', group: 'theme' }),

    // [UI] SIZES --------------------------------------
    logoSize: form.int({ default: 120, min: 20, max: 1000 }),
    size: form.size({ default: { modelType: 'SD1.5 512', aspectRatio: '16:9' }, group: 'size' }),
    // W: form.int({ default: 512, group: 'size' }),
    // H: form.int({ default: 726, group: 'size' }),

    // [UI] BORDERS ------------------------------------
    background: form.group({
        items: () => ({
            seed: form.seed({ default: 0, defaultMode: 'fixed' }),
            help: form.markdown({ markdown: `Use \`{color}\` and \`{suit}\` to insert the current color and suit` }),
            prompt: form.string({ default: `{color} background pattern` }),
        }),
    }),
    margin: form.intOpt({ default: 40 }),
    symetry: form.bool({ default: false }),
})

app({
    ui,
    run: async (flow, p) => {
        // 1. SETUP --------------------------------------------------
        const graph = flow.nodes

        await _drawCard(flow, '1', 'hearts')

        const floor = (x: number) => Math.floor(x)
        const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: p.model })
        const suits = Array.from(new Set(p.cards.map((c) => c.row)))
        const values = Array.from(new Set(p.cards.map((c) => c.col)))
        const W = p.size.width, W2 = floor(W / 2), W3 = floor(W / 3), W4 = floor(W / 4) // prettier-ignore
        const H = p.size.height, H2 = floor(H / 2), H3 = floor(H / 3), H4 = floor(H / 4) // prettier-ignore

        // 3. BACKGROUND --------------------------------------------------
        // flow.output_text('generating backgrounds')
        const suitsBackground = new Map<(typeof suits)[number], _LATENT>()
        // const suitsBackgroundLatent = graph.EmptyLatentImage({ width: W, height: H })
        // for (const suit of suits) {
        //     const suitColor = p.colors[suit as keyof typeof p.colors]
        //     const suitBGPrompt = p.background.prompt.replace('{color}', suitColor).replace('{suit}', suit)
        //     flow.output_text(`generating background for ${suit} with prompt "${suitBGPrompt}"`)
        //     const colorImage = graph.KSampler({
        //         seed: p.background.seed,
        //         latent_image: suitsBackgroundLatent,
        //         sampler_name: 'euler',
        //         scheduler: 'karras',
        //         model: ckpt,
        //         positive: graph.CLIPTextEncode({ clip: ckpt, text: suitBGPrompt }),
        //         negative: graph.CLIPTextEncode({ clip: ckpt, text: 'text, watermarks, logo, 1girl' }),
        //     })
        //     graph.PreviewImage({ images: graph.VAEDecode({ samples: colorImage, vae: ckpt }) })
        //     suitsBackground.set(suit, colorImage)
        // }

        // 4. CARDS --------------------------------------------------
        const margin = p.margin ?? 50
        // const emptyLatent = graph.EmptyLatentImage({ width: W, height: H })
        // prettier-ignore
        // const maskImage = graph.Create_Rect_Mask({
        //     image_width: W, image_height: H,
        //     mode: 'pixels', origin: 'topleft',
        //     x: margin, y: margin,
        //     width: W - 2 * margin,
        //     height: H - 2 * margin,
        // })
        // graph.PreviewImage({ images: maskImage })
        const negativeText = 'text, watermarks, logo, nsfw, boobs'
        const cardsSorted = p.cards.sort((a, b) => {
            const scoreA = 100 * a.x + a.y
            const scoreB = 100 * b.x + b.y
            return scoreA - scoreB
        })
        flow.output_text(`🔴 ${cardsSorted.map((c) => `${c.col}${c.row}`)}`)
        for (const card of cardsSorted) {
            const { col: value, row: suit } = card

            // PROMPT  ----------------------------------------
            const theme = p.themes[suit as keyof typeof p.themes]
            const suitColor = p.colors[suit as keyof typeof p.colors]
            // const suitLogo = suitsImages.get(suit)!
            const illustrations = p.illustrations
            const basePrompt =
                {
                    J: illustrations.Jack,
                    Q: illustrations.Queen,
                    K: illustrations.King,
                }[value] ?? `background`

            const positiveText = `masterpiece, rpg, ${basePrompt}, ${suitColor} of ${suit} color, intricate details, theme of ${theme} and ${p.generalTheme}, 4k`
            flow.output_text(`👉 ${value}${suit} : ${positiveText}`)
            const positive = graph.CLIPTextEncode({ clip: ckpt, text: positiveText })
            // const crop_blending = 0

            // MAIN IMAGE ----------------------------------------
            // const mask = graph.Image_To_Mask({ image: maskImage, method: 'intensity' })
            let latent: _LATENT = suitsBackground.get(suit)! // emptyLatent
            // latent = graph.SetLatentNoiseMask({ mask, samples: latent })
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
            const xx = await _drawCard(flow, value as CardValue, suit as CardSuit)
            pixels = graph.AlphaChanelRemove({
                images: graph.ImageCompositeAbsolute({
                    background: 'images_a',
                    images_a: pixels,
                    images_b: graph.JoinImageWithAlpha({ alpha: xx.base, image: xx.base }),
                    method: 'matrix',
                }),
            })
            graph.PreviewImage({ images: pixels })

            // SMOOTH LOGOS ----------------------------------------
            sample = graph.SetLatentNoiseMask({
                samples: graph.VAEEncode({ pixels: pixels, vae: ckpt }),
                mask: graph.ImageToMask({ image: xx.mask, channel: 'blue' }),
            })

            graph.PreviewImage({ images: xx.mask })

            sample = graph.KSampler({
                seed: flow.randomSeed(),
                latent_image: sample,
                model: ckpt,
                positive: positive,
                negative: graph.CLIPTextEncode({ clip: ckpt, text: negativeText }),
                sampler_name: 'euler',
                scheduler: 'karras',
                denoise: 0.55,
            })

            // ADD CORNERS ----------------------------------------
            pixels = graph.VAEDecode({ vae: ckpt, samples: sample })
            const sideSize = 2 * margin

            // ROUND CORNERS ----------------------------------------------------
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
