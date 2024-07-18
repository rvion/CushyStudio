app({
    metadata: {
        name: 'add gradient background',
        description: 'add a gradient background to the input image',
    },
    ui: (form) => ({
        from: form.image({ justifyLabel: false }),
    }),
    canStartFromImage: true,
    run: async (run, ui, { image }) => {
        const size = 1024
        const startImage = image ?? ui.from
        const { Konva, Colors, Images, ComfyUI } = run
        const layer = Konva.createStageWithLayer({ width: size, height: size })
        Konva.addGradientToLayer(layer, [0, Colors.randomHexColor(), 1, Colors.randomHexColor()])
        const logo = Konva.Image({ image: await startImage.asHTMLImageElement_wait() })
        logo.setSize({ width: size, height: size })
        layer.add(logo)
        const b64 = Konva.convertLayerToDataURL(layer)
        const img = Images.createFromDataURL(b64)
    },
})
