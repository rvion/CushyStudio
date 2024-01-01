import type { FormBuilder } from 'src'
import type { OutputFor } from '../_prefabs'
import { Cnet_args, cnet_preprocessor_ui_common, cnet_ui_common } from '../prefab_cnet'

// 🅿️ SoftEdge FORM ===================================================
export const ui_subform_SoftEdge = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'SoftEdge',
        items: () => ({
            ...cnet_ui_common(form),
            preprocessor: ui_subform_SoftEdge_Preprocessor(form),
            cnet_model_name: form.enum({
                enumName: 'Enum_ControlNetLoader_control_net_name',
                default: { knownModel: 'ControlNet-v1-1 (softedge; fp16)' },
                group: 'Controlnet',
                label: 'Model',
            }),
        }),
    })
}

export const ui_subform_SoftEdge_Preprocessor = (form: FormBuilder) => {
    return form.groupOpt({
        label: 'SoftEdge Edge Preprocessor',
        items: () => ({
            type: form.choice({
                label: 'Type',
                items: () => ({
                    HED: ui_subform_SoftEdge_Preprocessor_Options(form),
                    PiDiNet: ui_subform_SoftEdge_Preprocessor_Options(form),
                }),
            }),
            // TODO: Add support for auto-modifying the resolution based on other form selections
            // TODO: Add support for auto-cropping
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
export const run_cnet_SoftEdge = async (SoftEdge: OutputFor<typeof ui_subform_SoftEdge>, cnet_args: Cnet_args) => {
    const run = getCurrentRun()
    const graph = run.nodes
    let image: IMAGE
    const cnet_name = SoftEdge.cnet_model_name
    //crop the image to the right size
    //todo: make these editable
    image = graph.ImageScale({
        image: (await run.loadImageAnswer(SoftEdge.image))._IMAGE,
        width: cnet_args.width ?? 512,
        height: cnet_args.height ?? 512,
        upscale_method: SoftEdge.upscale_method,
        crop: SoftEdge.crop,
    })._IMAGE

    // PREPROCESSOR - SoftEdge ===========================================================
    if (SoftEdge.preprocessor?.type.HED) {
        var hed = SoftEdge.preprocessor.type.HED
        image = graph.HEDPreprocessor({
            image: image,
            resolution: hed.resolution,
            safe: hed.safe ? 'enable' : 'disable',
        })._IMAGE
        if (hed.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\SoftEdge\\hed' })
        else graph.PreviewImage({ images: image })
    } else if (SoftEdge.preprocessor?.type.PiDiNet) {
        var pid = SoftEdge.preprocessor.type.PiDiNet
        image = graph.PiDiNetPreprocessor({
            image: image,
            resolution: pid.resolution,
            safe: pid.safe ? 'enable' : 'disable',
        })._IMAGE
        if (pid.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\SoftEdge\\pid' })
        else graph.PreviewImage({ images: image })
    }

    return { cnet_name, image }
}
