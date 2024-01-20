import { cnet_preprocessor_ui_common, cnet_ui_common } from '../prefab_cnet'
import { OutputFor } from '../_prefabs'

// 🅿️ Normal FORM ===================================================
export const ui_subform_Normal = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'Normal',
        customNodesByTitle: 'ComfyUI-Advanced-ControlNet',
        items: () => ({
            ...cnet_ui_common(form),
            preprocessor: ui_subform_Normal_Preprocessor(),
            cnet_model_name: form.enum({
                enumName: 'Enum_ControlNetLoader_control_net_name',
                default: { value: 'control_v11p_sd15_normalbae.pth' },
                recommandedModels: { knownModel: ['ControlNet-v1-1 (normalbae; fp16)'] },
                group: 'Controlnet',
                label: 'Model',
            }),
        }),
    })
}

export const ui_subform_Normal_Preprocessor = () => {
    const form = getCurrentForm()
    return form.groupOpt({
        label: 'Normal Preprocessor',
        startActive: true,
        items: () => ({
            advanced: form.groupOpt({
                label: 'Advanced Preprocessor Settings',
                items: () => ({
                    type: form.choice({
                        label: 'Type',
                        default: 'MiDaS',
                        items: {
                            MiDaS: () => ui_subform_Normal_Midas(),
                            bae: () => ui_subform_Normal_bae(),
                        },
                    }),
                    // TODO: Add support for auto-modifying the resolution based on other form selections
                    // TODO: Add support for auto-cropping
                }),
            }),
        }),
    })
}

export const ui_subform_Normal_Midas = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'MiDaS Normal',
        items: () => ({
            ...cnet_preprocessor_ui_common(form),
            a_value: form.float({ default: 6.28 }),
            bg_threshold: form.float({ default: 0.1 }),
        }),
    })
}

export const ui_subform_Normal_bae = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'BAE Normal',
        items: () => ({
            ...cnet_preprocessor_ui_common(form),
        }),
    })
}

// 🅿️ Normal RUN ===================================================
export const run_cnet_Normal = (
    Normal: OutputFor<typeof ui_subform_Normal>,
    image: _IMAGE,
    resolution: 512 | 768 | 1024 = 512,
): {
    image: _IMAGE
    cnet_name: Enum_ControlNetLoader_control_net_name
} => {
    const run = getCurrentRun()
    const graph = run.nodes
    const cnet_name = Normal.cnet_model_name

    // PREPROCESSOR - Normal ===========================================================
    if (Normal.preprocessor) {
        if (Normal.preprocessor.advanced?.type.bae) {
            const bae = Normal.preprocessor.advanced.type.bae
            image = graph.BAE$7NormalMapPreprocessor({
                image: image,
                resolution: resolution,
            })._IMAGE
            if (bae.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\Normal\\bae' })
            else graph.PreviewImage({ images: image })
        } else {
            const midas = Normal.preprocessor.advanced?.type.MiDaS
            image = graph.MiDaS$7NormalMapPreprocessor({
                image: image,
                resolution: resolution,
                a: midas?.a_value ?? 6.28,
                bg_threshold: midas?.bg_threshold ?? 0.1,
            })._IMAGE
            if (midas?.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\Normal\\midas' })
            else graph.PreviewImage({ images: image })
        }
    }

    return { cnet_name, image }
}
