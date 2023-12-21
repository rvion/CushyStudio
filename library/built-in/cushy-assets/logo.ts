app({
    metadata: {
        name: 'Logo generator',
        description: 'generate a social site card for your project',
    },

    ui: (form) => ({
        title: form.string({ placeHolder: 'My Project' }),
    }),

    run: async ({ Konva, Colors, Images }, ui) => {
        const layer = Konva.createStageWithLayer({ width: 512, height: 512 })
        Konva.fillFullLayerWithGradient(layer, [0, Colors.randomHexColor(), 1, Colors.randomHexColor()])
        const logo = await Konva.Image_fromPath('site/static/img/CushyLogo.png')
        logo.setSize({ width: 512, height: 512 })
        layer.add(logo)
        const b64 = Konva.convertLayerToBase64(layer)
        const img = Images.createFromBase64(b64)
    },
})
