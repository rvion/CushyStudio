import type { ComfyWorkflowBuilder } from 'src/back/NodeBuilder'
import type { FormBuilder } from 'src/controls/FormBuilder'
import type { OutputFor } from './_prefabs'

export const ui_upscaleWithModel = () => {
    const form: FormBuilder = getCurrentForm()
    return form.groupOpt({
        label: 'Upscale via Model',
        items: () => ({
            model: form.enum.Enum_UpscaleModelLoader_model_name({
                default: '4x-UltraSharp.pth',
            }),
        }),
        requirements: [
            // 2x
            { type: 'modelInManager', modelName: 'RealESRGAN x2' },
            // 4x
            { type: 'modelInManager', modelName: 'RealESRGAN x4' },
            { type: 'modelInManager', modelName: '4x-UltraSharp' },
            { type: 'modelInManager', modelName: '4x-AnimeSharp' },
            { type: 'modelInManager', modelName: '4x_foolhardy_Remacri' },
            { type: 'modelInManager', modelName: '4x_NMKD-Siax_200k' },
            // 8x
            { type: 'modelInManager', modelName: '8x_NMKD-Superscale_150000_G' },
        ],
    })
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
