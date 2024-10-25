import type { OutputFor } from '../_prefabs/_prefabs'

import { cnet_preprocessor_ui_common, cnet_ui_common } from './cnet_ui_common'

// 🅿️ Tile FORM ===================================================
export type UI_subform_Tile = X.XGroup<{
   preprocessor: UI_subform_Tile_Preprocessor
   models: X.XGroup<{
      cnet_model_name: X.XEnum<Enum_ControlNetLoader_control_net_name>
   }>
   strength: X.XNumber
   advanced: X.XGroup<{
      startAtStepPercent: X.XNumber
      endAtStepPercent: X.XNumber
      crop: X.XEnum<Enum_LatentUpscale_crop>
      upscale_method: X.XEnum<Enum_ImageScale_upscale_method>
   }>
}>

export function ui_subform_Tile(): UI_subform_Tile {
   const form = getCurrentForm()
   return form
      .group({
         label: 'Tile',
         items: {
            ...cnet_ui_common(form),
            preprocessor: ui_subform_Tile_Preprocessor(),
            models: form.group({
               label: 'Select or Download Models',
               // startCollapsed: true,
               items: {
                  cnet_model_name: form.enum.Enum_ControlNetLoader_control_net_name({
                     label: 'Model',
                     default: 'control_v11u_sd15_tile_fp16.safetensors',
                     filter: (name) => name.toString().includes('_tile'),
                     extraDefaults: ['control_v11f1e_sd15_tile.pth'],
                  }),
               },
            }),
         },
      })
      .addRequirements([
         //
         { type: 'customNodesByTitle', title: 'ComfyUI-Advanced-ControlNet' },
         { type: 'modelInManager', modelName: 'ControlNet-v1-1 (tile; fp16; v11u)' },
         { type: 'modelInManager', modelName: 'ControlNet-v1-1 (tile; fp16; v11f1e)' },
      ])
}

export type UI_subform_Tile_Preprocessor = X.XChoice<{
   None: X.XEmpty
   Pyrup: X.XGroup<{
      pyrup: X.XNumber
      saveProcessedImage: X.XBool
   }>
}>
export function ui_subform_Tile_Preprocessor(): UI_subform_Tile_Preprocessor {
   const form: X.Builder = getCurrentForm()
   return form.choice(
      {
         None: form.empty(),
         Pyrup: form.group({
            label: 'Settings',
            startCollapsed: true,
            items: {
               ...cnet_preprocessor_ui_common(form),
               pyrup: form.int({ default: 3, min: 0 }),
            },
         }),
      },
      {
         label: 'Depth Preprocessor',
         startCollapsed: true,
         default: 'Pyrup',
         appearance: 'tab',
      },
   )
}

// 🅿️ Tile RUN ===================================================
export const run_cnet_Tile = (
   Tile: OutputFor<typeof ui_subform_Tile>,
   image: _IMAGE,
   resolution: number, // 512 | 768 | 1024 = 512,
): {
   image: _IMAGE
   cnet_name: Enum_ControlNetLoader_control_net_name
} => {
   const run = getCurrentRun()
   const graph = run.nodes
   const cnet_name = Tile.models.cnet_model_name

   // PREPROCESSOR - Tile ===========================================================
   if (Tile.preprocessor.Pyrup) {
      const tile = Tile.preprocessor.Pyrup
      image = graph.TilePreprocessor({
         image: image,
         resolution: resolution,
         pyrUp_iters: tile.pyrup,
      })._IMAGE
      if (tile.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\Tile\\midas' })
      else graph.PreviewImage({ images: image })
   }

   return { cnet_name, image }
}
