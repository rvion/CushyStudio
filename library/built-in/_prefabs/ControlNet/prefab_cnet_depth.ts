import type { OutputFor } from '../_prefabs'
import type { FormBuilder } from 'src'

import { cnet_preprocessor_ui_common, cnet_ui_common } from '../prefab_cnet'

// 🅿️ Depth FORM ===================================================
export const ui_subform_Depth = () => {
    const form: FormBuilder = getCurrentForm()
    return form.group({
        label: 'Depth',
        requirements: [
            //
            { type: 'customNodesByTitle', title: 'ComfyUI-Advanced-ControlNet' },
            { type: 'modelInManager', modelName: 'T2I-Adapter (depth)' },
            { type: 'modelInManager', modelName: 'ControlNet-v1-1 (depth; fp16)' },
            { type: 'modelInManager', modelName: 'stabilityai/control-lora-depth-rank128.safetensors' },
            { type: 'modelInManager', modelName: 'stabilityai/control-lora-depth-rank256.safetensors' },
            { type: 'modelInManager', modelName: 'controlnet-SargeZT/controlnet-sd-xl-1.0-depth-16bit-zoe' },
        ],
        items: () => ({
            ...cnet_ui_common(form),
            preprocessor: ui_subform_Depth_Preprocessor(),
            models: form.group({
                label: 'Select or Download Models',
                // startCollapsed: true,
                items: () => ({
                    cnet_model_name: form.enum.Enum_ControlNetLoader_control_net_name({
                        label: 'Model',
                        // @ts-ignore
                        default: 't2iadapter_depth_sd14v1.pth',
                        filter: (name) => name.toString().includes('depth'),
                    }),
                }),
            }),
        }),
    })
}

export const ui_subform_Depth_Preprocessor = () => {
    const form: FormBuilder = getCurrentForm()
    return form.choice({
        label: 'Depth Preprocessor',
        startCollapsed: true,
        default: 'Midas',
        appearance: 'tab',
        items: {
            None: form.group(),
            Midas: ui_subform_Depth_Midas(),
            Leres: ui_subform_Depth_LeReS(),
            Zoe: ui_subform_Depth_Zoe(),
            // TODO: Add support for auto-modifying the resolution based on other form selections
            // TODO: Add support for auto-cropping
        },
    })
}

export const ui_subform_Depth_Midas = () => {
    const form: FormBuilder = getCurrentForm()
    return form.group({
        label: 'Settings',
        startCollapsed: true,
        items: () => ({
            ...cnet_preprocessor_ui_common(form),
            a_value: form.float({ default: 6.28, min: 0, max: 12.48 }),
            bg_threshold: form.float({ default: 0.1, min: 0, max: 0.2 }),
        }),
    })
}

export const ui_subform_Depth_LeReS = () => {
    const form: FormBuilder = getCurrentForm()
    return form.group({
        label: 'Settings',
        startCollapsed: true,
        items: () => ({
            ...cnet_preprocessor_ui_common(form),
            rm_nearest: form.float({ default: 0.0 }),
            rm_background: form.float({ default: 0.0 }),
            boost: form.bool({ default: false }),
        }),
    })
}

export const ui_subform_Depth_Zoe = () => {
    const form: FormBuilder = getCurrentForm()
    return form.group({
        label: 'Settings',
        startCollapsed: true,
        items: () => ({
            ...cnet_preprocessor_ui_common(form),
        }),
    })
}

// 🅿️ Depth RUN ===================================================
export const run_cnet_Depth = (
    Depth: OutputFor<typeof ui_subform_Depth>,
    image: _IMAGE,
    resolution: number, // 512 | 768 | 1024 = 512,
): {
    image: _IMAGE
    cnet_name: Enum_ControlNetLoader_control_net_name
} => {
    const run = getCurrentRun()
    const graph = run.nodes
    const cnet_name = Depth.models.cnet_model_name

    // PREPROCESSOR - Depth ===========================================================
    if (Depth.preprocessor) {
        if (Depth.preprocessor.Leres) {
            const leres = Depth.preprocessor.Leres
            image = graph.LeReS$7DepthMapPreprocessor({
                image: image,
                resolution: resolution,
                rm_nearest: leres.rm_nearest,
                rm_background: leres.rm_background,
                boost: leres.boost ? 'enable' : 'disable',
            })._IMAGE
            if (leres.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\Depth\\leres' })
            else graph.PreviewImage({ images: image })
        } else if (Depth.preprocessor.Zoe) {
            const zoe = Depth.preprocessor.Zoe
            image = graph.Zoe$7DepthMapPreprocessor({
                image: image,
                resolution: resolution,
            })._IMAGE
            if (zoe.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\Depth\\zoe' })
            else graph.PreviewImage({ images: image })
        } else if (Depth.preprocessor.Midas) {
            const midas = Depth.preprocessor.Midas
            image = graph.MiDaS$7DepthMapPreprocessor({
                image: image,
                resolution: resolution,
                a: midas.a_value,
                bg_threshold: midas.bg_threshold,
            })._IMAGE
            if (midas.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\Depth\\midas' })
            else graph.PreviewImage({ images: image })
        }
    }

    return { cnet_name, image }
}
