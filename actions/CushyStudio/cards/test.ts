import type { NodeConfig } from 'konva/lib/Node'
import type { ImageAndMask, Runtime } from 'src/back/Runtime'

card({
    name: 'cards v3',
    author: 'rvion',
    description: 'showcase the API builder',
    ui: (form) => ({
        color: form.color({ default: 'red' }),
    }),
    run: async (flow, p) => {
        flow.print('YOLO')
        const res = await fooKonva(flow, p)
        for (const r of res) {
            flow.previewImageWithAlpha(r)
        }
        await flow.PROMPT()
    },
})

export async function fooKonva(flow: Runtime, p: { color: string }): Promise<ImageAndMask[]> {
    const I = await flow.loadImageSDK()
    const W = 512
    const H = 800
    const outputs: ImageAndMask[] = []
    const mkImage = () => {
        const container: HTMLDivElement = I.createContainer()
        const stage = new I.Stage({ container: container, width: W, height: H })
        const layer = new I.Layer()
        stage.add(layer)
        return { container, stage, layer }
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

    const image = await I.loadImage('CushyStudio/cards/_assets/symbol-diamond.png')

    for (const value of [1, 2, 3, 4, 5, 8]) {
        const base = mkImage()
        const mask = mkImage()

        type Pos = { x: number; y: number; flip?: true; size?: number }

        // const X = [.2,.5,.8]
        // const Y = [.2,.3,.4]
        const positions: Pos[] = (() => {
            if (value === 1) return [{ x: 0.5, y: 0.5, size: 0.4 }]
            if (value === 2)
                return [
                    { x: 0.5, y: 0.3 },
                    { x: 0.5, y: 0.7 },
                ]
            if (value === 3)
                return [
                    { x: 0.5, y: 0.3 },
                    { x: 0.5, y: 0.7 },
                    { x: 0.5, y: 0.5 },
                ]
            if (value === 4)
                return [
                    { x: 0.3, y: 0.2 },
                    { x: 0.3, y: 0.8 },
                    { x: 0.7, y: 0.2 },
                    { x: 0.7, y: 0.8 },
                ]
            if (value === 5)
                return [
                    { x: 0.3, y: 0.2 },
                    { x: 0.3, y: 0.8 },
                    { x: 0.7, y: 0.2 },
                    { x: 0.7, y: 0.8 },
                    { x: 0.5, y: 0.5 },
                ]
            if (value === 8)
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

        const normalize = (p: Pos, growBy = 1): NodeConfig => {
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

        mask.layer.add(new I.Rect({ x: 0, y: 0, width: W, height: H, fill: 'white' }))
        // mask1.layer.add(new I.Rect({ ...norm, fill: 'white' }))

        // add main shapes on the card body
        const haloSize = 20
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
            maskImg.brightness(-1)
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
        const dataURL = base.stage.toDataURL({ width: W, height: H })
        outputs.push(await flow.load_dataURL(dataURL))
        // export the mask
        base.stage.draw()
        const dataURL2 = mask.stage.toDataURL({ width: W, height: H })
        outputs.push(await flow.load_dataURL(dataURL2))
    }
    return outputs
}
