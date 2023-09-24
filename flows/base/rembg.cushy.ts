action('remmg', {
    priority: 1,
    help: 'load model with optional clip-skip, loras, tome ratio, etc.',
    ui: (form) => ({
        // startImage
        startImage: form.selectImage('Start image'),
        withRemBG: form.groupOpt({
            items: {},
        }),
        withABG: form.groupOpt({
            items: {},
        }),
        withWAS: form.groupOpt({
            items: {},
        }),
        withWASAlpha: form.groupOpt({
            items: {},
        }),
    }),

    run: async (flow, p) => {
        const graph = flow.nodes
        const image = flow.loadImageAnswer(p.startImage)
        flow.print(JSON.stringify(p))
        flow.print(image.constructor.name)
        flow.print(JSON.stringify(p))
        // 4. options
        if (p.withRemBG) {
            graph.PreviewImage({
                images: graph.ImageRemoveBackgroundRembg({ image }),
            })
        }
        if (p.withABG) {
            graph.PreviewImage({
                images: graph.RemoveImageBackgroundAbg({ image }),
            })
        }
        if (p.withWAS) {
            graph.PreviewImage({
                images: graph.WASImageRembgRemoveBackground({
                    //
                    images: image,
                    model: 'u2net',
                    background_color: 'magenta',
                }),
            })
        }

        // PROMPT
        await flow.PROMPT()
    },
})
