import type { OutputFor } from '../_prefabs'
import type { FormBuilder } from 'src'

import { cnet_preprocessor_ui_common, cnet_ui_common } from '../prefab_cnet'

// 🅿️ Normal FORM ===================================================
export const ui_subform_Normal = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'Normal',
        requirements: [
            //
            { type: 'customNodesByTitle', title: 'ComfyUI-Advanced-ControlNet' },
            { type: 'modelInManager', modelName: 'ControlNet-v1-1 (normalbae; fp16)' },
        ],
        items: () => ({
            ...cnet_ui_common(form),
            preprocessor: ui_subform_Normal_Preprocessor(),
            models: form.group({
                label: 'Select or Download Models',
                // startCollapsed: true,
                items: () => ({
                    cnet_model_name: form.enum.Enum_ControlNetLoader_control_net_name({
                        label: 'Model',
                        default: 'control_v11p_sd15_normalbae.pth' as any,
                        filter: (x) => x.toString().includes('normal'),
                        extraDefaults: ['control_v11p_sd15_normalbae.pth'],
                    }),
                }),
            }),
        }),
    })
}

export const ui_subform_Normal_Preprocessor = () => {
    const form: FormBuilder = getCurrentForm()
    return form.choice({
        label: 'Normal Preprocessor',
        startCollapsed: true,
        default: 'Midas',
        appearance: 'tab',
        items: {
            None: form.group(),
            Midas: ui_subform_Normal_Midas(),
            BAE: ui_subform_Normal_bae(),
            // TODO: Add support for auto-modifying the resolution based on other form selections
            // TODO: Add support for auto-cropping
        },
    })
}

export const ui_subform_Normal_Midas = () => {
    const form = getCurrentForm()
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

export const ui_subform_Normal_bae = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'Settings',
        startCollapsed: true,
        items: () => ({
            ...cnet_preprocessor_ui_common(form),
        }),
    })
}

// 🅿️ Normal RUN ===================================================
export const run_cnet_Normal = (
    Normal: OutputFor<typeof ui_subform_Normal>,
    image: _IMAGE,
    resolution: number, // 512 | 768 | 1024 = 512,
): {
    image: _IMAGE
    cnet_name: Enum_ControlNetLoader_control_net_name
} => {
    const run = getCurrentRun()
    const graph = run.nodes
    const cnet_name = Normal.models.cnet_model_name

    // PREPROCESSOR - Normal ===========================================================
    if (Normal.preprocessor) {
        if (Normal.preprocessor.BAE) {
            const bae = Normal.preprocessor.BAE
            image = graph.BAE$7NormalMapPreprocessor({
                image: image,
                resolution: resolution,
            })._IMAGE
            if (bae.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\Normal\\bae' })
            else graph.PreviewImage({ images: image })
        } else if (Normal.preprocessor.Midas) {
            const midas = Normal.preprocessor.Midas
            image = graph.MiDaS$7NormalMapPreprocessor({
                image: image,
                resolution: resolution,
                a: midas.a_value,
                bg_threshold: midas.bg_threshold,
            })._IMAGE
            if (midas?.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\Normal\\midas' })
            else graph.PreviewImage({ images: image })
        }
    }

    return { cnet_name, image }
}
