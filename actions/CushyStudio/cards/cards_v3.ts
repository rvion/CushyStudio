import type { NodeConfig } from 'konva/lib/Node'
import type { ImageAndMask, Runtime } from 'src/back/Runtime'
import type { FormBuilder } from 'src/controls/FormBuilder'

import { prettifyIcon } from '../../rvion/private/cards/icons/TEST'
type Value = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'
type Suit = 'spades' | 'hearts' | 'clubs' | 'diamonds'

const ui = (form: FormBuilder) => ({
    // [UI] MODEL --------------------------------------
    model: form.enum({
        enumName: 'Enum_CheckpointLoaderSimple_ckpt_name',
        default: 'revAnimated_v122.safetensors',
        group: 'model',
    }),
    foo: form.selectOne({
        choices: [{ type: 'foo' }, { type: 'bar' }],
        group: 'model',
    }),

    // [UI] CARD ---------------------------------------
    cards: form.matrix({
        cols: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
        rows: ['spades', 'hearts', 'clubs', 'diamonds'],
        default: [],
    }),

    // Main cards
    illustrations: form.group({
        layout: 'H',
        className: 'p-2 bg-red-800',
        items: () => ({
            Jack: form.str({ default: 'gold, Knight', group: 'illusration' }),
            Queen: form.str({ default: 'gold, Queen', group: 'illusration' }),
            King: form.str({ default: 'gold, King', group: 'illusration' }),
        }),
    }),

    // [UI] THEME --------------------------------------
    generalTheme: form.string({ default: 'fantasy' }),
    themes: form.group({
        items: () => ({
            theme1: form.string({ default: 'underwater, sea, fish, tentacles, ocean', group: 'theme' }),
            theme2: form.string({ default: 'volcanic, lava, rock, fire', group: 'theme' }),
            theme3: form.string({ default: 'forest, nature, branches, trees', group: 'theme' }),
            theme4: form.string({ default: 'snow, ice, mountain, transparent winter', group: 'theme' }),
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
    logos: form.group({
        // className: 'flex flex-wrap',
        items: () => ({
            spades: form.imageOpt({}),
            hearts: form.imageOpt({}),
            clubs: form.imageOpt({}),
            diamonds: form.imageOpt({}),
        }),
    }),

    // [UI] SIZES --------------------------------------
    logoSize: form.int({ default: 120 }),
    W: form.int({ default: 512, group: 'size' }),
    H: form.int({ default: 726, group: 'size' }),

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

card({
    name: 'cards v3',
    author: 'rvion',
    description: 'play with cards',
    ui,
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

        // 3. BACKGROUND --------------------------------------------------
        flow.print('generating backgrounds')
        const suitsBackground = new Map<(typeof suits)[number], _LATENT>()
        const suitsBackgroundLatent = graph.EmptyLatentImage({ width: W, height: H })
        for (const suit of suits) {
            const suitColor = p.colors[suit as keyof typeof p.colors]
            // `${suitColor} background, pattern`
            const suitBGPrompt = p.background.prompt //
                .replace('{color}', suitColor)
                .replace('{suit}', suit)
            flow.print(`generating background for ${suit} with prompt "${suitBGPrompt}"`)
            const colorImage = graph.KSampler({
                seed: p.background.seed,
                latent_image: suitsBackgroundLatent,
                sampler_name: 'euler',
                scheduler: 'karras',
                // steps: 5,
                model: ckpt,
                positive: graph.CLIPTextEncode({ clip: ckpt, text: suitBGPrompt }),
                negative: graph.CLIPTextEncode({ clip: ckpt, text: 'text, watermarks, logo, 1girl' }),
            })
            graph.PreviewImage({ images: graph.VAEDecode({ samples: colorImage, vae: ckpt }) })
            suitsBackground.set(suit, colorImage)
        }

        // 4. CARDS --------------------------------------------------
        const themeFor = {
            spades: p.themes.theme1,
            hearts: p.themes.theme2,
            clubs: p.themes.theme3,
            diamonds: p.themes.theme4,
        }
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
        flow.print(`🔴 ${cardsSorted.map((c) => `${c.col}${c.row}`)}`)
        for (const card of cardsSorted) {
            const { col: value, row: suit } = card

            // PROMPT  ----------------------------------------
            const theme = themeFor[suit as keyof typeof themeFor]
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
            flow.print(`👉 ${value}${suit} : ${positiveText}`)
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
            const xx = await drawCard(flow, value as Value, suit as Suit)
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

export async function drawCard(
    //
    flow: Runtime,
    value: Value,
    suit: Suit,
): Promise<{
    base: ImageAndMask
    mask: ImageAndMask
}> {
    const I = await flow.loadImageSDK()
    const W = 512
    const H = 800
    const mkImage = () => {
        const container: HTMLDivElement = I.createContainer()
        const stage = new I.Stage({ container: container, width: W, height: H })
        const layer = new I.Layer()
        stage.add(layer)
        return { container, stage, layer }
    }

    const image = await (() => {
        if (suit === 'diamonds') return I.loadImage('CushyStudio/cards/_assets/symbol-diamond.png')
        if (suit === 'clubs') return I.loadImage('CushyStudio/cards/_assets/symbol-club.png')
        if (suit === 'hearts') return I.loadImage('CushyStudio/cards/_assets/symbol-heart.png')
        if (suit === 'spades') return I.loadImage('CushyStudio/cards/_assets/symbol-spades.png')
        return exhaust(suit)
    })()

    // for (const value of [1, 2, 3, 4, 5, 8]) {
    // transparent base image
    const base = mkImage()

    // white mask
    const mask = mkImage()
    mask.layer.add(new I.Rect({ x: 0, y: 0, width: W, height: H, fill: 'white' }))

    type CardConfig = { x: number; y: number; flip?: true; size?: number }
    const positions: CardConfig[] = (() => {
        if (value === '1') return [{ x: 0.5, y: 0.5, size: 0.4 }]
        if (value === '2')
            return [
                { x: 0.5, y: 0.3 },
                { x: 0.5, y: 0.7 },
            ]
        if (value === '3')
            return [
                { x: 0.5, y: 0.3 },
                { x: 0.5, y: 0.7 },
                { x: 0.5, y: 0.5 },
            ]
        if (value === '4')
            return [
                { x: 0.3, y: 0.2 },
                { x: 0.3, y: 0.8 },
                { x: 0.7, y: 0.2 },
                { x: 0.7, y: 0.8 },
            ]
        if (value === '5')
            return [
                { x: 0.3, y: 0.2 },
                { x: 0.3, y: 0.8 },
                { x: 0.7, y: 0.2 },
                { x: 0.7, y: 0.8 },
                { x: 0.5, y: 0.5 },
            ]
        if (value === '8')
            return [
                { x: 0.2, y: 0.2 },
                { x: 0.2, y: 0.4 },
                { x: 0.8, y: 0.2 },
                { x: 0.8, y: 0.4 },
                { x: 0.2, y: 0.6, flip: true },
                { x: 0.2, y: 0.8, flip: true },
                { x: 0.8, y: 0.6, flip: true },
                { x: 0.8, y: 0.8, flip: true },
            ]
        return []
    })()

    const normalize = (p: CardConfig, growBy = 1): NodeConfig => {
        const width = growBy * (p.size != null ? p.size * base.stage.width() : iconSize)
        return {
            x: p.x * base.stage.width() + 10 * Math.random(),
            y: p.y * base.stage.height() + 10 * Math.random(),
            width: width,
            height: width,
            scaleY: p.flip ? -1 : 1,
            offsetX: width / 2,
            offsetY: width / 2,
        }
    }

    const iconSize = base.stage.width() / 4
    for (const pos of positions) {
        // base image
        const norm = normalize(pos)
        const nthSymbol = new I.Image({ image, ...norm })
        // base halo
        const norm2 = normalize(pos, 1.4)
        const nthHalo = new I.Image({ image, ...norm2, opacity: 0.5 })
        base.layer.add(nthHalo, nthSymbol)
        // mask image
        const maskImg = new I.Image({ image, ...norm })
        maskImg.cache()
        maskImg.filters([I.Konva.Filters.Brighten])
        maskImg.brightness(-0.3)
        // maskImg.opacity(0.5)
        mask.layer.add(maskImg)
    }

    // add numbers and suit color on top-left and bottom-right corners
    const textOptions = { fontFamily: 'Times New Roman', fontSize: 36, fontWeight: 'bold' }
    const number = new I.Text({ text: '8', ...textOptions, x: 20, y: 10 })
    const numberBottom = new I.Text({ text: '8', ...textOptions, x: 20, y: 400, scaleY: -1 })
    const diamondTop = new I.Image({ image, x: 20, y: 60, width: 30, height: 30 })
    const diamondBottom = new I.Image({ image, x: 20, y: 360, width: 30, height: 30, scaleY: -1 })
    base.layer.add(number, numberBottom, diamondTop, diamondBottom)

    // export the base
    base.stage.draw()
    const dataURL_base = base.stage.toDataURL({ width: W, height: H })

    // export the mask
    base.stage.draw()
    const dataURL_mask = mask.stage.toDataURL({ width: W, height: H })
    return {
        base: await flow.load_dataURL(dataURL_base),
        mask: await flow.load_dataURL(dataURL_mask),
    }
}

// layer.add(
//     new I.Rect({ x: 0, y: 0, width: stage.width(), height: stage.height(), fill: 'rgba(0, 0, 0, 0)', listening: false }),
// )

// 👇 self contain utility you can add in your own helper file
// I.fillFullLayerWithGradient(stage, layer, [0.2, 'red', 0.5, p.color, 0.8, 'rgba(0, 0, 0, 0)'])
// 👇 example using the base gradient primitives
// layer.add(
//     new I.Rect({
//         x: 0,
//         y: stage.height() / 4,
//         width: stage.width(),
//         height: stage.height() / 2,
//         fillRadialGradientStartPoint: { x: 100, y: 100 },
//         fillRadialGradientStartRadius: 0,
//         fillRadialGradientEndPoint: { x: 100, y: 100 },
//         fillRadialGradientEndRadius: 100,
//         fillRadialGradientColorStops: [0, 'red', 0.5, 'yellow', 1, 'rgba(0, 0, 0, 0)'],
//         listening: false,
//     }),
// )
