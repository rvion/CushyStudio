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
            RemBG:           form.group(),
            ABG:             form.group(),
            isnetAnime:      form.group(),
            isnetGeneralUse: form.group(),
            silueta:         form.group(),
            u2net:           form.group(),
            u2net_human_seg: form.group(),
            u2netp:          form.group(),
            RemBGV1_4:       form.group(),
        },
    })
}

export const run_rembg_v1 = (ui: OutputFor<typeof ui_rembg_v1>, image: _IMAGE): _IMAGE[] => {
    const graph = getCurrentRun().nodes
    const OUT: _IMAGE[] = []
    const addImg = (tag: string, img: _IMAGE) => {
        graph.PreviewImage({ images: img }).tag(tag)
        OUT.push(img)
    }
    console.log(`[👙] `, ui)
    if (ui.RemBG)            addImg('RemBG',           graph.Image_Remove_Background_$1rembg$2({ image })) // prettier-ignore
    if (ui.ABG)              addImg('ABG',             graph.Remove_Image_Background_$1abg$2  ({ image }) ) // prettier-ignore
    if (ui.isnetAnime)       addImg('isnetAnime',      graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'isnet-anime',       background_color: 'none', }), ) // prettier-ignore
    if (ui.isnetGeneralUse)  addImg('isnetGeneralUse', graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'isnet-general-use', background_color: 'none', }), ) // prettier-ignore
    if (ui.silueta)          addImg('silueta',         graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'silueta',           background_color: 'none', }), ) // prettier-ignore
    if (ui.u2net)            addImg('u2net',           graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'u2net',             background_color: 'none', }), ) // prettier-ignore
    if (ui.u2net_human_seg)  addImg('u2net_human_seg', graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'u2net_human_seg',   background_color: 'none', }), ) // prettier-ignore
    if (ui.u2netp)           addImg('u2netp',          graph.Image_Rembg_$1Remove_Background$2({ images: image, model: 'u2netp',            background_color: 'none', }), ) // prettier-ignore
    if (ui.RemBGV1_4)        addImg('briarmbg',        graph.BRIA$_RMBG$_Zho({ image, rmbgmodel: graph.BRIA$_RMBG$_ModelLoader$_Zho({}) })) // prettier-ignore
    return OUT
}
