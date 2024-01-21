import type { FormBuilder } from 'src'
import type { OutputFor } from '../_prefabs'
import { cnet_preprocessor_ui_common, cnet_ui_common } from '../prefab_cnet'

// 🅿️ SoftEdge FORM ===================================================
export const ui_subform_SoftEdge = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'SoftEdge',
        items: () => ({
            ...cnet_ui_common(form),
            preprocessor: ui_subform_SoftEdge_Preprocessor(form),
            cnet_model_name: form.enum({
                label: 'Model',
                enumName: 'Enum_ControlNetLoader_control_net_name',
                default: { value: 'control_v11p_sd15_softedge.pth' },
                recommandedModels: {
                    knownModel: ['ControlNet-v1-1 (softedge; fp16)', 'controlnet-SargeZT/controlnet-sd-xl-1.0-softedge-dexined'],
                },
            }),
        }),
    })
}

export const ui_subform_SoftEdge_Preprocessor = (form: FormBuilder) => {
    return form.groupOpt({
        label: 'SoftEdge Edge Preprocessor',
        startActive: true,
        items: () => ({
            advanced: form.groupOpt({
                label: 'Advanced Preprocessor Settings',
                items: () => ({
                    type: form.choice({
                        label: 'Type',
                        items: {
                            HED: () => ui_subform_SoftEdge_Preprocessor_Options(form),
                            PiDiNet: () => ui_subform_SoftEdge_Preprocessor_Options(form),
                        },
                    }),
                    // TODO: Add support for auto-modifying the resolution based on other form selections
                    // TODO: Add support for auto-cropping
                }),
            }),
        }),
    })
}

export const ui_subform_SoftEdge_Preprocessor_Options = (form: FormBuilder) => {
    return form.group({
        label: 'SoftEdge Preprocessor',
        items: () => ({
            ...cnet_preprocessor_ui_common(form),
            safe: form.bool({ default: false }),
        }),
    })
}

// 🅿️ SoftEdge RUN ===================================================
export const run_cnet_SoftEdge = (
    SoftEdge: OutputFor<typeof ui_subform_SoftEdge>,
    image: _IMAGE,
    resolution: 512 | 768 | 1024 = 512,
): {
    image: _IMAGE
    cnet_name: Enum_ControlNetLoader_control_net_name
} => {
    const run = getCurrentRun()
    const graph = run.nodes
    const cnet_name = SoftEdge.cnet_model_name

    // PREPROCESSOR - SoftEdge ===========================================================
    if (SoftEdge.preprocessor?.advanced?.type.PiDiNet) {
        var pid = SoftEdge.preprocessor.advanced?.type.PiDiNet
        image = graph.PiDiNetPreprocessor({
            image: image,
            resolution: resolution,
            safe: pid.safe ? 'enable' : 'disable',
        })._IMAGE
        if (pid.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\SoftEdge\\pid' })
        else graph.PreviewImage({ images: image })
    } else {
        var hed = SoftEdge.preprocessor?.advanced?.type.HED
        image = graph.HEDPreprocessor({
            image: image,
            resolution: resolution,
            safe: !hed || hed?.safe ? 'enable' : 'disable',
        })._IMAGE
        if (hed?.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\SoftEdge\\hed' })
        else graph.PreviewImage({ images: image })
    }
    return { cnet_name, image }
}
