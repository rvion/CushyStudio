app({
    metadata: {
        name: 'add gradient background',
        description: 'add a gradient background to the input image',
    },
    ui: (form) => ({
        // title: form.string({ placeHolder: 'My Project' }),
        // prompt: form.string({ textarea: true }),
        from: form.image({}),
    }),
    canStartFromImage: true,
    run: async (run, ui, ctximg) => {
        const size = 1024
        const startImage = ctximg ?? ui.from
        const { Konva, Colors, Images, ComfyUI } = run
        const layer = Konva.createStageWithLayer({ width: size, height: size })
        Konva.addGradientToLayer(layer, [0, Colors.randomHexColor(), 1, Colors.randomHexColor()])
        const logo = Konva.Image({ image: await startImage.asHTMLImageElement_wait() })
        logo.setSize({ width: size, height: size })
        layer.add(logo)
        const b64 = Konva.convertLayerToDataURL(layer)
        const img = Images.createFromDataURL(b64)
        // const flow = ComfyUI.create_basicWorkflow({
        //     from: img,
        //     denoise: 0.9,
        //     positivePrompt: ui.prompt,
        //     chekpointName: 'revAnimated_v122.safetensors',
        // })
        // await flow.sendPromptAndWaitUntilDone()
    },
})
