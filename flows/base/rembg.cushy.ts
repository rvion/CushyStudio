action('remmg', {
    priority: 1,
    help: 'quick remove bg with one or many nodes',
    ui: (form) => ({
        // startImage
        startImage: form.selectImage('Start image'),
        withRemBG: form.groupOpt({ items: {} }),
        withABG: form.groupOpt({ items: {} }),
        withWAS: form.groupOpt({
            items: {
                model: form.enum({
                    enumName: 'Enum_WASImageRembgRemoveBackground_Model',
                    default: 'u2net',
                }),
            },
        }),
    }),

    run: async (flow, p) => {
        const graph = flow.nodes
        const image = await flow.loadImageAnswer(p.startImage)
        // 4. options
        if (p.withRemBG) graph.PreviewImage({ images: graph.ImageRemoveBackgroundRembg({ image }) })
        if (p.withABG) graph.PreviewImage({ images: graph.RemoveImageBackgroundAbg({ image }) })
        if (p.withWAS) {
            graph.PreviewImage({
                images: graph.WASImageRembgRemoveBackground({
                    //
                    images: image,
                    model: p.withWAS.model,
                    background_color: 'magenta',
                }),
            })
        }

        await flow.PROMPT()
    },
})
