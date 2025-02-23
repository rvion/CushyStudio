import type { OutputFor } from '../_prefabs/_prefabs'

import { cnet_preprocessor_ui_common, cnet_ui_common } from './cnet_ui_common'

// 🅿️ Canny FORM ===================================================
export type UI_subform_Canny = Z.XGroup<{
   preprocessor: UI_subform_Canny_Preprocessor
   models: Z.XGroup<{
      cnet_model_name: Z.XEnum<'ControlNetLoader.control_net_name'>
   }>
   strength: Z.XNumber
   advanced: Z.XGroup<{
      startAtStepPercent: Z.XNumber
      endAtStepPercent: Z.XNumber
      crop: Z.XEnum<'LatentUpscale.crop'>
      upscale_method: Z.XEnum<'ImageScale.upscale_method'>
   }>
}>

export function ui_subform_Canny(): UI_subform_Canny {
   const ui: Z.Builder = getCurrentForm()
   return ui
      .group({
         label: 'Canny',
         items: {
            ...cnet_ui_common(ui),
            preprocessor: ui_subform_Canny_Preprocessor(ui),
            models: ui.group({
               label: 'Select or Download Models',
               // startCollapsed: true,
               items: {
                  cnet_model_name: ui.enum['ControlNetLoader.control_net_name']({
                     label: 'Model',
                     // @ts-ignore
                     default: 't2iadapter_canny_sd14v1.pth',
                     filter: (name) => name.toString().includes('canny'),
                  }),
               },
            }),
         },
      })
      .addRequirements([
         { type: 'customNodesByTitle', title: 'ComfyUI-Advanced-ControlNet' },
         { type: 'modelInManager', modelName: 'T2I-Adapter (canny)' },
         { type: 'modelInManager', modelName: 'ControlNet-v1-1 (canny; fp16)' },
         { type: 'modelInManager', modelName: 'stabilityai/control-lora-canny-rank128.safetensors' },
         { type: 'modelInManager', modelName: 'stabilityai/control-lora-canny-rank256.safetensors' },
         { type: 'modelInManager', modelName: 'kohya-ss/ControlNet-LLLite: SDXL Canny Anime' },
      ])
}

// ================================================================================================
type UI_subform_Canny_Preprocessor = Z.XOptional<
   Z.XGroup<{
      lowThreshold: Z.XNumber
      highThreshold: Z.XNumber
      saveProcessedImage: Z.XBool
   }>
>

function ui_subform_Canny_Preprocessor(ui: Z.Builder): UI_subform_Canny_Preprocessor {
   return ui
      .group({
         label: 'Canny Edge Preprocessor',
         items: {
            ...cnet_preprocessor_ui_common(ui),
            lowThreshold: ui.int({ default: 100, min: 0, max: 200, step: 10 }),
            highThreshold: ui.int({ default: 200, min: 0, max: 400, step: 10 }),
            // TODO: Add support for auto-modifying the resolution based on other form selections
            // TODO: Add support for auto-cropping
         },
      })
      .optional(true)
}

// 🅿️ Canny RUN ===================================================
export const run_cnet_canny = (
   canny: OutputFor<typeof ui_subform_Canny>,
   image: Comfy.Signal['IMAGE'],
   resolution: number, // 512 | 768 | 1024 = 512,
): {
   image: Comfy.Signal['IMAGE']
   cnet_name: Comfy.Slots['ControlNetLoader.control_net_name']
} => {
   const sdk = getCurrentRun()
   const graph = sdk.nodes
   const cnet_name = canny.models.cnet_model_name

   // PREPROCESSOR - CANNY ===========================================================
   if (canny.preprocessor) {
      const canPP = canny.preprocessor
      image = graph['controlnet_aux.CannyEdgePreprocessor']({
         image: image,
         low_threshold: canPP.lowThreshold,
         high_threshold: canPP.highThreshold,
         resolution: resolution,
      })._IMAGE
      if (canPP.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\canny\\' })
      else graph.PreviewImage({ images: image })
   }

   return { cnet_name, image }
}
