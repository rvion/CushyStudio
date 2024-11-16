import type { OutputFor } from './_prefabs'

export type UI_rembg_v1 = X.XChoices<{
   // RemBG: X.XEmpty
   isnetAnime: X.XEmpty
   isnetGeneralUse: X.XEmpty
   silueta: X.XEmpty
   u2net: X.XEmpty
   u2net_human_seg: X.XEmpty
   u2netp: X.XEmpty
   RemBGV1_4: X.XEmpty
}>

export function ui_rembg_v1(): UI_rembg_v1 {
   const form = getCurrentForm()
   return form
      .choices(
         {
            // RemBG: form.empty(),
            // ABG:             form.ok(),
            isnetAnime: form.empty(),
            isnetGeneralUse: form.empty(),
            silueta: form.empty(),
            u2net: form.empty(),
            u2net_human_seg: form.empty(),
            u2netp: form.empty(),
            RemBGV1_4: form.empty(),
         },
         { expand: true, icon: 'mdiTargetAccount' },
      )
      .addRequirements([
         { type: 'customNodesByTitle', title: 'TEMP_ComfyUI-BRIA_AI-RMBG' },
         { type: 'modelInManager', modelName: 'TEMP_briaai_RMBG-1.4' },
      ])
}

export const run_rembg_v1 = (
   ui: OutputFor<typeof ui_rembg_v1>,
   image: Comfy.Signal['IMAGE'],
): Comfy.Signal['IMAGE'][] => {
   const graph = getCurrentRun().nodes
   const OUT: Comfy.Signal['IMAGE'][] = []
   const addImg = (tag: string, img: Comfy.Signal['IMAGE']): void => {
      graph.PreviewImage({ images: img }).tag(tag)
      OUT.push(img)
   }
   if (ui.isnetAnime)       addImg('isnetAnime',      graph['was.Image Rembg (Remove Background)']({ images: image, model: 'isnet-anime',       background_color: 'none', }), ) // prettier-ignore
   if (ui.isnetGeneralUse)  addImg('isnetGeneralUse', graph['was.Image Rembg (Remove Background)']({ images: image, model: 'isnet-general-use', background_color: 'none', }), ) // prettier-ignore
   if (ui.silueta)          addImg('silueta',         graph['was.Image Rembg (Remove Background)']({ images: image, model: 'silueta',           background_color: 'none', }), ) // prettier-ignore
   if (ui.u2net)            addImg('u2net',           graph['was.Image Rembg (Remove Background)']({ images: image, model: 'u2net',             background_color: 'none', }), ) // prettier-ignore
   if (ui.u2net_human_seg)  addImg('u2net_human_seg', graph['was.Image Rembg (Remove Background)']({ images: image, model: 'u2net_human_seg',   background_color: 'none', }), ) // prettier-ignore
   if (ui.u2netp)           addImg('u2netp',          graph['was.Image Rembg (Remove Background)']({ images: image, model: 'u2netp',            background_color: 'none', }), ) // prettier-ignore
   if (ui.RemBGV1_4)        addImg('briarmbg',        graph['BRIA_AI-RMBG.BRIA_RMBG_Zho']({ image, rmbgmodel: graph['BRIA_AI-RMBG.BRIA_RMBG_ModelLoader_Zho']({}) })) // prettier-ignore
   return OUT
}
