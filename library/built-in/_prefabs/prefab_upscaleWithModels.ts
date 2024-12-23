import type { ComfyWorkflowBuilder } from '../../../src/back/NodeBuilder'
import type { Requirements } from '../../../src/manager/REQUIREMENTS/Requirements'
import type { OutputFor } from './_prefabs'

export const ui_upscaleWithModel_v2 = (): X.XSelectMany_<Comfy.Slots['UpscaleModelLoader.model_name']> => {
   const ui: X.Builder = getCurrentForm()
   const allUpscaleModels = Array.from(cushy.comfyAddons.knownModels.values()) //
      .filter((t) => t.type === 'upscale')

   const requirements: Requirements[] = allUpscaleModels.map(
      (t): Requirements => ({
         type: 'modelInManager',
         modelName: t.name,
         optional: true,
      }),
   )

   const x = ui.enums['UpscaleModelLoader.model_name']({ label: 'Upscale via Model' }) //
      .addRequirements(requirements)
   return x
}

export const run_upscaleWithModel_v2 = (
   ui: NonNullable<OutputFor<typeof ui_upscaleWithModel_v2>>,
   p?: { image?: Comfy.Signal['IMAGE'] },
): void => {
   const run = getCurrentRun()
   const graph: ComfyWorkflowBuilder = run.nodes
   for (const model of ui) {
      const upscaleModelName = model as Comfy.Slots['UpscaleModelLoader.model_name']
      const upscaleModel = graph.UpscaleModelLoader({ model_name: upscaleModelName })
      const upscaledResult = graph.ImageUpscaleWithModel({
         image: p?.image ?? run.AUTO,
         upscale_model: upscaleModel,
      })
      graph
         .SaveImage({ images: upscaledResult, filename_prefix: `upscaled_${upscaleModelName}` }) //
         .addTag(upscaleModelName)
         .addTag('upscaled')
   }
   // return upscaledResult.outputs.IMAGE
}
