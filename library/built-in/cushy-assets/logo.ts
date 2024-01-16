app({
    metadata: {
        name: 'Logo generator',
        description: 'generate a social site card for your project',
    },

    ui: (form) => ({
        title: form.string({ placeHolder: 'My Project' }),
        prompt: form.string({ textarea: true }),
        from: form.imageOpt({}),
    }),

    run: async (run, ui) => {
        const size = 1024
        const { Konva, Colors, Images, ComfyUI } = run
        const layer = Konva.createStageWithLayer({ width: size, height: size })
        Konva.addGradientToLayer(layer, [0, Colors.randomHexColor(), 1, Colors.randomHexColor()])
        const logo = await Konva.Image_fromPath('site/static/img/CushyLogo.png')
        logo.setSize({ width: size, height: size })
        layer.add(logo)
        const b64 = Konva.convertLayerToDataURL(layer)
        const img = Images.createFromDataURL(b64)
        const flow = ComfyUI.create_basicWorkflow({
            from: img,
            denoise: 0.9,
            positivePrompt: ui.prompt,
            chekpointName: 'revAnimated_v122.safetensors',
        })
        await flow.sendPromptAndWaitUntilDone()
    },
})
