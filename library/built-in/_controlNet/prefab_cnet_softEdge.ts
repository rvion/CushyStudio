import type { OutputFor } from '../_prefabs/_prefabs'

import { cnet_preprocessor_ui_common, cnet_ui_common } from './cnet_ui_common'

// 🅿️ SoftEdge FORM ===================================================
export type UI_subform_SoftEdge = X.XGroup<{
   preprocessor: UI_subform_SoftEdge_Preprocessor
   cnet_model_name: X.XEnum<Comfy.Enums['ControlNetLoader.control_net_name']>
   strength: X.XNumber
   advanced: X.XGroup<{
      startAtStepPercent: X.XNumber
      endAtStepPercent: X.XNumber
      crop: X.XEnum<Comfy.Enums['LatentUpscale.crop']>
      upscale_method: X.XEnum<Comfy.Enums['ImageScale.upscale_method']>
   }>
}>
export function ui_subform_SoftEdge(): UI_subform_SoftEdge {
   const form: X.Builder = getCurrentForm()
   return form
      .group({
         label: 'SoftEdge',
         items: {
            ...cnet_ui_common(form),
            preprocessor: ui_subform_SoftEdge_Preprocessor(),
            cnet_model_name: form.enum['ControlNetLoader.input.control_net_name']({
               label: 'Model',
               default: 'control_v11p_sd15_softedge.pth' as any,
               extraDefaults: ['control_v11p_sd15_softedge.pth'],
            }),
         },
      })
      .addRequirements([
         { type: 'modelInManager', modelName: 'ControlNet-v1-1 (softedge; fp16)' },
         { type: 'modelInManager', modelName: 'controlnet-SargeZT/controlnet-sd-xl-1.0-softedge-dexined' },
      ])
}

// ====================================================================================
export type UI_subform_SoftEdge_Preprocessor = X.XChoice<{
   None: X.XEmpty
   HED: UI_subform_SoftEdge_Preprocessor_Options
   Pidinet: UI_subform_SoftEdge_Preprocessor_Options
}>
export function ui_subform_SoftEdge_Preprocessor(): UI_subform_SoftEdge_Preprocessor {
   const form: X.Builder = getCurrentForm()
   return form.choice(
      {
         None: form.empty(),
         HED: ui_subform_SoftEdge_Preprocessor_Options(form),
         Pidinet: ui_subform_SoftEdge_Preprocessor_Options(form),
      },
      {
         label: 'SoftEdge Edge Preprocessor',
         startCollapsed: true,
         default: 'HED',
         appearance: 'tab',
      },
   )
}

// ====================================================================================
export type UI_subform_SoftEdge_Preprocessor_Options = X.XGroup<{
   safe: X.XBool
   saveProcessedImage: X.XBool
}>
export function ui_subform_SoftEdge_Preprocessor_Options(
   form: X.Builder,
): UI_subform_SoftEdge_Preprocessor_Options {
   return form.group({
      label: 'Settings',
      startCollapsed: true,
      items: {
         ...cnet_preprocessor_ui_common(form),
         safe: form.bool({ default: false }),
      },
   })
}

// 🅿️ SoftEdge RUN ===================================================
export const run_cnet_SoftEdge = (
   SoftEdge: OutputFor<typeof ui_subform_SoftEdge>,
   image: _IMAGE,
   resolution: number, // 512 | 768 | 1024 = 512,
): {
   image: _IMAGE
   cnet_name: Enum_ControlNetLoader_control_net_name
} => {
   const run = getCurrentRun()
   const graph = run.nodes
   const cnet_name = SoftEdge.cnet_model_name

   // PREPROCESSOR - SoftEdge ===========================================================
   if (SoftEdge.preprocessor.Pidinet) {
      var pid = SoftEdge.preprocessor.Pidinet
      image = graph.PiDiNetPreprocessor({
         image: image,
         resolution: resolution,
         safe: pid.safe ? 'enable' : 'disable',
      })._IMAGE
      if (pid.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\SoftEdge\\pid' })
      else graph.PreviewImage({ images: image })
   } else if (SoftEdge.preprocessor.HED) {
      var hed = SoftEdge.preprocessor.HED
      image = graph.HEDPreprocessor({
         image: image,
         resolution: resolution,
         safe: !hed || hed?.safe ? 'enable' : 'disable',
      })._IMAGE
      if (hed?.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\SoftEdge\\hed' })
      else graph.PreviewImage({ images: image })
   }
   return { cnet_name, image }
}
