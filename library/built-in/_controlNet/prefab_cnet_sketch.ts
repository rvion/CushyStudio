import type { OutputFor } from '../_prefabs/_prefabs'

import { cnet_ui_common } from './cnet_ui_common'

// 🅿️ Sketch FORM ===================================================

export type UI_subform_Sketch = Z.Group<{
   strength: Z.Number
   advanced: Z.Group<{
      startAtStepPercent: Z.Number
      endAtStepPercent: Z.Number
      crop: Z.Enum<'LatentUpscale.crop'>
      upscale_method: Z.Enum<'ImageScale.upscale_method'>
   }>
   cnet_model_name: Z.Enum<'ControlNetLoader.control_net_name'>
}>
export function ui_subform_Sketch(): UI_subform_Sketch {
   const form = getBuilder()
   return form
      .group({
         label: 'Sketch',
         items: {
            cnet_model_name: form.enum['ControlNetLoader.control_net_name']({
               label: 'Model',
               // @ts-ignore
               default: 't2iadapter_sketch_sd14v1.pth',
            }),
            ...cnet_ui_common(form),
         },
      })
      .addRequirements([
         { type: 'customNodesByTitle', title: 'ComfyUI-Advanced-ControlNet' },
         { type: 'modelInManager', modelName: 'T2I-Adapter (sketch)' },
         {
            type: 'modelInManager',
            modelName: 'stabilityai/control-lora-sketch-rank128-metadata.safetensors',
         },
         { type: 'modelInManager', modelName: 'stabilityai/control-lora-sketch-rank256.safetensors' },
      ])
}

// 🅿️ Sketch RUN ===================================================
export const run_cnet_Sketch = (
   Sketch: OutputFor<typeof ui_subform_Sketch>,
   image: Comfy.Signal['IMAGE'],
): {
   image: Comfy.Signal['IMAGE']
   cnet_name: Comfy.Slots['ControlNetLoader.control_net_name']
} => {
   const run = getCurrentRun()
   const graph = run.nodes
   const cnet_name = Sketch.cnet_model_name

   //sketch does not really have any preprocessor or anything, so not much here

   return { cnet_name, image }
}
