import { ImageAndMask } from 'src'
import type { FormBuilder } from 'src/controls/FormBuilder'
import { CardSuit, CardValue } from './playing-cards/_cardLayouts'
import { _drawCard } from './playing-cards/_drawCard'
import { toJS } from 'mobx'
import { ui_highresfix } from './_prefabs/_prefabs'
import { run_model, ui_model } from './_prefabs/prefab_model'
import { run_sampler, ui_sampler } from './_prefabs/prefab_sampler'
import { run_prompt } from './_prefabs/prefab_prompt'

app({
    metadata: {
        name: 'Illustrated deck of cards',
        illustration: 'library/built-in/_illustrations/poker-card-generator.jpg',
        description: 'Allow you to generate illustrated deck of cards',
    },
    ui: (form: FormBuilder) => ({
        // [UI] CARD ---------------------------------------
        // _2: form.markdown({ markdown: `### Cards`, label: false }),
        cards: form.matrix({
            cols: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
            rows: ['spades', 'hearts', 'clubs', 'diamonds'],
            default: [],
        }),
        // [UI] SIZES --------------------------------------
        size: form.size({
            //
            default: { modelType: 'SD1.5 512', aspectRatio: '16:9' },
            group: 'size',
        }),
        logoSize: form.int({ default: 120, min: 20, max: 1000 }),

        // [UI] MODEL --------------------------------------
        model: ui_model(form),
        sampler: ui_sampler(form),
        highResFix: ui_highresfix(form, { activeByDefault: true }),
        globalNegative: form.prompt({}),
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

        // _3: form.markdown({ markdown: `### Prompts`, label: false }),
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
    }),
    run: async (run, ui) => {
        //===//===//===//===//===//===//===//===//===//===//===//===//===//
        // 1. SETUP --------------------------------------------------
        const graph = run.nodes
        const floor = (x: number) => Math.floor(x)
        let { ckpt, vae, clip } = run_model(run, ui.model)
        const suits = Array.from(new Set(ui.cards.map((c) => c.row)))
        const values = Array.from(new Set(ui.cards.map((c) => c.col)))
        const W = ui.size.width, W2 = floor(W / 2), W3 = floor(W / 3), W4 = floor(W / 4) // prettier-ignore
        const H = ui.size.height, H2 = floor(H / 2), H3 = floor(H / 3), H4 = floor(H / 4) // prettier-ignore
        const margin = ui.margin ?? 50

        //===//===//===//===//===//===//===//===//===//===//===//===//===//
        // 2. BACKGROUND --------------------------------------------------
        const suitsBackground = new Map<(typeof suits)[number], _LATENT>()
        const suitsBackgroundLatent = graph.EmptyLatentImage({ width: W, height: H })
        for (const suit of suits) {
            // const store = run.getImageStore({ tag: `bg-${suit}`, autoUpdate: (img) => img.filename.startsWith(`${suit}_BG`) })
            const suitColor = ui.colors[suit as keyof typeof ui.colors]
            const suitBGPrompt = ui.background.prompt.replace('{color}', suitColor).replace('{suit}', suit)
            run.output_text(`generating background for ${suit} with prompt "${suitBGPrompt}"`)
            const colorImage = graph.KSampler({
                seed: ui.background.seed,
                latent_image: suitsBackgroundLatent,
                sampler_name: 'euler',
                steps: 10,
                scheduler: 'karras',
                model: ckpt,
                positive: graph.CLIPTextEncode({ clip, text: suitBGPrompt }),
                negative: graph.CLIPTextEncode({ clip, text: 'text, watermarks, logo, 1girl' }),
            })
            const pixels = graph.VAEDecode({ samples: colorImage, vae })
            graph.SaveImage({ images: pixels, filename_prefix: `${suit}_BG` }).storeAs(`bg-${suit}`)
            suitsBackground.set(suit, colorImage)
        }
        await run.PROMPT()

        //===//===//===//===//===//===//===//===//===//===//===//===//===//
        // 3. CARD LAYOUTS --------------------------------------------------
        const negativeText = 'text, watermarks, logo, nsfw, boobs'
        const cardsSorted = ui.cards.sort((a, b) => 100 * a.x + a.y - (100 * b.x + b.y))
        let foo: { [key: string]: { base: ImageAndMask; mask: ImageAndMask } } = {}
        for (const card of cardsSorted) {
            // console.log(`[👙] `, toJS(card))
            const { col: value, row: suit } = card
            const bg = run.Store.getImageStore(`bg-${suit}`).image
            const xx = await _drawCard(run, {
                baseUrl: bg?.url ?? 'file:///Users/loco/dev/CushyStudio/outputs/spades_BG_00002_.png',
                value: value as CardValue,
                suit: suit as CardSuit,
                H,
                W,
            })
            console.log(`[👙] `, toJS(xx))
            foo[`${suit}_${value}`] = xx
            graph.SaveImage({ images: xx.mask, filename_prefix: 'mask_1' })
            graph.SaveImage({
                images: graph.JoinImageWithAlpha({ alpha: xx.base, image: xx.base }),
                filename_prefix: 'base_1',
            })
        }
        await run.PROMPT()

        //===//===//===//===//===//===//===//===//===//===//===//===//===//
        // 4. PROMPT  ----------------------------------------
        const negP = run_prompt(run, { richPrompt: ui.globalNegative, ckpt, clip })
        // const emptyLatent = graph.EmptyLatentImage({ width: W, height: H })
        for (const card of cardsSorted) {
            const { col: value, row: suit } = card
            const theme = ui.themes[suit as keyof typeof ui.themes]
            const suitColor = ui.colors[suit as keyof typeof ui.colors]
            const illustrations = ui.illustrations
            const basePrompt =
                {
                    J: illustrations.Jack,
                    Q: illustrations.Queen,
                    K: illustrations.King,
                }[value] ?? `background`

            const positiveText = `masterpiece, rpg, ${basePrompt}, ${suitColor} of ${suit} color, intricate details, theme of ${theme} and ${ui.generalTheme}, 4k`
            const positive = graph.CLIPTextEncode({ clip, text: positiveText })
            const negative = negP.conditionning // graph.CLIPTextEncode({ clip, text: negativeText })
            const xxx = foo[`${suit}_${value}`]
            // let latent: _LATENT = suitsBackground.get(suit)! // emptyLatent
            let latent: _LATENT = graph.VAEEncode({ pixels: xxx.base, vae })
            latent = graph.SetLatentNoiseMask({
                samples: latent,
                mask: xxx.mask, // graph.ImageToMask({ image: xxx.mask, channel: 'alpha' }),
            })
            graph.PreviewImage({ images: graph.MaskToImage({ mask: xxx.mask }) })
            latent = graph.KSampler({
                seed: run.randomSeed(),
                latent_image: latent,
                model: ckpt,
                positive: positive,
                negative: negative,
                sampler_name: 'euler',
                scheduler: 'karras',
                denoise: 1,
                steps: 30,
            })

            if (ui.highResFix) {
                const emptyMask = graph.SolidMask({ height: H, width: W, value: 1 })
                latent = graph.SetLatentNoiseMask({ mask: emptyMask, samples: latent })
                if (ui.highResFix.saveIntermediaryImage) {
                    graph.SaveImage({ images: graph.VAEDecode({ samples: latent, vae }) })
                }
                latent = graph.LatentUpscale({
                    samples: latent,
                    crop: 'disabled',
                    upscale_method: 'nearest-exact',
                    height: ui.size.height * ui.highResFix.scaleFactor,
                    width: ui.size.width * ui.highResFix.scaleFactor,
                })
                latent = latent = run_sampler(
                    run,
                    {
                        seed: ui.sampler.seed,
                        cfg: ui.sampler.cfg,
                        steps: ui.highResFix.steps,
                        denoise: ui.highResFix.denoise,
                        sampler_name: 'ddim',
                        scheduler: 'ddim_uniform',
                    },
                    { ckpt, clip, negative, positive, vae, latent, preview: false },
                ).latent
            }

            // ADD LOGOS ----------------------------------------
            let pixels: _IMAGE = graph.VAEDecode({ vae, samples: latent })
            graph.SaveImage({ images: pixels, filename_prefix: `cards/${suit}/${value}/img` })
        }
        await run.PROMPT()
        return

        // 👙        for (const card of cardsSorted) {
        // 👙            // pixels = graph.AlphaChanelRemove({
        // 👙            //     images: graph.ImageCompositeAbsolute({
        // 👙            //         background: 'images_a',
        // 👙            //         images_a: pixels,
        // 👙            //         images_b: graph.JoinImageWithAlpha({ alpha: xx.base, image: xx.base }),
        // 👙            //         method: 'matrix',
        // 👙            //     }),
        // 👙            // })
        // 👙            // graph.PreviewImage({ images: pixels })
        // 👙
        // 👙            // SMOOTH LOGOS ----------------------------------------
        // 👙            sample = graph.SetLatentNoiseMask({
        // 👙                samples: graph.VAEEncode({ pixels: pixels, vae: ckpt }),
        // 👙                mask: graph.ImageToMask({ image: xx.mask, channel: 'blue' }),
        // 👙            })
        // 👙
        // 👙            // graph.PreviewImage({ images: xx.mask })
        // 👙
        // 👙            sample = graph.KSampler({
        // 👙                seed: flow.randomSeed(),
        // 👙                latent_image: sample,
        // 👙                model: ckpt,
        // 👙                positive: positive,
        // 👙                negative: graph.CLIPTextEncode({ clip: ckpt, text: negativeText }),
        // 👙                sampler_name: 'euler',
        // 👙                scheduler: 'karras',
        // 👙                denoise: 0.55,
        // 👙            })
        // 👙
        // 👙            // ADD CORNERS ----------------------------------------
        // 👙            pixels = graph.VAEDecode({ vae: ckpt, samples: sample })
        // 👙            const sideSize = 2 * margin
        // 👙
        // 👙            // ROUND CORNERS ----------------------------------------------------
        // 👙            // pixels = graph.ImageTransformCropCorners({
        // 👙            //     images: pixels,
        // 👙            //     bottom_left_corner: 'true',
        // 👙            //     bottom_right_corner: 'true',
        // 👙            //     top_left_corner: 'true',
        // 👙            //     top_right_corner: 'true',
        // 👙            //     method: 'lanczos',
        // 👙            //     radius: 100,
        // 👙            //     SSAA: 4,
        // 👙            // })
        // 👙
        // 👙            // DONE ----------------------------------------
        // 👙            graph.PreviewImage({ images: pixels })
        // 👙        }
        // 👙        await flow.PROMPT()
    },
})
