import type { OutputFor } from './_prefabs'

export const ui_refiners = () => {
    const form = getCurrentForm()
    return form.choices({
        appearance: 'tab',
        requirements: [
            //
            { type: 'customNodesByTitle', title: 'ComfyUI Impact Pack' },
        ],
        items: {
            faces: form.group({
                items: () => ({
                    prompt: form.string({}),
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
                }),
            }),
            hands: form.group({
                items: () => ({
                    prompt: form.string({}),
                    detector: form.enum.Enum_UltralyticsDetectorProvider_model_name({
                        default: 'bbox/hand_yolov8s.pt',
                        requirements: [
                            { type: 'customNodesByTitle', title: 'ComfyUI Impact Pack' },
                            { type: 'modelInManager', modelName: 'hand_yolov8n (bbox)' },
                            { type: 'modelInManager', modelName: 'hand_yolov8s (bbox)' },
                        ],
                    }),
                }),
            }),
            eyes: form.enumOpt.Enum_UltralyticsDetectorProvider_model_name({}),
        },
    })
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
    let image = finalImage

    const { faces, hands, eyes } = ui
    if (faces || hands || eyes) {
        run.add_previewImage(finalImage)
    }
    if (faces) {
        const facePrompt = faces.prompt || 'perfect face, beautiful, masterpiece, hightly detailed, sharp details'
        const x = graph.FaceDetailer({
            image: graph.ImpactImageBatchToImageList({ image: finalImage }),
            bbox_detector: (t) => t.UltralyticsDetectorProvider({ model_name: faces.detector }),
            seed: run.randomSeed(),
            model: run.AUTO,
            clip: run.AUTO,
            vae: run.AUTO,
            denoise: 0.6,
            steps: 20,
            sampler_name: 'euler',
            scheduler: 'sgm_uniform',
            positive: graph.CLIPTextEncode({ clip: run.AUTO, text: facePrompt }),
            negative: graph.CLIPTextEncode({ clip: run.AUTO, text: 'bad face, bad anatomy, bad details' }),
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
        const handsPrompt = hands.prompt || 'hand, perfect fingers, perfect anatomy, hightly detailed, sharp details'
        const x = graph.FaceDetailer({
            image: graph.ImpactImageBatchToImageList({ image: finalImage }),
            bbox_detector: (t) => t.UltralyticsDetectorProvider({ model_name: hands.detector }),
            seed: run.randomSeed(),
            model: run.AUTO,
            clip: run.AUTO,
            vae: run.AUTO,
            denoise: 0.6,
            steps: 20,
            sampler_name: 'euler',
            scheduler: 'sgm_uniform',
            positive: graph.CLIPTextEncode({ clip: run.AUTO, text: handsPrompt }),
            negative: graph.CLIPTextEncode({ clip: run.AUTO, text: 'bad hand, bad anatomy, bad details' }),
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
    // if (eyes) {
    //     const eyesPrompt = eyes.prompt || 'eyes, perfect eyes, perfect anatomy, hightly detailed, sharp details'
    //     const x = graph.FaceDetailer({
    // }

    // run.add_saveImage(x.outputs.cropped_refined)
    // run.add_saveImage(x.outputs.cropped_enhanced_alpha)
    // run.add_PreviewMask(x._MASK)
    // run.add_saveImage(x.outputs.cnet_images)

    return image
}
