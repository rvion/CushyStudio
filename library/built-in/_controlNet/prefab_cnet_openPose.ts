import type { OutputFor } from '../_prefabs/_prefabs'

import { cnet_preprocessor_ui_common, cnet_ui_common } from './cnet_ui_common'

// 🅿️ OPEN POSE FORM ===================================================
export type UI_subform_OpenPose = X.XGroup<{
    preprocessor: UI_subform_OpenPose_Preprocessor
    cnet_model_name: X.XEnum<Enum_ControlNetLoader_control_net_name>
    strength: X.XNumber
    advanced: X.XGroup<{
        startAtStepPercent: X.XNumber
        endAtStepPercent: X.XNumber
        crop: X.XEnum<Enum_LatentUpscale_crop>
        upscale_method: X.XEnum<Enum_ImageScale_upscale_method>
    }>
}>

export function ui_subform_OpenPose(): UI_subform_OpenPose {
    const form: X.Builder = getCurrentForm()
    return form
        .fields(
            {
                ...cnet_ui_common(form),
                preprocessor: ui_subform_OpenPose_Preprocessor(),
                cnet_model_name: form.enum.Enum_ControlNetLoader_control_net_name({
                    label: 'Model',
                    // @ts-ignore
                    default: 't2iadapter_openpose_sd14v1.pth',
                    filter: (name) => name.toString().includes('pose'),
                    extraDefaults: ['t2iadapter_openpose_sd14v1.pth', 'control_v11p_sd15_openpose.pth'],
                    recommandedModels: {
                        knownModel: [
                            'T2I-Adapter (openpose)',
                            'ControlNet-v1-1 (openpose; fp16)',
                            'SDXL-controlnet: OpenPose (v2)',
                        ],
                    },
                }),
            },
            { label: 'Pose' },
        )
        .addRequirements([{ type: 'customNodesByTitle', title: 'ComfyUI-Advanced-ControlNet' }])
}

// ================================================================================================

type UI_subform_OpenPose_Preprocessor = X.XChoice<{
    None: X.XEmpty
    DWPose: X.XGroup<{
        detect_body: X.XBool
        detect_face: X.XBool
        detect_hand: X.XBool
        bbox_detector: X.XEnum<Enum_DWPreprocessor$_Provider$_for$_SEGS_$3$3Inspire_bbox_detector>
        pose_estimator: X.XEnum<Enum_DWPreprocessor$_Provider$_for$_SEGS_$3$3Inspire_pose_estimator>
        saveProcessedImage: X.XBool
    }>
    OpenPose: X.XGroup<{
        detect_body: X.XBool
        detect_face: X.XBool
        detect_hand: X.XBool
        saveProcessedImage: X.XBool
    }>
}>

function ui_subform_OpenPose_Preprocessor(): UI_subform_OpenPose_Preprocessor {
    const form: X.Builder = getCurrentForm()
    return form.choice({
        label: 'Preprocessor',
        startCollapsed: true,
        appearance: 'tab',
        items: {
            None: form.empty(),
            DWPose: form.group({
                label: 'Settings',
                startCollapsed: true,
                items: {
                    ...cnet_preprocessor_ui_common(form),
                    detect_body: form.bool({ default: true }),
                    detect_face: form.bool({ default: true }),
                    detect_hand: form.bool({ default: true }),
                    bbox_detector: form.enum.Enum_DWPreprocessor_bbox_detector({
                        label: 'Model',
                        default: 'yolox_l.onnx',
                    }),
                    pose_estimator: form.enum.Enum_DWPreprocessor_pose_estimator({
                        label: 'Model',
                        default: 'dw-ll_ucoco_384.onnx',
                    }),
                },
            }),
            OpenPose: form.group({
                label: 'Settings',
                startCollapsed: true,
                items: {
                    ...cnet_preprocessor_ui_common(form),
                    detect_body: form.bool({ default: true }),
                    detect_face: form.bool({ default: true }),
                    detect_hand: form.bool({ default: true }),
                },
            }),
            // TODO: Add support for auto-modifying the resolution based on other form selections
            // TODO: Add support for auto-cropping
        },
    })
}

// 🅿️ OPEN POSE RUN ===================================================
export const run_cnet_openPose = (
    openPose: OutputFor<typeof ui_subform_OpenPose>,
    image: _IMAGE,
    resolution: number, // 512 | 768 | 1024 = 512,
): {
    image: _IMAGE
    cnet_name: Enum_ControlNetLoader_control_net_name
} => {
    const run = getCurrentRun()
    const graph = run.nodes
    const cnet_name = openPose.cnet_model_name

    let returnImage = image
    //crop the image to the right size
    //todo: make these editable
    // image = graph.ImageScale({
    //     image,
    //     width: cnet_args.width ?? 512,
    //     height: cnet_args.height ?? 512,
    //     upscale_method: openPose.advanced?.upscale_method ?? 'lanczos',
    //     crop: openPose.advanced?.crop ?? 'center',
    // })._IMAGE

    if (openPose.preprocessor) {
        var opPP = openPose.preprocessor
        if (opPP.OpenPose) {
            returnImage = graph.OpenposePreprocessor({
                image: image,
                detect_body: opPP.OpenPose.detect_body ? 'enable' : 'disable',
                detect_face: opPP.OpenPose.detect_face ? 'enable' : 'disable',
                detect_hand: opPP.OpenPose.detect_hand ? 'enable' : 'disable',
                resolution: resolution,
            })._IMAGE
            if (opPP.OpenPose.saveProcessedImage) graph.SaveImage({ images: returnImage, filename_prefix: 'cnet\\pose\\' })
            else graph.PreviewImage({ images: returnImage })
        } else if (opPP.DWPose) {
            returnImage = graph.DWPreprocessor({
                image: image,
                detect_body: opPP.DWPose.detect_body ? 'enable' : 'disable',
                detect_face: opPP.DWPose.detect_face ? 'enable' : 'disable',
                detect_hand: opPP.DWPose.detect_hand ? 'enable' : 'disable',
                resolution: resolution,
                bbox_detector: opPP.DWPose.bbox_detector,
                pose_estimator: opPP.DWPose.pose_estimator,
            })._IMAGE
            if (opPP.DWPose.saveProcessedImage) graph.SaveImage({ images: returnImage, filename_prefix: 'cnet\\pose\\' })
            else graph.PreviewImage({ images: returnImage })
        }
    }

    return { cnet_name, image: returnImage }
}
