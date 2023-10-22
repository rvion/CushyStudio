action({
    name: 'background-removal-playground',
    author: 'rvion',
    help: 'quick remove bg with one or many nodes',
    // prettier-ignore
    ui: (form) => ({
        // startImage
        startImage: form.imageOpt({ label: 'Start image' }),
        //
        with_RemBG:           form.groupOpt({ labelPos: 'end', label: 'RemBG', items: () => ({}) }),
        with_ABG:             form.groupOpt({ labelPos: 'end', label: 'ABG',   items: () => ({}) }),
        with_isnetAnime:      form.bool    ({ labelPos: 'end', label: 'isnet-anime' }),
        with_isnetGeneralUse: form.bool    ({ labelPos: 'end', label: 'isnet-general-use' }),
        with_silueta:         form.bool    ({ labelPos: 'end', label: 'silueta' }),
        with_u2net:           form.bool    ({ labelPos: 'end', label: 'u2net' }),
        with_u2net_human_seg: form.bool    ({ labelPos: 'end', label: 'u2net_human_seg' }),
        with_u2netp:          form.bool    ({ labelPos: 'end', label: 'u2netp' }),
    }),

    run: async (flow, form) => {
        const graph = flow.nodes
        if (form.startImage == null) throw new Error('no image provided')
        const image = await flow.loadImageAnswer(form.startImage)

        if (form.with_RemBG)            graph.PreviewImage({ images: graph.Image_Remove_Background_$1rembg$2({ image }) }) // prettier-ignore
        if (form.with_ABG)              graph.PreviewImage({ images: graph.Remove_Image_Background_$1abg$2  ({ image }) }) // prettier-ignore
        if (form.with_isnetAnime)       graph.PreviewImage({ images: graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'isnet-anime',       background_color: 'magenta', }), }) // prettier-ignore
        if (form.with_isnetGeneralUse)  graph.PreviewImage({ images: graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'isnet-general-use', background_color: 'magenta', }), }) // prettier-ignore
        if (form.with_silueta)          graph.PreviewImage({ images: graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'silueta',           background_color: 'magenta', }), }) // prettier-ignore
        if (form.with_u2net)            graph.PreviewImage({ images: graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'u2net',             background_color: 'magenta', }), }) // prettier-ignore
        if (form.with_u2net_human_seg)  graph.PreviewImage({ images: graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'u2net_human_seg',   background_color: 'magenta', }), }) // prettier-ignore
        if (form.with_u2netp)           graph.PreviewImage({ images: graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'u2netp',            background_color: 'magenta', }), }) // prettier-ignore

        await flow.PROMPT()
    },
})
