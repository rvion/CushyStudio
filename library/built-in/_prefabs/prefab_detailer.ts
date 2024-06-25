import { type OutputFor } from './_prefabs'
import { ui_sampler, type UI_Sampler } from './prefab_sampler'

const facePositiveDefault = 'perfect face, beautiful, masterpiece, hightly detailed, sharp details'
const faceNegativeDefault = 'bad face, bad anatomy, bad details'
const handPositiveDefault = 'hand, perfect fingers, perfect anatomy, hightly detailed, sharp details'
const handNegativeDefault = 'bad hand, bad anatomy, bad details'
const eyePositiveDefault = 'eyes, perfect eyes, perfect anatomy, hightly detailed, sharp details'
const eyeNegativeDefault = 'bad eyes, bad anatomy, bad details'

export type UI_Refiners = X.XGroup<{
    refinerType: X.XChoices<{
        faces: X.XGroup<{
            prompt: X.XString
            detector: X.XEnum<Enum_UltralyticsDetectorProvider_model_name>
        }>
        hands: X.XGroup<{
            prompt: X.XString
            detector: X.XEnum<Enum_UltralyticsDetectorProvider_model_name>
        }>
        eyes: X.XGroup<{ prompt: X.XString }>
    }>
    settings: X.XGroup<{
        sampler: UI_Sampler
        sam: X.XOptional<
            X.XGroup<{
                model_name: X.XEnum<Enum_SAMLoader_model_name>
                device_mode: X.XEnum<Enum_BLIPCaption_device_mode>
            }>
        >
    }>
}>
export function ui_refiners(): UI_Refiners {
    const form = getCurrentForm()
    return form.fields(
        {
            refinerType: form
                .choices({
                    appearance: 'tab',
                    items: {
                        // FACES -------------------------------------------------------
                        faces: form
                            .fields(
                                {
                                    prompt: form.string({ default: facePositiveDefault, textarea: true }),
                                    detector: form.enum.Enum_UltralyticsDetectorProvider_model_name({
                                        default: 'bbox/face_yolov8m.pt',
                                    }),
                                },
                                {
                                    startCollapsed: true,
                                    summary: (ui) => `prompt:${ui.prompt} detector:${ui.detector}`,
                                },
                            )
                            .addRequirements([
                                { type: 'customNodesByTitle', title: 'ComfyUI Impact Pack' },
                                { type: 'modelInManager', modelName: 'face_yolov8m (bbox)', optional: true },
                                { type: 'modelInManager', modelName: 'face_yolov8n (bbox)', optional: true },
                                { type: 'modelInManager', modelName: 'face_yolov8s (bbox)', optional: true },
                                { type: 'modelInManager', modelName: 'face_yolov8n_v2 (bbox)', optional: true },
                            ]),
                        // HANDS -------------------------------------------------------
                        hands: form
                            .fields(
                                {
                                    prompt: form.string({ default: handPositiveDefault, textarea: true }),
                                    detector: form.enum.Enum_UltralyticsDetectorProvider_model_name({
                                        default: 'bbox/hand_yolov8s.pt',
                                    }),
                                },
                                {
                                    startCollapsed: true,
                                    summary: (ui) => `prompt:${ui.prompt} detector:${ui.detector}`,
                                },
                            )
                            .addRequirements([
                                { type: 'customNodesByTitle', title: 'ComfyUI Impact Pack' },
                                { type: 'modelInManager', modelName: 'hand_yolov8n (bbox)' },
                                { type: 'modelInManager', modelName: 'hand_yolov8s (bbox)' },
                            ]),
                        // EYES -------------------------------------------------------
                        eyes: form
                            .fields(
                                { prompt: form.string({ default: eyePositiveDefault, textarea: true }) },
                                { startCollapsed: true, summary: (ui) => `prompt:${ui.prompt}` },
                            )
                            .addRequirements([
                                { type: 'customNodesByTitle', title: 'ComfyUI Impact Pack' },
                                { type: 'customNodesByTitle', title: 'CLIPSeg' },
                            ]),
                    },
                })
                .addRequirements([{ type: 'customNodesByTitle', title: 'ComfyUI Impact Pack' }]),
            settings: form.fields(
                {
                    sampler: ui_sampler({ denoise: 0.6, steps: 20, cfg: 7, sampler_name: 'euler' }),
                    sam: form
                        .fields(
                            {
                                model_name: form.enum.Enum_SAMLoader_model_name({ default: 'sam_vit_b_01ec64.pth' }),
                                device_mode: form.enum.Enum_SAMLoader_device_mode({ default: 'AUTO' }),
                            },
                            {
                                startCollapsed: true,
                                tooltip: 'Enabling defines the bounding boxes more clearly rather than a square box',
                                summary: (ui) => {
                                    return `model:${ui.model_name}`
                                },
                            },
                        )
                        .optional(),
                },
                {
                    startCollapsed: true,
                    summary: (ui) => {
                        return `sam:${ui.sam ? 'on' : 'off'} denoise:${ui.sampler.denoise} steps:${ui.sampler.steps} cfg:${
                            ui.sampler.cfg
                        } sampler:${ui.sampler.sampler_name}/$${ui.sampler.scheduler}`
                    },
                },
            ),
        },
        {
            summary: (ui) => {
                return `Refiners ${ui.refinerType.faces ? 'FACE' : ''} ${ui.refinerType.hands ? 'HANDS' : ''} ${
                    ui.refinerType.eyes ? 'EYES' : ''
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
    ckpt?: _MODEL,
    maxRes?: number,
    face_prompt_override?: Maybe<string>,
    eye_prompt_override?: Maybe<string>,
): _IMAGE => {
    const run = getCurrentRun()
    const graph = run.nodes
    // run.add_saveImage(run.AUTO, 'base')
    let image = finalImage
    const { faces, hands, eyes } = ui.refinerType
    if (faces || hands || eyes) {
        run.add_previewImage(finalImage)
        image = graph.ImpactImageBatchToImageList({ image: finalImage })._IMAGE
        let samLoader: SAMLoader | undefined
        if ((faces || hands) && ui.settings.sam)
            samLoader = graph.SAMLoader({ model_name: ui.settings.sam.model_name, device_mode: ui.settings.sam.device_mode })
        if (faces) {
            const facePrompt = faces.prompt
            const provider = graph.UltralyticsDetectorProvider({ model_name: faces.detector })
            const x = graph.FaceDetailer({
                image,
                bbox_detector: provider._BBOX_DETECTOR,
                sam_model_opt: samLoader?._SAM_MODEL,
                seed: ui.settings.sampler?.seed ?? run.randomSeed(),
                model: ckpt ?? run.AUTO,
                clip: run.AUTO,
                vae: run.AUTO,
                denoise: ui.settings.sampler.denoise,
                steps: ui.settings.sampler.steps,
                sampler_name: ui.settings.sampler.sampler_name,
                scheduler: ui.settings.sampler.scheduler,
                cfg: ui.settings.sampler.cfg,
                positive: graph.CLIPTextEncode({ clip: run.AUTO, text: face_prompt_override ?? facePrompt }),
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
                sam_model_opt: samLoader?._SAM_MODEL,
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
        if (eyes) {
            const eyesPrompt = eyes.prompt || 'eyes, perfect eyes, perfect anatomy, hightly detailed, sharp details'

            const faceMesh = graph.MediaPipe$7FaceMeshPreprocessor({ image, max_faces: 10, min_confidence: 0.5, resolution: 512 })
            const meshPreview = graph.PreviewImage({ images: faceMesh._IMAGE })
            const segs = graph.MediaPipeFaceMeshToSEGS({ image: faceMesh._IMAGE, left_eye: true, right_eye: true, face: false })
            const mask = graph.SegsToCombinedMask({ segs: segs._SEGS })
            const combinedSegs = graph.MaskToSEGS({ mask: mask._MASK, combined: true })

            const preview = graph.PreviewImage({ images: graph.Convert_Masks_to_Images({ masks: mask._MASK }) })

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
                seed: ui.settings.sampler.seed,
                denoise: ui.settings.sampler.denoise,
                steps: ui.settings.sampler.steps,
                sampler_name: ui.settings.sampler.sampler_name,
                scheduler: ui.settings.sampler.scheduler,
                cfg: ui.settings.sampler.cfg,
                guide_size: 128,
                positive: graph.CLIPTextEncode({ clip: run.AUTO, text: eye_prompt_override ?? eyesPrompt }),
                negative: graph.CLIPTextEncode({ clip: run.AUTO, text: 'bad eyes, bad anatomy, bad details' }),
                wildcard: '',
            })
            image = detailer.outputs.image
        }
    }
    // run.add_saveImage(x.outputs.cropped_refined)
    // run.add_saveImage(x.outputs.cropped_enhanced_alpha)
    // run.add_PreviewMask(x._MASK)
    // run.add_saveImage(x.outputs.cnet_images)

    return image
}
