import type { ComfyWorkflowBuilder } from '../../../src/back/NodeBuilder'
import type { Requirements } from '../../../src/manager/REQUIREMENTS/Requirements'
import type { OutputFor } from './_prefabs'

export const ui_upscaleWithModel_v2 = () => {
    const ui: X.Builder = getCurrentForm()
    const allUpscaleModels = Array.from(cushy.managerRepository.knownModels.values()) //
        .filter((t) => t.type === 'upscale')

    const requirements: Requirements[] = allUpscaleModels.map(
        (t): Requirements => ({
            type: 'modelInManager',
            modelName: t.name,
            optional: true,
        }),
    )
    const x = ui.enums
        .Enum_UpscaleModelLoader_model_name({ label: 'Upscale via Model', getIdFromValue }) //
        .addRequirements(requirements)
    return x
}

export const run_upscaleWithModel_v2 = (
    ui: NonNullable<OutputFor<typeof ui_upscaleWithModel_v2>>,
    p?: { image?: _IMAGE },
): void => {
    const run = getCurrentRun()
    const graph: ComfyWorkflowBuilder = run.nodes
    for (const model of ui) {
        const upscaleModelName = model as Enum_UpscaleModelLoader_model_name
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
