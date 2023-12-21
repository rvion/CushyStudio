app({
    metadata: {
        name: 'Logo generator',
        description: 'generate a social site card for your project',
    },

    ui: (form) => ({
        title: form.string({ placeHolder: 'My Project' }),
    }),

    run: async (run, ui) => {
        //
        const size = 512
        const layer = run.Canvas.createStageWithLayer({ width: size, height: size })
        run.Canvas.fillFullLayerWithGradient(layer, [0, 'red', 1, 'blue'])

        const oldLogo = await run.Canvas.createHTMLImage_fromPath('site/static/img/CushyLogo.png')
        layer.add(new run.Canvas.Konva.Image({ image: oldLogo }))
        layer.draw()

        const b64 = layer.toDataURL()
        const img = run.Images.createFromBase64(b64)
        // run

        // const img = await run.load_dataURL(b64)
    },
})
