import type { OutputFor } from '../_prefabs/_prefabs'

import { cnet_preprocessor_ui_common, cnet_ui_common } from './cnet_ui_common'

// 🅿️ Scribble FORM ===================================================

export type UI_subform_Scribble = X.XGroup<{
   preprocessor: UI_subform_Scribble_Preprocessor
   cnet_model_name: X.XEnum<Comfy.Enums['ControlNetLoader.control_net_name']>
   strength: X.XNumber
   advanced: X.XGroup<{
      startAtStepPercent: X.XNumber
      endAtStepPercent: X.XNumber
      crop: X.XEnum<Comfy.Enums['LatentUpscale.crop']>
      upscale_method: X.XEnum<Comfy.Enums['ImageScale.upscale_method']>
   }>
}>
export function ui_subform_Scribble(): UI_subform_Scribble {
   const form: X.Builder = getCurrentForm()
   return form
      .group({
         label: 'Scribble',
         items: {
            ...cnet_ui_common(form),
            preprocessor: ui_subform_Scribble_Preprocessor(),
            cnet_model_name: form.enum['ControlNetLoader.input.control_net_name']({
               label: 'Model',
               default: 'control_scribble-fp16.safetensors',
               extraDefaults: ['control_v11p_sd15_scribble.pth'],
               filter: (name) => name.toString().includes('scribble'),
            }),
         },
      })
      .addRequirements([
         { type: 'customNodesByTitle', title: 'ComfyUI-Advanced-ControlNet' },
         { type: 'modelInManager', modelName: 'ControlNet-v1-1 (scribble; fp16)' },
      ])
}

// ========================================================================================
export type UI_subform_Scribble_Preprocessor = X.XChoice<{
   None: X.XEmpty
   ScribbleLines: UI_subform_Scribble_Lines
   FakeScribble: UI_subform_Fake_Scribble_Lines
   XDOG: UI_subform_Scribble_XDoG_Lines
}>
export function ui_subform_Scribble_Preprocessor(): UI_subform_Scribble_Preprocessor {
   const form = getCurrentForm()
   return form.choice(
      {
         None: form.empty(),
         ScribbleLines: ui_subform_Scribble_Lines(),
         FakeScribble: ui_subform_Fake_Scribble_Lines(),
         XDOG: ui_subform_Scribble_XDoG_Lines(),
      },
      {
         label: 'Scribble Preprocessor',
         default: 'ScribbleLines',
         appearance: 'tab',
         startCollapsed: true,
      },
   )
}

// ========================================================================================
export type UI_subform_Scribble_Lines = X.XGroup<{
   saveProcessedImage: X.XBool
}>
export const ui_subform_Scribble_Lines = (): UI_subform_Scribble_Lines => {
   const form = getCurrentForm()
   return form.group({
      label: 'Scribble Lines',
      // startCollapsed: true,
      items: cnet_preprocessor_ui_common(form),
   })
}

// ========================================================================================
export type UI_subform_Fake_Scribble_Lines = X.XGroup<{
   safe: X.XBool
   saveProcessedImage: X.XBool
}>
export function ui_subform_Fake_Scribble_Lines(): UI_subform_Fake_Scribble_Lines {
   const form = getCurrentForm()
   return form.group({
      label: 'Fake Scribble',
      items: {
         ...cnet_preprocessor_ui_common(form),
         safe: form.bool({ default: true }),
      },
   })
}

// ========================================================================================
export type UI_subform_Scribble_XDoG_Lines = X.XGroup<{
   threshold: X.XNumber
   saveProcessedImage: X.XBool
}>
export function ui_subform_Scribble_XDoG_Lines(): UI_subform_Scribble_XDoG_Lines {
   const form = getCurrentForm()
   return form.group({
      label: 'Scribble_XDoG_Lines',
      // startCollapsed: true,
      items: {
         ...cnet_preprocessor_ui_common(form),
         threshold: form.int({ default: 32, min: 0, max: 64 }),
      },
   })
}

// 🅿️ Scribble RUN =========================================================================

export const run_cnet_Scribble = (
   Scribble: OutputFor<typeof ui_subform_Scribble>,
   image: _IMAGE,
   resolution: number, // 512 | 768 | 1024 = 512,
): {
   image: _IMAGE
   cnet_name: Enum_ControlNetLoader_control_net_name
} => {
   const run = getCurrentRun()
   const graph = run.nodes
   const cnet_name = Scribble.cnet_model_name

   // PREPROCESSOR - Scribble ===========================================================
   if (Scribble.preprocessor) {
      if (Scribble.preprocessor.FakeScribble) {
         const fake = Scribble.preprocessor.FakeScribble
         image = graph.FakeScribblePreprocessor({
            image: image,
            resolution: resolution,
            safe: fake.safe ? 'enable' : 'disable',
         })._IMAGE
         if (fake.saveProcessedImage)
            graph.SaveImage({ images: image, filename_prefix: 'cnet\\Scribble\\fake' })
         else graph.PreviewImage({ images: image })
      } else if (Scribble.preprocessor.XDOG) {
         const xdog = Scribble.preprocessor.XDOG
         image = graph.Scribble$_XDoG$_Preprocessor({
            image: image,
            resolution: resolution,
            threshold: xdog.threshold,
         })._IMAGE
         if (xdog.saveProcessedImage)
            graph.SaveImage({ images: image, filename_prefix: 'cnet\\Scribble\\xdog' })
         else graph.PreviewImage({ images: image })
      } else if (Scribble.preprocessor.ScribbleLines) {
         const scribble = Scribble.preprocessor.ScribbleLines
         image = graph.ScribblePreprocessor({
            image: image,
            resolution: resolution,
         })._IMAGE
         if (scribble.saveProcessedImage)
            graph.SaveImage({ images: image, filename_prefix: 'cnet\\Scribble\\scribble' })
         else graph.PreviewImage({ images: image })
      }
   }

   return { cnet_name, image }
}
