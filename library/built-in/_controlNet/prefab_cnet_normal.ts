import type { OutputFor } from '../_prefabs/_prefabs'

import { cnet_preprocessor_ui_common, cnet_ui_common } from './cnet_ui_common'

// 🅿️ Normal FORM ===================================================
export type UI_subform_Normal = Z.Group<{
   preprocessor: UI_subform_Normal_Preprocessor
   models: Z.Group<{
      cnet_model_name: Z.Enum<'ControlNetLoader.control_net_name'>
   }>
   strength: Z.Number
   advanced: Z.Group<{
      startAtStepPercent: Z.Number
      endAtStepPercent: Z.Number
      crop: Z.Enum<'LatentUpscale.crop'>
      upscale_method: Z.Enum<'ImageScale.upscale_method'>
   }>
}>
export function ui_subform_Normal(): UI_subform_Normal {
   const form = getBuilder()
   return form
      .group({
         label: 'Normal',
         items: {
            ...cnet_ui_common(form),
            preprocessor: ui_subform_Normal_Preprocessor(),
            models: form.group({
               label: 'Select or Download Models',
               // startCollapsed: true,
               items: {
                  cnet_model_name: form.enum['ControlNetLoader.control_net_name']({
                     label: 'Model',
                     default: 'control_v11p_sd15_normalbae.pth' as any,
                     filter: (x) => x.toString().includes('normal'),
                     extraDefaults: ['control_v11p_sd15_normalbae.pth'],
                  }),
               },
            }),
         },
      })
      .addRequirements([
         { type: 'customNodesByTitle', title: 'ComfyUI-Advanced-ControlNet' },
         { type: 'modelInManager', modelName: 'ControlNet-v1-1 (normalbae; fp16)' },
      ])
}

// ================================================================================================
type UI_subform_Normal_Preprocessor = Z.Choice<{
   None: Z.Empty
   Midas: UI_subform_Normal_Midas
   BAE: UI_subform_Normal_bae
}>

function ui_subform_Normal_Preprocessor(): UI_subform_Normal_Preprocessor {
   const form: Z.Builder = getBuilder()
   return form.choice(
      {
         None: form.empty(),
         Midas: ui_subform_Normal_Midas(),
         BAE: ui_subform_Normal_bae(),
         // TODO: Add support for auto-modifying the resolution based on other form selections
         // TODO: Add support for auto-cropping
      },
      { label: 'Normal Preprocessor', startCollapsed: true, default: 'Midas', appearance: 'tab' },
   )
}

// ==========================================================================================
type UI_subform_Normal_Midas = Z.Group<{
   a_value: Z.Number
   bg_threshold: Z.Number
   saveProcessedImage: Z.Bool
}>

function ui_subform_Normal_Midas(): UI_subform_Normal_Midas {
   const form = getBuilder()
   return form.group({
      label: 'Settings',
      startCollapsed: true,
      items: {
         ...cnet_preprocessor_ui_common(form),
         a_value: form.float({ default: 6.28, min: 0, max: 12.48 }),
         bg_threshold: form.float({ default: 0.1, min: 0, max: 0.2 }),
      },
   })
}

// ==========================================================================================
type UI_subform_Normal_bae = Z.Group<{
   saveProcessedImage: Z.Bool
}>

function ui_subform_Normal_bae(): UI_subform_Normal_bae {
   const form = getBuilder()
   return form.group({
      label: 'Settings',
      startCollapsed: true,
      items: {
         ...cnet_preprocessor_ui_common(form),
      },
   })
}

// 🅿️ Normal RUN ===================================================
export const run_cnet_Normal = (
   Normal: OutputFor<typeof ui_subform_Normal>,
   image: Comfy.Signal['IMAGE'],
   resolution: number, // 512 | 768 | 1024 = 512,
): {
   image: Comfy.Signal['IMAGE']
   cnet_name: Comfy.Slots['ControlNetLoader.control_net_name']
} => {
   const sdk = getCurrentRun()
   const graph = sdk.nodes
   const cnet_name = Normal.models.cnet_model_name

   // PREPROCESSOR - Normal ===========================================================
   if (Normal.preprocessor) {
      if (Normal.preprocessor.BAE) {
         const bae = Normal.preprocessor.BAE
         image = graph['controlnet_aux.BAE-NormalMapPreprocessor']({
            image: image,
            resolution: resolution,
         })._IMAGE
         if (bae.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\Normal\\bae' })
         else graph.PreviewImage({ images: image })
      } else if (Normal.preprocessor.Midas) {
         const midas = Normal.preprocessor.Midas
         image = graph['controlnet_aux.MiDaS-NormalMapPreprocessor']({
            image: image,
            resolution: resolution,
            a: midas.a_value,
            bg_threshold: midas.bg_threshold,
         })._IMAGE
         if (midas?.saveProcessedImage)
            graph.SaveImage({ images: image, filename_prefix: 'cnet\\Normal\\midas' })
         else graph.PreviewImage({ images: image })
      }
   }

   return { cnet_name, image }
}
