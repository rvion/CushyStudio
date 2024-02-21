import type { FormBuilder } from 'src'
import type { OutputFor } from '../_prefabs'

import { cnet_preprocessor_ui_common, cnet_ui_common } from '../prefab_cnet'

// 🅿️ SoftEdge FORM ===================================================
export const ui_subform_SoftEdge = () => {
    const form: FormBuilder = getCurrentForm()
    return form.group({
        label: 'SoftEdge',
        requirements: [
            { type: 'modelInManager', modelName: 'ControlNet-v1-1 (softedge; fp16)' },
            { type: 'modelInManager', modelName: 'controlnet-SargeZT/controlnet-sd-xl-1.0-softedge-dexined' },
        ],
        items: () => ({
            ...cnet_ui_common(form),
            preprocessor: ui_subform_SoftEdge_Preprocessor(),
            cnet_model_name: form.enum.Enum_ControlNetLoader_control_net_name({
                label: 'Model',
                default: 'control_v11p_sd15_softedge.pth' as any,
                extraDefaults: ['control_v11p_sd15_softedge.pth'],
            }),
        }),
    })
}

export const ui_subform_SoftEdge_Preprocessor = () => {
    const form: FormBuilder = getCurrentForm()
    return form.choice({
        label: 'SoftEdge Edge Preprocessor',
        startCollapsed: true,
        default: 'HED',
        appearance: 'tab',
        items: {
            None: form.group(),
            HED: ui_subform_SoftEdge_Preprocessor_Options(form),
            Pidinet: ui_subform_SoftEdge_Preprocessor_Options(form),
        },
    })
}

export const ui_subform_SoftEdge_Preprocessor_Options = (form: FormBuilder) => {
    return form.group({
        label: 'Settings',
        startCollapsed: true,
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
    resolution: number, // 512 | 768 | 1024 = 512,
): {
    image: _IMAGE
    cnet_name: Enum_ControlNetLoader_control_net_name
} => {
    const run = getCurrentRun()
    const graph = run.nodes
    const cnet_name = SoftEdge.cnet_model_name

    // PREPROCESSOR - SoftEdge ===========================================================
    if (SoftEdge.preprocessor.Pidinet) {
        var pid = SoftEdge.preprocessor.Pidinet
        image = graph.PiDiNetPreprocessor({
            image: image,
            resolution: resolution,
            safe: pid.safe ? 'enable' : 'disable',
        })._IMAGE
        if (pid.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\SoftEdge\\pid' })
        else graph.PreviewImage({ images: image })
    } else if (SoftEdge.preprocessor.HED) {
        var hed = SoftEdge.preprocessor.HED
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
