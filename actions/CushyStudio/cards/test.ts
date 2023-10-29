import type { ImageAndMask, Runtime } from 'src/back/Runtime'

card({
    name: 'cards v3',
    author: 'rvion',
    description: 'showcase the API builder',
    ui: (form) => ({
        color: form.color({ default: 'red' }),
    }),
    run: async (flow, p) => {
        const res = await fooKonva(flow, p)
        flow.nodes.PreviewImage({ images: res })
        await flow.PROMPT()
    },
})

export async function fooKonva(flow: Runtime, p: { color: string }): Promise<ImageAndMask> {
    const I = await flow.loadImageSDK()
    const container: HTMLDivElement = I.createContainer()
    const stage = new I.Stage({ container: container, width: 300, height: 450 })
    const layer = new I.Layer()
    stage.add(layer)

    I.fillFullLayerWithGradient(stage, layer, [0.2, 'blue', 0.5, p.color, 0.8, 'rgba(0, 0, 0, 0)'])

    const image = await I.loadImage('CushyStudio/cards/_assets/symbol-diamond.png')

    const positions: { x: number; y: number; scaleY: number }[] = [
        { x: 50, y: 60, scaleY: 1 },
        { x: 200, y: 60, scaleY: 1 },
        { x: 50, y: 180, scaleY: 1 },
        { x: 200, y: 180, scaleY: 1 },
        { x: 50, y: 450 - 60, scaleY: -1 },
        { x: 200, y: 450 - 60, scaleY: -1 },
        { x: 50, y: 450 - 180, scaleY: -1 },
        { x: 200, y: 450 - 180, scaleY: -1 },
    ]

    // add main shapes on the card body
    const haloSize = 20
    for (const pos of positions) {
        const nthSymbol = new I.Image({ image, ...pos, width: 70, height: 70 })
        const nthHalo = new I.Image({
            image,
            width: 70 + haloSize,
            height: 70 + haloSize,
            x: pos.x - haloSize / 2,
            y: pos.y - (haloSize * pos.scaleY) / 2,
            scaleY: pos.scaleY,
            opacity: 0.5,
        })
        layer.add(nthHalo, nthSymbol)
    }

    // add numbers and suit color on top-left and bottom-right corners
    const textOptions = { fontFamily: 'Times New Roman', fontSize: 36, fontWeight: 'bold' }
    const number = new I.Text({ text: '8', ...textOptions, x: 20, y: 10 })
    const numberBottom = new I.Text({ text: '8', ...textOptions, x: 20, y: 400, scaleY: -1 })
    const diamondTop = new I.Image({ image, x: 20, y: 60, width: 30, height: 30 })
    const diamondBottom = new I.Image({ image, x: 20, y: 360, width: 30, height: 30, scaleY: -1 })
    layer.add(number, numberBottom, diamondTop, diamondBottom)

    // export the image
    stage.draw()
    return flow.load_dataURL(stage.toDataURL({ width: stage.width(), height: stage.height() }))
}
