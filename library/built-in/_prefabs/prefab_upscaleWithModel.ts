import type { ComfyWorkflowBuilder } from '../../../src/back/NodeBuilder'
import type { FormBuilder } from '../../../src/controls/FormBuilder'
import type { Requirements } from '../../../src/manager/REQUIREMENTS/Requirements'
import type { OutputFor } from './_prefabs'

export type UI_upscaleWithModel = X.XGroup<{
    model: X.XEnum<Enum_UpscaleModelLoader_model_name>
}>

export function ui_upscaleWithModel(): UI_upscaleWithModel {
    const ui: FormBuilder = getCurrentForm()
    return ui
        .group({
            label: 'Upscale via Model',
            items: { model: ui.enum.Enum_UpscaleModelLoader_model_name({ default: '4x-UltraSharp.pth' }) },
            icon: 'mdiArrowExpandAll',
            box: { base: { hue: 180, chroma: 0.1 } },
        })
        .addRequirements([
            // // 2x
            // { type: 'modelInManager', modelName: 'RealESRGAN x2' },
            // // 4x
            // { type: 'modelInManager', modelName: 'RealESRGAN x4' },
            // { type: 'modelInManager', modelName: '4x-UltraSharp' },
            // { type: 'modelInManager', modelName: '4x-AnimeSharp' },
            // { type: 'modelInManager', modelName: '4x_foolhardy_Remacri' },
            // { type: 'modelInManager', modelName: '4x_NMKD-Siax_200k' },
            // // 8x
            // { type: 'modelInManager', modelName: '8x_NMKD-Superscale_150000_G' },
            ...Array.from(cushy.managerRepository.knownModels.values())
                .filter((t) => t.type === 'upscale')
                .map((t): Requirements => ({ type: 'modelInManager', modelName: t.name, optional: true })),
        ])
}

export const run_upscaleWithModel = (ui: NonNullable<OutputFor<typeof ui_upscaleWithModel>>, p?: { image?: _IMAGE }): _IMAGE => {
    const run = getCurrentRun()
    const graph: ComfyWorkflowBuilder = run.nodes
    const upscale = ui
    const upscaleModelName = upscale.model
    const upscaleModel = graph.UpscaleModelLoader({ model_name: upscaleModelName })
    const upscaledResult = graph.ImageUpscaleWithModel({
        image: p?.image ?? run.AUTO,
        upscale_model: upscaleModel,
    })
    graph.SaveImage({ images: upscaledResult })
    return upscaledResult.outputs.IMAGE
}
