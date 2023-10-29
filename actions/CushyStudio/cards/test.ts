import type { ImageAndMask, Runtime } from 'src/back/Runtime'

card({
    name: 'cards v3',
    author: 'rvion',
    description: 'play with cards',
    ui: () => ({}),
    run: async (flow, p) => {
        const res = await fooKonva(flow)
        flow.nodes.PreviewImage({ images: res })
        await flow.PROMPT()
    },
})

export async function fooKonva(flow: Runtime): Promise<ImageAndMask> {
    const { Stage, Layer, Image, Text, Rect } = await flow.loadImageMaker()

    const layer = new Layer()
    const container: HTMLDivElement =
        (document.getElementById('konvaPreview') as Maybe<HTMLDivElement>) ?? //
        document.createElement('div')
    container.style.width = '300px'
    container.id = 'konvaPreview'
    container.style.height = '450px'
    // container.style.backgroundColor = 'red'
    container.style.zIndex = '99999999'
    container.style.border = '1px solid red'

    // make absolute
    container.style.position = 'absolute'
    container.style.top = '10px'
    container.style.left = '10px'
    // mount to body
    document.body.appendChild(container)

    // container.style.backgroundColor = 'blue'
    const stage = new Stage({ container: container, width: 300, height: 450 })
    layer.add(
        new Rect({
            x: 0,
            y: 0,
            width: stage.width(),
            height: stage.height(),
            illLinearGradientStartPoint: { x: 0, y: 0 },
            fillLinearGradientEndPoint: { x: stage.width(), y: stage.height() },
            fillLinearGradientColorStops: [0.5, 'blue', 0.8, 'rgba(0, 0, 0, 0)'],
            listening: false,
        }),
    )

    stage.add(layer)

    const image = await loadImage('CushyStudio/cards/_assets/symbol-diamond.png')

    // const diamonds = []
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
        const nthSymbol = new Image({ image, ...pos, width: 70, height: 70 })
        const nthHalo = new Image({
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
    const number = new Text({ text: '8', ...textOptions, x: 20, y: 10 })
    const numberBottom = new Text({ text: '8', ...textOptions, x: 20, y: 400, scaleY: -1 })
    const diamondTop = new Image({ image, x: 20, y: 60, width: 30, height: 30 })
    const diamondBottom = new Image({ image, x: 20, y: 360, width: 30, height: 30, scaleY: -1 })
    layer.add(number, numberBottom, diamondTop, diamondBottom)

    // export the image
    stage.draw()
    return flow.load_dataURL(stage.toDataURL({ width: stage.width(), height: stage.height() }))
}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
    })
}
