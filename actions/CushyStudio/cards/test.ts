import type { ImageAndMask, Runtime } from 'src/back/Runtime'

card({
    name: 'cards v3',
    author: 'rvion',
    description: 'play with cards',
    ui: () => ({}),
    run: async (flow, p) => {
        // flow.nodes.PreviewImage({
        //     images: flow.nodes.LoadImage({ image: 'Angled 5 - 512x512.png' }),
        // })
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

// export async function fooFabricJS(flow: Runtime): Promise<ImageAndMask> {
//     const canvas = new fabric.Canvas('myCanvas', { width: 300, height: 450, backgroundColor: 'white' })
//     const diamondURL = 'CushyStudio/cards/_assets/symbol-diamond.png'
//     const diamondImg = await fabric.FabricImage.fromURL(diamondURL, {}, {})
//     // const bw = fabric.filters.BlackWhite.fromObject({} as any)

//     diamondImg.scaleToWidth(50)
//     // diamondImg.filters.push(bw)
//     // diamondImg.set
//     // diamondImg.height = 1000

//     console.log('🟢', diamondImg)

//     flow.nodes.PreviewImage({
//         images: await flow.load_ImageAtURL(diamondURL),
//     })

//     // debugger
//     // Create an array to store all the diamond instances
//     const diamonds = []

//     // Create positions for the diamonds (4 positions for 8 diamonds, mirrored vertically)
//     // prettier-ignore
//     const positions: { left: number; top: number, flipY?:boolean }[] = [
//         // top
//         { left: 50,  top: 60 },
//         { left: 200, top: 60 },
//         { left: 50,  top: 180 },
//         { left: 200, top: 180 },
//         // bototm
//         { left: 50,  top: 450 - 60,  flipY: true },
//         { left: 200, top: 450 - 60,  flipY: true },
//         { left: 50,  top: 450 - 180, flipY: true },
//         { left: 200, top: 450 - 180, flipY: true },

//     ]

//     for (const pos of positions) {
//         const diamond2 = await diamondImg.clone()
//         diamond2.set(pos)
//         diamond2.scaleToWidth(70)
//         diamond2.setX(diamond2.getX() - 10)
//         diamond2.setY(diamond2.getY() - 10)
//         diamond2.opacity = 0.5
//         diamonds.push(diamond2)

//         // Create two diamonds for each position (one normal and one flipped vertically)
//         const diamond1 = await diamondImg.clone()
//         diamond1.filters.push(filter2)
//         diamond1.applyFilters()
//         // const filter2 = new fabric.filters.BaseFilter({
//         //     applyTo: function (canvasEl) {
//         //         const ctx = canvasEl.getContext('2d')
//         //         const imageData = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height)
//         //         const data = imageData.data
//         //         for (let i = 0; i < data.length; i += 4) {
//         //             let alpha = data[i + 3]
//         //             data[i] = alpha // Red
//         //             data[i + 1] = alpha // Green
//         //             data[i + 2] = alpha // Blue
//         //         }
//         //         ctx.putImageData(imageData, 0, 0)
//         //     },
//         // })
//         // filter.useAlpha = true

//         diamonds.push(diamond1)
//     }

//     // Add the diamond instances to the canvas
//     diamonds.forEach((diamond) => canvas.add(diamond))

//     // Add the number and suit to the corners
//     const textOptions = { fontFamily: 'Times New Roman', fontSize: 36, fontWeight: 'bold' }

//     const number = new fabric.FabricText('8', { ...textOptions, left: 20, top: 10 })
//     const numberBottom = new fabric.FabricText('8', { ...textOptions, left: 20, top: 400 })
//     numberBottom.flipY = true
//     canvas.add(number, numberBottom)

//     const diamondTop = await diamondImg.clone()
//     diamondTop.scaleToWidth(30)
//     diamondTop.set({ left: 20, top: 60 })

//     const diamondBottom = await diamondImg.clone()
//     diamondBottom.scaleToWidth(30)
//     diamondBottom.set({ left: 20, top: 360 })
//     diamondBottom.set('flipY', true)

//     canvas.add(diamondTop, diamondBottom)

//     // Export to blob
//     canvas.renderAll()
//     canvas.getElement()
//     const blob = await new Promise<Blob | null>((resolve) => canvas.getElement().toBlob(resolve))
//     if (!blob) throw new Error('blob is null')
//     return flow.load_Blob(blob)
// }
