app({
    ui: (form) => ({}),
    run: async (run, form) => {
        //
        const layer = run.Konva.createStageWithLayer({ width: 512, height: 512 })
        run.Konva.addGradientToLayer(layer, [0, 'red', Math.random(), 'pink', 1, 'yellow'])

        const b64 = run.Konva.convertLayerToBase64(layer)
        const loadImageNode = await run.load_dataURL(b64)

        run.nodes.PreviewImage({ images: loadImageNode })
        run.PROMPT()
    },
})
