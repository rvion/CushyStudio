app({
    metadata: {
        name: 'add gradient background',
        description: 'add a gradient background to the input image',
    },
    ui: (b) =>
        b.fields({
            from: b.image({ justifyLabel: false }),
            tags: b.string({
                label: 'Tags',
                placeHolder: 'e.g. "gradient, background"',
                default: 'gradient, background',
            }),
        }),
    canStartFromImage: true,
    run: async (run, ui, { image, mask, canvas }) => {
        const size = 1024
        const startImage = image ?? ui.from
        const { Konva, Colors, Images, ComfyUI } = run
        const layer = Konva.createStageWithLayer({ width: size, height: size })
        Konva.addGradientToLayer(layer, [0, Colors.randomHexColor(), 1, Colors.randomHexColor()])
        const logo = Konva.Image({ image: await startImage.asHTMLImageElement_wait() })
        logo.setSize({ width: size, height: size })
        layer.add(logo)
        const b64 = Konva.convertLayerToDataURL(layer)
        Images.createFromDataURL(b64).toggleTag(...ui.tags.split(','))
    },
})
