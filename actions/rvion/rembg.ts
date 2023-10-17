action('remmg', {
    author: 'rvion',
    priority: 1,
    help: 'quick remove bg with one or many nodes',
    ui: (form) => ({
        // startImage
        startImage: form.imageOpt({ label: 'Start image' }),
        withRemBG: form.groupOpt({ items: () => ({}) }),
        withABG: form.groupOpt({ items: () => ({}) }),
        withWAS: form.groupOpt({
            items: () => ({
                model: form.enum({
                    enumName: 'Enum_Image_Rembg_$1Remove_Background$2_model',
                    default: 'u2net',
                }),
            }),
        }),
    }),

    run: async (flow, p) => {
        const graph = flow.nodes
        if (p.startImage == null) throw new Error('no image provided')
        const image = await flow.loadImageAnswer(p.startImage)
        // 4. options
        if (p.withRemBG) graph.PreviewImage({ images: graph.Image_Remove_Background_$1rembg$2({ image }) })
        if (p.withABG) graph.PreviewImage({ images: graph.Remove_Image_Background_$1abg$2({ image }) })
        if (p.withWAS) {
            graph.PreviewImage({
                images: graph.Image_Rembg_$1Remove_Background$2({
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
