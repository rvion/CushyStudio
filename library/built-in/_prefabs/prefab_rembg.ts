import type { OutputFor } from './_prefabs'

export const ui_rembg_v1 = () => {
    const form = getCurrentForm()
    return form.choices({
        appearance: 'tab',
        items: {
            RemBG: () => form.groupOpt({ label: 'RemBG', items: () => ({}) }),
            ABG: () => form.groupOpt({ label: 'ABG', items: () => ({}) }),
            isnetAnime: () => form.bool({ label: 'isnet-anime', default: true }),
            isnetGeneralUse: () => form.bool({ label: 'isnet-general-use', default: true }),
            silueta: () => form.bool({ label: 'silueta', default: true }),
            u2net: () => form.bool({ label: 'u2net', default: true }),
            u2net_human_seg: () => form.bool({ label: 'u2net_human_seg' }),
            u2netp: () => form.bool({ label: 'u2netp' }),
        },
    })
}

export const run_rembg_v1 = (ui: OutputFor<typeof ui_rembg_v1>, image: _IMAGE) => {
    const graph = getCurrentRun().nodes
    console.log(`[👙] `, ui)
    if (ui.RemBG)            graph.PreviewImage({ images: graph.Image_Remove_Background_$1rembg$2({ image }) }) // prettier-ignore
    if (ui.ABG)              graph.PreviewImage({ images: graph.Remove_Image_Background_$1abg$2  ({ image }) }) // prettier-ignore
    if (ui.isnetAnime)       graph.PreviewImage({ images: graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'isnet-anime',       background_color: 'none', }), }) // prettier-ignore
    if (ui.isnetGeneralUse)  graph.PreviewImage({ images: graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'isnet-general-use', background_color: 'none', }), }) // prettier-ignore
    if (ui.silueta)          graph.PreviewImage({ images: graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'silueta',           background_color: 'none', }), }) // prettier-ignore
    if (ui.u2net)            graph.PreviewImage({ images: graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'u2net',             background_color: 'none', }), }) // prettier-ignore
    if (ui.u2net_human_seg)  graph.PreviewImage({ images: graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'u2net_human_seg',   background_color: 'none', }), }) // prettier-ignore
    if (ui.u2netp)           graph.PreviewImage({ images: graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'u2netp',            background_color: 'none', }), }) // prettier-ignore
}
