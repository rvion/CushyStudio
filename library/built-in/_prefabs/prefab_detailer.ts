import { type OutputFor } from './_prefabs'
import { ui_sampler } from './prefab_sampler'

const facePositiveDefault = 'perfect face, beautiful, masterpiece, hightly detailed, sharp details'
const faceNegativeDefault = 'bad face, bad anatomy, bad details'
const handPositiveDefault = 'hand, perfect fingers, perfect anatomy, hightly detailed, sharp details'
const handNegativeDefault = 'bad hand, bad anatomy, bad details'
const eyePositiveDefault = 'eyes, perfect eyes, perfect anatomy, hightly detailed, sharp details'
const eyeNegativeDefault = 'bad eyes, bad anatomy, bad details'

export const ui_refiners = () => {
    const form = getCurrentForm()
    return form.fields(
        {
            refinerType: form.choices({
                appearance: 'tab',
                requirements: [
                    //
                    { type: 'customNodesByTitle', title: 'ComfyUI Impact Pack' },
                ],
                items: {
                    faces: form.fields(
                        {
                            prompt: form.string({ default: facePositiveDefault }),
                            detector: form.enum.Enum_UltralyticsDetectorProvider_model_name({
                                default: 'bbox/face_yolov8m.pt',
                                requirements: [
                                    { type: 'customNodesByTitle', title: 'ComfyUI Impact Pack' },
                                    { type: 'modelInManager', modelName: 'face_yolov8m (bbox)', optional: true },
                                    { type: 'modelInManager', modelName: 'face_yolov8n (bbox)', optional: true },
                                    { type: 'modelInManager', modelName: 'face_yolov8s (bbox)', optional: true },
                                    { type: 'modelInManager', modelName: 'face_yolov8n_v2 (bbox)', optional: true },
                                ],
                            }),
                        },
                        {
                            startCollapsed: true,
                            summary: (ui) => {
                                return `prompt:${ui.prompt} detector:${ui.detector}`
                            },
                        },
                    ),
                    hands: form.fields(
                        {
                            prompt: form.string({ default: handPositiveDefault }),
                            detector: form.enum.Enum_UltralyticsDetectorProvider_model_name({
                                default: 'bbox/hand_yolov8s.pt',
                                requirements: [
                                    { type: 'customNodesByTitle', title: 'ComfyUI Impact Pack' },
                                    { type: 'modelInManager', modelName: 'hand_yolov8n (bbox)' },
                                    { type: 'modelInManager', modelName: 'hand_yolov8s (bbox)' },
                                ],
                            }),
                        },
                        {
                            startCollapsed: true,
                            summary: (ui) => {
                                return `prompt:${ui.prompt} detector:${ui.detector}`
                            },
                        },
                    ),
                    eyes: form.fields(
                        {
                            prompt: form.string({
                                default: eyePositiveDefault,
                            }),
                        },
                        {
                            startCollapsed: true,
                            summary: (ui) => {
                                return `prompt:${ui.prompt}`
                            },
                            requirements: [
                                { type: 'customNodesByTitle', title: 'ComfyUI Impact Pack' },
                                { type: 'customNodesByTitle', title: 'CLIPSeg' },
                            ],
                        },
                    ),
                },
            }),
            settings: form.fields(
                {
                    sampler: ui_sampler({ denoise: 0.6, steps: 20, cfg: 7, sampler_name: 'euler' }),
                },
                {
                    startCollapsed: true,
                    summary: (ui) => {
                        return `denoise:${ui.sampler.denoise} steps:${ui.sampler.steps} cfg:${ui.sampler.cfg} sampler:${ui.sampler.sampler_name}/$${ui.sampler.scheduler}`
                    },
                },
            ),
        },
        {
            summary: (ui) => {
                return `${ui.refinerType.faces ? 'FACE' : ''} ${ui.refinerType.hands ? 'HANDS' : ''} ${
                    ui.refinerType.hands ? 'EYES' : ''
                }`
            },
        },
    )
}

export const run_refiners_fromLatent = (
    //
    ui: OutputFor<typeof ui_refiners>,
    latent: _LATENT = getCurrentRun().AUTO,
): _IMAGE => {
    const run = getCurrentRun()
    const graph = run.nodes
    const image: _IMAGE = graph.VAEDecode({ samples: latent, vae: run.AUTO })
    return run_refiners_fromImage(ui, image)
}

export const run_refiners_fromImage = (
    //
    ui: OutputFor<typeof ui_refiners>,
    finalImage: _IMAGE = getCurrentRun().AUTO,
): _IMAGE => {
    const run = getCurrentRun()
    const graph = run.nodes
    // run.add_saveImage(run.AUTO, 'base')
    let image = graph.ImpactImageBatchToImageList({ image: finalImage })._IMAGE

    const { faces, hands, eyes } = ui.refinerType
    if (faces || hands || eyes) {
        run.add_previewImage(finalImage)
    }
    if (faces) {
        const facePrompt = faces.prompt
        const provider = graph.UltralyticsDetectorProvider({ model_name: faces.detector })
        const x = graph.FaceDetailer({
            image,
            bbox_detector: provider._BBOX_DETECTOR,
            seed: ui.settings.sampler?.seed ?? run.randomSeed(),
            model: run.AUTO,
            clip: run.AUTO,
            vae: run.AUTO,
            denoise: ui.settings.sampler.denoise,
            steps: ui.settings.sampler.steps,
            sampler_name: ui.settings.sampler.sampler_name,
            scheduler: ui.settings.sampler.scheduler,
            cfg: ui.settings.sampler.cfg,
            positive: graph.CLIPTextEncode({ clip: run.AUTO, text: facePrompt }),
            negative: graph.CLIPTextEncode({ clip: run.AUTO, text: faceNegativeDefault }),
            sam_detection_hint: 'center-1', // ❓
            sam_mask_hint_use_negative: 'False',
            wildcard: '',
            // force_inpaint: false,
            // sampler_name: 'ddim',
            // scheduler: 'ddim_uniform',
        })
        // run.add_saveImage(x.outputs.image)

        image = x.outputs.image
    }
    if (hands) {
        const handsPrompt = hands.prompt
        const provider = graph.UltralyticsDetectorProvider({ model_name: hands.detector })
        const x = graph.FaceDetailer({
            image,
            bbox_detector: provider._BBOX_DETECTOR,
            seed: ui.settings.sampler.seed,
            model: run.AUTO,
            clip: run.AUTO,
            vae: run.AUTO,
            denoise: ui.settings.sampler.denoise,
            steps: ui.settings.sampler.steps,
            sampler_name: ui.settings.sampler.sampler_name,
            scheduler: ui.settings.sampler.scheduler,
            cfg: ui.settings.sampler.cfg,
            positive: graph.CLIPTextEncode({ clip: run.AUTO, text: handsPrompt }),
            negative: graph.CLIPTextEncode({ clip: run.AUTO, text: handNegativeDefault }),
            sam_detection_hint: 'center-1', // ❓
            sam_mask_hint_use_negative: 'False',
            wildcard: '',
            // force_inpaint: false,
            // sampler_name: 'ddim',
            // scheduler: 'ddim_uniform',
        })
        // run.add_saveImage(x.outputs.image)
        image = x.outputs.image
    }
    //might work, but needs
    if (eyes) {
        const eyesPrompt = eyes.prompt
        const mask = graph.CLIPSeg({
            image: image,
            text: 'eyes',
            blur: 5,
            threshold: 0.01,
            dilation_factor: 5,
        })
        //const preview = graph.PreviewImage({ images: mask.outputs.Heatmap$_Mask })

        const detailer = graph.DetailerForEachDebug({
            image,
            segs: graph.MaskToSEGS({
                mask: mask._MASK,
                combined: true,
                crop_factor: 3,
                bbox_fill: false,
                drop_size: 10,
                contour_fill: false,
            }),
            model: run.AUTO,
            clip: run.AUTO,
            vae: run.AUTO,
            denoise: ui.settings.sampler.denoise,
            steps: ui.settings.sampler.steps,
            sampler_name: ui.settings.sampler.sampler_name,
            scheduler: ui.settings.sampler.scheduler,
            cfg: ui.settings.sampler.cfg,
            guide_size: 128,
            positive: graph.CLIPTextEncode({ clip: run.AUTO, text: eyesPrompt }),
            negative: graph.CLIPTextEncode({ clip: run.AUTO, text: eyeNegativeDefault }),
            wildcard: '',
        })
        image = detailer.outputs.image
    }

    // run.add_saveImage(x.outputs.cropped_refined)
    // run.add_saveImage(x.outputs.cropped_enhanced_alpha)
    // run.add_PreviewMask(x._MASK)
    // run.add_saveImage(x.outputs.cnet_images)

    return image
}
