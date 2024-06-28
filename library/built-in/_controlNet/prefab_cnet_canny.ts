import type { OutputFor } from '../_prefabs/_prefabs'

import { cnet_preprocessor_ui_common, cnet_ui_common } from './cnet_ui_common'

// 🅿️ Canny FORM ===================================================
export type UI_subform_Canny = X.XGroup<{
    preprocessor: UI_subform_Canny_Preprocessor
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

export function ui_subform_Canny(): UI_subform_Canny {
    const ui: X.Builder = getCurrentForm()
    return ui
        .group({
            label: 'Canny',
            items: {
                ...cnet_ui_common(ui),
                preprocessor: ui_subform_Canny_Preprocessor(ui),
                models: ui.group({
                    label: 'Select or Download Models',
                    // startCollapsed: true,
                    items: {
                        cnet_model_name: ui.enum.Enum_ControlNetLoader_control_net_name({
                            label: 'Model',
                            default: 't2iadapter_canny_sd14v1.pth',
                            filter: (name) => name.toString().includes('canny'),
                        }),
                    },
                }),
            },
        })
        .addRequirements([
            { type: 'customNodesByTitle', title: 'ComfyUI-Advanced-ControlNet' },
            { type: 'modelInManager', modelName: 'T2I-Adapter (canny)' },
            { type: 'modelInManager', modelName: 'ControlNet-v1-1 (canny; fp16)' },
            { type: 'modelInManager', modelName: 'stabilityai/control-lora-canny-rank128.safetensors' },
            { type: 'modelInManager', modelName: 'stabilityai/control-lora-canny-rank256.safetensors' },
            { type: 'modelInManager', modelName: 'kohya-ss/ControlNet-LLLite: SDXL Canny Anime' },
        ])
}

// ================================================================================================
type UI_subform_Canny_Preprocessor = X.XOptional<
    X.XGroup<{
        lowThreshold: X.XNumber
        highThreshold: X.XNumber
        saveProcessedImage: X.XBool
    }>
>

function ui_subform_Canny_Preprocessor(ui: X.Builder): UI_subform_Canny_Preprocessor {
    return ui
        .group({
            label: 'Canny Edge Preprocessor',
            items: {
                ...cnet_preprocessor_ui_common(ui),
                lowThreshold: ui.int({ default: 100, min: 0, max: 200, step: 10 }),
                highThreshold: ui.int({ default: 200, min: 0, max: 400, step: 10 }),
                // TODO: Add support for auto-modifying the resolution based on other form selections
                // TODO: Add support for auto-cropping
            },
        })
        .optional(true)
}

// 🅿️ Canny RUN ===================================================
export const run_cnet_canny = (
    canny: OutputFor<typeof ui_subform_Canny>,
    image: _IMAGE,
    resolution: number, // 512 | 768 | 1024 = 512,
): {
    image: _IMAGE
    cnet_name: Enum_ControlNetLoader_control_net_name
} => {
    const run = getCurrentRun()
    const graph = run.nodes
    const cnet_name = canny.models.cnet_model_name

    // PREPROCESSOR - CANNY ===========================================================
    if (canny.preprocessor) {
        var canPP = canny.preprocessor
        image = graph.CannyEdgePreprocessor({
            image: image,
            low_threshold: canPP.lowThreshold,
            high_threshold: canPP.highThreshold,
            resolution: resolution,
        })._IMAGE
        if (canPP.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\canny\\' })
        else graph.PreviewImage({ images: image })
    }

    return { cnet_name, image }
}
