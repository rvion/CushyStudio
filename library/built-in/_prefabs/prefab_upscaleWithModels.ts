import type { ComfyWorkflowBuilder } from '../../../src/back/NodeBuilder'
import type { Builder } from '../../../src/controls/Builder'
import type { Requirements } from '../../../src/manager/REQUIREMENTS/Requirements'
import type { OutputFor } from './_prefabs'

export const ui_upscaleWithModel_v2 = () => {
    const allUpscaleModels = Array.from(cushy.managerRepository.knownModels.values()) //
        .filter((t) => t.type === 'upscale')

    const ui: X.Builder = getCurrentForm()
    return ui.enums.Enum_UpscaleModelLoader_model_name({ label: 'Upscale via Model' }).addRequirements(
        allUpscaleModels //
            .map((t): Requirements => ({ type: 'modelInManager', modelName: t.name, optional: true })),
    )
}

export const run_upscaleWithModel_v2 = (
    ui: NonNullable<OutputFor<typeof ui_upscaleWithModel_v2>>,
    p?: { image?: _IMAGE },
): void => {
    const run = getCurrentRun()
    const graph: ComfyWorkflowBuilder = run.nodes
    for (const model of ui) {
        const upscaleModelName = model.id as Enum_UpscaleModelLoader_model_name
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
