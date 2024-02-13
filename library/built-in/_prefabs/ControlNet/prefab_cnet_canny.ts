import type { OutputFor } from '../_prefabs'
import type { FormBuilder } from 'src'

import { cnet_preprocessor_ui_common, cnet_ui_common } from '../prefab_cnet'

// 🅿️ Canny FORM ===================================================
export const ui_subform_Canny = () => {
    const form: FormBuilder = getCurrentForm()
    return form.group({
        label: 'Canny',
        requirements: [
            { type: 'customNodesByTitle', title: 'ComfyUI-Advanced-ControlNet' },
            { type: 'modelInManager', modelName: 'T2I-Adapter (canny)' },
            { type: 'modelInManager', modelName: 'ControlNet-v1-1 (canny; fp16)' },
            { type: 'modelInManager', modelName: 'stabilityai/control-lora-canny-rank128.safetensors' },
            { type: 'modelInManager', modelName: 'stabilityai/control-lora-canny-rank256.safetensors' },
            { type: 'modelInManager', modelName: 'kohya-ss/ControlNet-LLLite: SDXL Canny Anime' },
        ],
        items: () => ({
            ...cnet_ui_common(form),
            preprocessor: ui_subform_Canny_Preprocessor(form),
            models: form.group({
                label: 'Select or Download Models',
                // startCollapsed: true,
                items: () => ({
                    cnet_model_name: form.enum.Enum_ControlNetLoader_control_net_name({
                        label: 'Model',
                        default: 't2iadapter_canny_sd14v1.pth',
                        filter: (name) => name.toString().includes('canny'),
                    }),
                }),
            }),
        }),
    })
}

export const ui_subform_Canny_Preprocessor = (form: FormBuilder) => {
    return form.groupOpt({
        label: 'Canny Edge Preprocessor',
        startActive: true,
        startCollapsed: true,
        items: () => ({
            ...cnet_preprocessor_ui_common(form),
            lowThreshold: form.int({ default: 100, min: 0, max: 200, step: 10 }),
            highThreshold: form.int({ default: 200, min: 0, max: 400, step: 10 }),
            // TODO: Add support for auto-modifying the resolution based on other form selections
            // TODO: Add support for auto-cropping
        }),
    })
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
