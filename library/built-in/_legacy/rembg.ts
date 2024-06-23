import { ui_rembg_v1 } from '../_prefabs/prefab_rembg'

app({
    metadata: {
        author: 'rvion',
        name: 'Remove Background',
        description: 'remove background from an image',
    },
    canStartFromImage: true,
    ui: (form) => ({
        startImage: form.image({ label: 'Start image' }),
        models: ui_rembg_v1(),
    }),

    run: async (run, form, { image: img }) => {
        const graph = run.nodes

        const image = await (() => {
            // case where we start from an image
            if (img) return img.loadInWorkflow()

            // case where we start from the form
            if (form.startImage == null) throw new Error('no image provided')
            return run.loadImageAnswer(form.startImage)
        })()

        if (form.models.RemBG)            graph.PreviewImage({ images: graph.Image_Remove_Background_$1rembg$2({ image }) }) // prettier-ignore
        // if (form.models.ABG)              graph.PreviewImage({ images: graph.Remove_Image_Background_$1abg$2  ({ image }) }) // prettier-ignore
        if (form.models.isnetAnime)       graph.PreviewImage({ images: graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'isnet-anime',       background_color: 'none', }), }) // prettier-ignore
        if (form.models.isnetGeneralUse)  graph.PreviewImage({ images: graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'isnet-general-use', background_color: 'none', }), }) // prettier-ignore
        if (form.models.silueta)          graph.PreviewImage({ images: graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'silueta',           background_color: 'none', }), }) // prettier-ignore
        if (form.models.u2net)            graph.PreviewImage({ images: graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'u2net',             background_color: 'none', }), }) // prettier-ignore
        if (form.models.u2net_human_seg)  graph.PreviewImage({ images: graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'u2net_human_seg',   background_color: 'none', }), }) // prettier-ignore
        if (form.models.u2netp)           graph.PreviewImage({ images: graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'u2netp',            background_color: 'none', }), }) // prettier-ignore

        await run.PROMPT()
    },
})
