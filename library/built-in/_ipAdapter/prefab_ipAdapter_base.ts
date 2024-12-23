import type { Cnet_args } from '../_controlNet/prefab_cnet'
import type { OutputFor } from '../_prefabs/_prefabs'

import { ipAdapterDoc } from './_ipAdapterDoc'
import { ipAdapterModelList } from './_ipAdapterModelList'
import {
   ui_ipadapter_CLIPSelection,
   ui_subform_IPAdapter_common,
   type UI_subform_IPAdapter_common,
} from './_ipAdapterUtils'
import { ui_ipadapter_modelSelection } from './ui_ipadapter_modelSelection'

// 🅿️ IPAdapter Basic ===================================================

export type UI_subform_IPAdapter = X.XGroup<
   {
      models: X.XGroup<{
         cnet_model_name: X.XEnum<'IPAdapter_plus.IPAdapterModelLoader.ipadapter_file'>
         clip_name: X.XEnum<'CLIPVisionLoader.clip_name'>
      }>
      help: X.XMarkdown
   } & UI_subform_IPAdapter_common
>

export function ui_subform_IPAdapter(): UI_subform_IPAdapter {
   const form = getCurrentForm()
   return form
      .group({
         label: 'IPAdapter',
         items: {
            help: form.markdown({ startCollapsed: true, markdown: ipAdapterDoc }),
            ...ui_subform_IPAdapter_common(form),
            models: form.group({
               label: 'Select or Download Models',
               items: {
                  ...ui_ipadapter_CLIPSelection(form),
                  ...ui_ipadapter_modelSelection(
                     form,
                     'ip-adapter-faceid-plus_sd15.bin' as any,
                     ipAdapterModelList,
                  ),
               },
            }),
         },
      })
      .addRequirements([{ type: 'customNodesByTitle', title: 'ComfyUI_IPAdapter_plus' }])
}

// 🅿️ IPAdapter RUN ===================================================
export function run_cnet_IPAdapter(
   IPAdapter: OutputFor<typeof ui_subform_IPAdapter>,
   cnet_args: Cnet_args,
   image: Comfy.Signal['IMAGE'],
): { ip_adapted_model: Comfy.Signal['MODEL'] } {
   const run = getCurrentRun()
   const graph = run.nodes
   const ip = IPAdapter
   //crop the image to the right size
   //todo: make these editable
   image = graph['IPAdapter_plus.PrepImageForClipVision']({
      image,
      interpolation: 'LANCZOS',
      crop_position: 'center',
      sharpening: 0,
   })._IMAGE
   const ip_model = graph['IPAdapter_plus.IPAdapterModelLoader']({
      ipadapter_file: ip.models.cnet_model_name,
   })
   const ip_clip_name = graph.CLIPVisionLoader({ clip_name: ip.models.clip_name })
   const image_ = graph['IPAdapter_plus.IPAdapterEncoder']({
      ipadapter: ip_model,
      image,
      clip_vision: ip_clip_name,
   }).outputs
   const pos_embed: Comfy.Signal['EMBEDS'] = image_.pos_embed
   const neg_embed: Comfy.Signal['EMBEDS'] = image_.neg_embed

   const ip_adapted_model = graph['IPAdapter_plus.IPAdapterEmbeds']({
      ipadapter: ip_model,
      clip_vision: ip_clip_name,
      pos_embed,
      neg_embed,
      // image: image,
      model: cnet_args.ckptPos,
      weight_type: ip.settings.weight_type,
      // weight_type: 'original',
      weight: ip.strength,
      // noise: ip.settings.noise,
      start_at: ip.settings.startAtStepPercent,
      end_at: ip.settings.endAtStepPercent,
      embeds_scaling: 'V only',
      // unfold_batch: ip.settings.unfold_batch,
   })._MODEL

   return { ip_adapted_model }
}
