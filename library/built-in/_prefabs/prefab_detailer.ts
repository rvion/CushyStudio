export const ui_improveFace = () => {
    const form = getCurrentForm()
    return form.groupOpt({
        customNodes: 'ComfyUI Impact Pack',
        items: () => ({
            faces: form.enum({
                //
                enumName: 'Enum_UltralyticsDetectorProvider_model_name',
                default: {
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

export const run_improveFace = (finalImage: _IMAGE = getCurrentRun().AUTO): _IMAGE => {
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
        denoise: 0.6,
        steps: 20,
        sampler_name: 'ddim',
        // scheduler: 'karras',
        scheduler: 'ddim_uniform',
        positive: graph.CLIPTextEncode({ clip: run.AUTO, text: 'perfect face, masterpiece, hightly detailed, smiling' }),
        negative: run.AUTO,
        sam_detection_hint: 'center-1', // ❓
        sam_mask_hint_use_negative: 'False',
        wildcard: '',
    })
    return x.outputs.image
}
