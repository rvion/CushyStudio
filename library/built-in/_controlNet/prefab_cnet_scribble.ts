import type { OutputFor } from '../_prefabs/_prefabs'

import { cnet_preprocessor_ui_common, cnet_ui_common } from './cnet_ui_common'

// 🅿️ Scribble FORM ===================================================

export type UI_subform_Scribble = Z.Group<{
   preprocessor: UI_subform_Scribble_Preprocessor
   cnet_model_name: Z.Enum<'ControlNetLoader.control_net_name'>
   strength: Z.Number
   advanced: Z.Group<{
      startAtStepPercent: Z.Number
      endAtStepPercent: Z.Number
      crop: Z.Enum<'LatentUpscale.crop'>
      upscale_method: Z.Enum<'ImageScale.upscale_method'>
   }>
}>
export function ui_subform_Scribble(): UI_subform_Scribble {
   const form: Z.Builder = getBuilder()
   return form
      .group({
         label: 'Scribble',
         items: {
            ...cnet_ui_common(form),
            preprocessor: ui_subform_Scribble_Preprocessor(),
            cnet_model_name: form.enum['ControlNetLoader.control_net_name']({
               label: 'Model',
               // @ts-ignore
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
export type UI_subform_Scribble_Preprocessor = Z.Choice<{
   None: Z.Empty
   ScribbleLines: UI_subform_Scribble_Lines
   FakeScribble: UI_subform_Fake_Scribble_Lines
   XDOG: UI_subform_Scribble_XDoG_Lines
}>
export function ui_subform_Scribble_Preprocessor(): UI_subform_Scribble_Preprocessor {
   const form = getBuilder()
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
export type UI_subform_Scribble_Lines = Z.Group<{
   saveProcessedImage: Z.Bool
}>
export const ui_subform_Scribble_Lines = (): UI_subform_Scribble_Lines => {
   const form = getBuilder()
   return form.group({
      label: 'Scribble Lines',
      // startCollapsed: true,
      items: cnet_preprocessor_ui_common(form),
   })
}

// ========================================================================================
export type UI_subform_Fake_Scribble_Lines = Z.Group<{
   safe: Z.Bool
   saveProcessedImage: Z.Bool
}>
export function ui_subform_Fake_Scribble_Lines(): UI_subform_Fake_Scribble_Lines {
   const form = getBuilder()
   return form.group({
      label: 'Fake Scribble',
      items: {
         ...cnet_preprocessor_ui_common(form),
         safe: form.bool({ default: true }),
      },
   })
}

// ========================================================================================
export type UI_subform_Scribble_XDoG_Lines = Z.Group<{
   threshold: Z.Number
   saveProcessedImage: Z.Bool
}>
export function ui_subform_Scribble_XDoG_Lines(): UI_subform_Scribble_XDoG_Lines {
   const form = getBuilder()
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
   image: Comfy.Signal['IMAGE'],
   resolution: number, // 512 | 768 | 1024 = 512,
): {
   image: Comfy.Signal['IMAGE']
   cnet_name: Comfy.Slots['ControlNetLoader.control_net_name']
} => {
   const run = getCurrentRun()
   const graph = run.nodes
   const cnet_name = Scribble.cnet_model_name

   // PREPROCESSOR - Scribble ===========================================================
   if (Scribble.preprocessor) {
      if (Scribble.preprocessor.FakeScribble) {
         const fake = Scribble.preprocessor.FakeScribble
         image = graph['controlnet_aux.FakeScribblePreprocessor']({
            image: image,
            resolution: resolution,
            safe: fake.safe ? 'enable' : 'disable',
         })._IMAGE
         if (fake.saveProcessedImage)
            graph.SaveImage({ images: image, filename_prefix: 'cnet\\Scribble\\fake' })
         else graph.PreviewImage({ images: image })
      } else if (Scribble.preprocessor.XDOG) {
         const xdog = Scribble.preprocessor.XDOG
         image = graph['controlnet_aux.Scribble_XDoG_Preprocessor']({
            image: image,
            resolution: resolution,
            threshold: xdog.threshold,
         })._IMAGE
         if (xdog.saveProcessedImage)
            graph.SaveImage({ images: image, filename_prefix: 'cnet\\Scribble\\xdog' })
         else graph.PreviewImage({ images: image })
      } else if (Scribble.preprocessor.ScribbleLines) {
         const scribble = Scribble.preprocessor.ScribbleLines
         image = graph['controlnet_aux.ScribblePreprocessor']({
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
