import type { OutputFor } from '../_prefabs/_prefabs'

import { ipAdapterDoc } from './_ipAdapterDoc'
import { ipAdapterModelList } from './_ipAdapterModelList'
import { ui_ipadapter_CLIPSelection, ui_subform_IPAdapter_common } from './_ipAdapterUtils'
import { ui_ipadapter_modelSelection } from './ui_ipadapter_modelSelection'

// 🅿️ IPAdapter Basic ===================================================

export type UI_ipadapter_standalone = X.XGroup<{
   strength: X.XNumber
   settings: X.XGroup<{
      extra: X.XList<X.XImage>
      crop: X.XBool
      startAtStepPercent: X.XNumber
      endAtStepPercent: X.XNumber
      weight_type: X.XEnum<'IPAdapter_plus.IPAdapterAdvanced.weight_type'>
      embedding_scaling: X.XEnum<'IPAdapter_plus.IPAdapterAdvanced.embeds_scaling'>
      noise: X.XNumber
      unfold_batch: X.XBool
   }>
   cnet_model_name: X.XEnum<Enum_AV_IPAdapterPipe_ip_adapter_name>
   clip_name: X.XEnum<'CLIPVisionLoader.clip_name'>
   help: X.XMarkdown
   image: X.XImage
   extra: CushySchema<Field_list<X.XImage>>
   embedding_scaling: X.XEnum<'IPAdapter_plus.IPAdapterAdvanced.embeds_scaling'>
}>

export const ui_ipadapter_standalone = () => {
   const form = getCurrentForm()
   return form
      .group({
         label: 'IPAdapter',
         items: {
            help: form.markdown({ startCollapsed: true, markdown: ipAdapterDoc }),
            image: form.image({ label: 'Image' }),
            extra: form.list({ label: 'Extra', element: form.image({ label: 'Image' }) }),
            embedding_scaling: form.enum['IPAdapter_plus.IPAdapterAdvanced.embeds_scaling']({
               default: 'V only',
            }),
            ...ui_ipadapter_CLIPSelection(form),
            ...ui_ipadapter_modelSelection(form, 'ip-adapter-plus_sd15.safetensors', ipAdapterModelList),
            ...ui_subform_IPAdapter_common(form),
         },
      })
      .addRequirements([
         //
         { type: 'customNodesByTitle', title: 'ComfyUI_IPAdapter_plus' },
         { type: 'modelInManager', modelName: 'ip-adapter_sdxl_vit-h.safetensors' },
         { type: 'modelInManager', modelName: 'ip-adapter-plus_sdxl_vit-h.safetensors' },
         { type: 'modelInManager', modelName: 'ViT-H SAM model' },
      ])
}

// 🅿️ IPAdapter RUN ===================================================
export const run_ipadapter_standalone = async (
   ui: OutputFor<typeof ui_ipadapter_standalone>,
   ckpt: Comfy.Signal['MODEL'],
): Promise<{ ip_adapted_model: Comfy.Signal['MODEL'] }> => {
   const run = getCurrentRun()
   const graph = run.nodes

   const ip_model = graph['IPAdapter_plus.IPAdapterModelLoader']({
      ipadapter_file: ui.cnet_model_name,
   })

   const image: Comfy.Signal['IMAGE'] = await run.loadImageAnswer(ui.image)
   const image_ = graph['IPAdapter_plus.IPAdapterEncoder']({
      ipadapter: ip_model,
      image,
   }).outputs
   let pos_embed: Comfy.Signal['EMBEDS'] = image_.pos_embed
   let neg_embed: Comfy.Signal['EMBEDS'] = image_.neg_embed

   const ip_clip_name = graph.CLIPVisionLoader({ clip_name: ui.clip_name })
   for (const ex of ui.extra) {
      const extraImage = graph['IPAdapter_plus.IPAdapterEncoder']({
         image: await run.loadImageAnswer(ex),
         ipadapter: ip_model,
         clip_vision: ip_clip_name,
      })
      // merge pos
      const combinedPos = graph['IPAdapter_plus.IPAdapterCombineEmbeds']({
         embed1: pos_embed,
         embed2: extraImage.outputs.pos_embed,
         method: 'average',
      })
      pos_embed = combinedPos.outputs.EMBEDS
      // merge neg
      const combinedNeg = graph['IPAdapter_plus.IPAdapterCombineEmbeds']({
         embed1: pos_embed,
         embed2: extraImage.outputs.neg_embed,
         method: 'average',
      })
      neg_embed = combinedNeg.outputs.EMBEDS
   }
   const ip_adapted_model = graph.IPAdapterEmbeds({
      ipadapter: ip_model,
      clip_vision: ip_clip_name,
      pos_embed,
      neg_embed,
      // image: image,
      model: ckpt,
      weight_type: ui.settings.weight_type,
      // weight_type: 'original',
      weight: ui.strength,
      // noise: ui.settings.noise,
      start_at: ui.settings.startAtStepPercent,
      end_at: ui.settings.endAtStepPercent,
      // unfold_batch: ui.settings.unfold_batch,
      embeds_scaling: ui.embedding_scaling,
   })._MODEL

   return { ip_adapted_model }
}
