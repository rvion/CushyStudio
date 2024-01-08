export const ui_improveFace = () => {
    const form = getCurrentForm()
    return form.groupOpt({
        customNodes: 'ComfyUI Impact Pack',
        items: () => ({
            faces: form.enum({
                //
                enumName: 'Enum_UltralyticsDetectorProvider_model_name',
                default: { value: 'bbox/face_yolov8m.pt' },
                recommandedModels: {
                    knownModel: [
                        //
                        'face_yolov8m (bbox)',
                        'face_yolov8n (bbox)',
                        'face_yolov8s (bbox)',
                        'hand_yolov8n (bbox)',
                        'hand_yolov8s (bbox)',
                        'face_yolov8n_v2 (bbox)',
                    ],
                },
            }),
            eyes: form.enumOpt({
                //
                enumName: 'Enum_UltralyticsDetectorProvider_model_name',
            }),
        }),
    })
}

export const run_improveFace_fromLatent = (latent: _LATENT = getCurrentRun().AUTO): _IMAGE => {
    const run = getCurrentRun()
    const graph = run.nodes
    const image: _IMAGE = graph.VAEDecode({ samples: latent, vae: run.AUTO })
    return run_improveFace_fromImage(image)
}

export const run_improveFace_fromImage = (finalImage: _IMAGE = getCurrentRun().AUTO): _IMAGE => {
    const run = getCurrentRun()
    const graph = run.nodes
    run.add_saveImage(run.AUTO, 'base')
    const x = graph.FaceDetailer({
        image: graph.ImpactImageBatchToImageList({
            image: finalImage,
        }),
        bbox_detector: (t) =>
            t.UltralyticsDetectorProvider({
                model_name: 'bbox/face_yolov8m.pt',
            }),
        seed: run.randomSeed(),
        model: run.AUTO,
        clip: run.AUTO,
        vae: run.AUTO,
        // force_inpaint: false,
        denoise: 0.6,
        steps: 20,
        // sampler_name: 'ddim',
        // scheduler: 'ddim_uniform',
        sampler_name: 'euler',
        scheduler: 'sgm_uniform',
        positive: graph.CLIPTextEncode({
            clip: run.AUTO,
            text: 'perfect face, masterpiece, hightly detailed, sharp details',
        }),
        negative: run.AUTO,
        sam_detection_hint: 'center-1', // ❓
        sam_mask_hint_use_negative: 'False',
        wildcard: '',
    })
    run.add_saveImage(x.outputs.image)
    // run.add_saveImage(x.outputs.cropped_refined)
    // run.add_saveImage(x.outputs.cropped_enhanced_alpha)
    // run.add_PreviewMask(x._MASK)
    // run.add_saveImage(x.outputs.cnet_images)

    return x.outputs.image
}
