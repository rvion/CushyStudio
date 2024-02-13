import type { OutputFor } from './_prefabs'

export const ui_rembg_v1 = () => {
    const form = getCurrentForm()
    return form.choices({
        requirements: [
            { type: 'customNodesByTitle', title: 'TEMP_ComfyUI-BRIA_AI-RMBG' },
            { type: 'modelInManager', modelName: 'TEMP_briaai_RMBG-1.4' },
        ],
        // appearance: 'tab',
        // prettier-ignore
        items: {
            RemBG:           () => form.group({}),
            ABG:             () => form.group({}),
            isnetAnime:      () => form.group({}),
            isnetGeneralUse: () => form.group({}),
            silueta:         () => form.group({}),
            u2net:           () => form.group({}),
            u2net_human_seg: () => form.group({}),
            u2netp:          () => form.group({}),
            RemBGV1_4:       () => form.group({}),
        },
    })
}

export const run_rembg_v1 = (ui: OutputFor<typeof ui_rembg_v1>, image: _IMAGE) => {
    const graph = getCurrentRun().nodes
    console.log(`[👙] `, ui)
    if (ui.RemBG)            graph.PreviewImage({ images: graph.Image_Remove_Background_$1rembg$2({ image }) }).tag('RemBG') // prettier-ignore
    if (ui.ABG)              graph.PreviewImage({ images: graph.Remove_Image_Background_$1abg$2  ({ image }) }).tag('ABG') // prettier-ignore

    if (ui.isnetAnime)       graph.PreviewImage({ images: graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'isnet-anime',       background_color: 'none', }), }).tag('isnetAnime') // prettier-ignore
    if (ui.isnetGeneralUse)  graph.PreviewImage({ images: graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'isnet-general-use', background_color: 'none', }), }).tag('isnetGeneralUse') // prettier-ignore
    if (ui.silueta)          graph.PreviewImage({ images: graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'silueta',           background_color: 'none', }), }).tag('silueta') // prettier-ignore
    if (ui.u2net)            graph.PreviewImage({ images: graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'u2net',             background_color: 'none', }), }).tag('u2net') // prettier-ignore
    if (ui.u2net_human_seg)  graph.PreviewImage({ images: graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'u2net_human_seg',   background_color: 'none', }), }).tag('u2net_human_seg') // prettier-ignore
    if (ui.u2netp)           graph.PreviewImage({ images: graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'u2netp',            background_color: 'none', }), }).tag('u2netp') // prettier-ignore
    if (ui.RemBGV1_4)
        graph
            .PreviewImage({ images: graph.BRIA$_RMBG$_Zho({ image, rmbgmodel: graph.BRIA$_RMBG$_ModelLoader$_Zho({}) }) })
            .tag('briarmbg')
}
