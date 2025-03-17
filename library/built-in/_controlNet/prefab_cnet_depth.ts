import type { OutputFor } from '../_prefabs/_prefabs'

import { cnet_preprocessor_ui_common, cnet_ui_common } from './cnet_ui_common'

// 🅿️ Depth FORM ===================================================
export type UI_subform_Depth = Z.Group<{
   preprocessor: UI_subform_Depth_Preprocessor
   cnet_model_name: Z.Enum<'ControlNetLoader.control_net_name'>
   strength: Z.Number
   advanced: Z.Group<{
      startAtStepPercent: Z.Number
      endAtStepPercent: Z.Number
      crop: Z.Enum<'LatentUpscale.crop'>
      upscale_method: Z.Enum<'ImageScale.upscale_method'>
   }>
}>

export function ui_subform_Depth(): UI_subform_Depth {
   const ui: Z.Builder = getBuilder()
   return ui
      .group({
         label: 'Depth',
         items: {
            ...cnet_ui_common(ui),
            preprocessor: ui_subform_Depth_Preprocessor(),
            cnet_model_name: ui.enum['ControlNetLoader.control_net_name']({
               label: 'Model',
               // @ts-ignore
               default: 't2iadapter_depth_sd14v1.pth',
               filter: (name) => name.toString().includes('depth'),
            }),
         },
      })
      .addRequirements([
         //
         { type: 'customNodesByTitle', title: 'ComfyUI-Advanced-ControlNet' },
         { type: 'modelInManager', modelName: 'T2I-Adapter (depth)' },
         { type: 'modelInManager', modelName: 'ControlNet-v1-1 (depth; fp16)' },
         { type: 'modelInManager', modelName: 'stabilityai/control-lora-depth-rank128.safetensors' },
         { type: 'modelInManager', modelName: 'stabilityai/control-lora-depth-rank256.safetensors' },
         { type: 'modelInManager', modelName: 'controlnet-SargeZT/controlnet-sd-xl-1.0-depth-16bit-zoe' },
      ])
}

// ================================================================================
export type UI_subform_Depth_Preprocessor = Z.Choice<{
   None: Z.Empty
   Midas: UI_subform_Depth_Midas
   Leres: UI_subform_Depth_LeReS
   Zoe: UI_subform_Depth_Zoe
}>
export function ui_subform_Depth_Preprocessor(): UI_subform_Depth_Preprocessor {
   const ui: Z.Builder = getBuilder()
   return ui.choice(
      {
         None: ui.empty(),
         Midas: ui_subform_Depth_Midas(),
         Leres: ui_subform_Depth_LeReS(),
         Zoe: ui_subform_Depth_Zoe(),
         // TODO: Add support for auto-modifying the resolution based on other form selections
         // TODO: Add support for auto-cropping
      },
      { label: 'Depth Preprocessor', default: 'Midas', appearance: 'tab' },
   )
}

// ================================================================================
export type UI_subform_Depth_Midas = Z.Group<{
   a_value: Z.Number
   bg_threshold: Z.Number
   saveProcessedImage: Z.Bool
}>

export function ui_subform_Depth_Midas(): UI_subform_Depth_Midas {
   const form: Z.Builder = getBuilder()
   return form.group({
      label: 'Midas',
      // startCollapsed: true,
      uiui: { Header: null },
      collapsed: false,
      border: false,
      items: {
         ...cnet_preprocessor_ui_common(form),
         a_value: form.float({ default: 6.28, min: 0, max: 12.48 }),
         bg_threshold: form.float({ default: 0.1, min: 0, max: 0.2 }),
      },
   })
}

// ================================================================================
export type UI_subform_Depth_LeReS = Z.Group<{
   rm_nearest: Z.Number
   rm_background: Z.Number
   boost: Z.Bool
   saveProcessedImage: Z.Bool
}>
export function ui_subform_Depth_LeReS(): UI_subform_Depth_LeReS {
   const form: Z.Builder = getBuilder()
   return form.group({
      label: 'LeReS',
      // startCollapsed: true,
      items: {
         ...cnet_preprocessor_ui_common(form),
         rm_nearest: form.float({ default: 0.0 }),
         rm_background: form.float({ default: 0.0 }),
         boost: form.bool({ default: false }),
      },
   })
}

// ================================================================================
export type UI_subform_Depth_Zoe = Z.Group<{
   saveProcessedImage: Z.Bool
}>
export function ui_subform_Depth_Zoe(): UI_subform_Depth_Zoe {
   const form: Z.Builder = getBuilder()
   return form.group({
      label: 'Zoe',
      // startCollapsed: true,
      items: {
         ...cnet_preprocessor_ui_common(form),
      },
   })
}

// 🅿️ Depth RUN ===================================================
export const run_cnet_Depth = (
   Depth: OutputFor<typeof ui_subform_Depth>,
   image: Comfy.Signal['IMAGE'],
   resolution: number, // 512 | 768 | 1024 = 512,
): {
   image: Comfy.Signal['IMAGE']
   cnet_name: Comfy.Slots['ControlNetLoader.control_net_name']
} => {
   const sdk = getCurrentRun()
   const graph = sdk.nodes
   const cnet_name = Depth.cnet_model_name

   // PREPROCESSOR - Depth ===========================================================
   if (Depth.preprocessor) {
      if (Depth.preprocessor.Leres) {
         const leres = Depth.preprocessor.Leres
         image = graph['controlnet_aux.LeReS-DepthMapPreprocessor']({
            image: image,
            resolution: resolution,
            rm_nearest: leres.rm_nearest,
            rm_background: leres.rm_background,
            boost: leres.boost ? 'enable' : 'disable',
         })._IMAGE
         if (leres.saveProcessedImage)
            graph.SaveImage({ images: image, filename_prefix: 'cnet\\Depth\\leres' })
         else graph.PreviewImage({ images: image })
      } else if (Depth.preprocessor.Zoe) {
         const zoe = Depth.preprocessor.Zoe
         image = graph['controlnet_aux.Zoe-DepthMapPreprocessor']({
            image: image,
            resolution: resolution,
         })._IMAGE
         if (zoe.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\Depth\\zoe' })
         else graph.PreviewImage({ images: image })
      } else if (Depth.preprocessor.Midas) {
         const midas = Depth.preprocessor.Midas
         image = graph['controlnet_aux.MiDaS-DepthMapPreprocessor']({
            image: image,
            resolution: resolution,
            a: midas.a_value,
            bg_threshold: midas.bg_threshold,
         })._IMAGE
         if (midas.saveProcessedImage)
            graph.SaveImage({ images: image, filename_prefix: 'cnet\\Depth\\midas' })
         else graph.PreviewImage({ images: image })
      }
   }

   return { cnet_name, image }
}
