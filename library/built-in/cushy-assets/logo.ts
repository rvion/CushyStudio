app({
    metadata: {
        name: 'Logo generator',
        description: 'generate a social site card for your project',
    },

    ui: (form) => ({
        title: form.string({ placeHolder: 'My Project' }),
    }),

    run: async (run, ui) => {
        const layer = run.Konva.createStageWithLayer({ width: 512, height: 512 })
        run.Konva.fillFullLayerWithGradient(layer, [0, run.Colors.randomHexColor(), 1, run.Colors.randomHexColor()])
        const logo = await run.Konva.createHTMLImage_fromPath('site/static/img/CushyLogo.png')
        layer.add(run.Konva.Image({ image: logo }))
        layer.draw()
        const b64 = layer.toDataURL()

        const img = run.Images.createFromBase64(b64)
    },
})
