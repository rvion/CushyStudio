import type { OutputFor } from '../../_prefabs'
import type { Cnet_args } from '../../prefab_cnet'

import { ipAdapterDoc } from './_ipAdapterDoc'
import { ipAdapter_faceID_ClipModelList, ipAdapter_faceID_LoraList, ipAdapterModelList } from './_ipAdapterModelList'
import { ui_ipadapter_CLIPSelection, ui_subform_IPAdapter_common } from './_ipAdapterUtils'
import { ui_ipadapter_modelSelection } from './ui_ipadapter_modelSelection'

// 🅿️ IPAdapter FaceID ===================================================
export const ui_IPAdapterFaceID = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'FaceID IPAdapter',
        requirements: [{ type: 'customNodesByTitle', title: 'ComfyUI_IPAdapter_plus' }],
        items: () => ({
            help: form.markdown({ startCollapsed: true, markdown: ipAdapterDoc }),
            models: form.group({
                label: 'Select or Download Models',
                // startCollapsed: true,
                items: () => ({
                    ...ui_ipadapter_CLIPSelection(form),
                    ...ui_ipadapter_modelSelection(
                        form,
                        // @ts-ignore
                        'ip-adapter-faceid-plusv2_sd15.bin',
                        //'ip-adapter-plus-face_sd15.safetensors',
                        // 'ip-adapter-faceid-plus_sd15.bin',
                        ipAdapter_faceID_ClipModelList,
                    ),
                    lora: form.enum.Enum_LoraLoader_lora_name({
                        // enumName: 'Enum_AV$_CheckpointModelsToParametersPipe_lora_1_name',
                        // @ts-ignore
                        default: 'ip-adapter-faceid-plusv2_sd15_lora.safetensors',
                        label: 'Face ID Lora',
                        recommandedModels: {
                            modelFolderPrefix: 'models/lora',
                            knownModel: ipAdapter_faceID_LoraList,
                        },
                        tooltip:
                            'Select the same LORA as the model. So for ip-adapter-faceid-plus, select ip-adapter-faceid-plus_sd15_lora',
                    }),
                }),
            }),

            lora_strength: form.float({ default: 0.5, min: 0, max: 2, step: 0.1 }),
            ...ui_subform_IPAdapter_common(form),
            reinforce: form.groupOpt({
                startCollapsed: true,
                label: 'Reinforce With Additional IPAdapter',
                tooltip:
                    'Enabling will apply an additional IPAdapter. This usually makes faces more accurate, but pulls along more features from the face image.',
                items: () => ({
                    help: form.markdown({
                        startCollapsed: true,
                        markdown: `Recommended to select a model with "face" in it but NOT "faceID". So ip-adapter-plus-face_sd15 for example.\nAlso keep the strength pretty low. Like 0.3 unless you want the image dominated by the face image style.`,
                    }),
                    ...ui_ipadapter_modelSelection(form, 'ip-adapter-plus-face_sd15.safetensors', ipAdapterModelList),
                    ...ui_subform_IPAdapter_common(form, 0.3),
                }),
            }),
        }),
    })
}

// 🅿️ IPAdapter FaceID RUN ===================================================
export const run_cnet_IPAdapterFaceID = (
    IPAdapter: OutputFor<typeof ui_IPAdapterFaceID>,
    cnet_args: Cnet_args,
    image: _IMAGE,
): {
    ip_adapted_model: _MODEL
} => {
    const run = getCurrentRun()
    const graph = run.nodes
    const ip = IPAdapter

    let ckpt = cnet_args.ckptPos
    ckpt = graph.LoraLoader({
        model: ckpt,
        clip: run.AUTO,
        strength_clip: ip.lora_strength,
        strength_model: ip.lora_strength,
        lora_name: ip.models.lora,
    })

    const ip_clip_name = graph.CLIPVisionLoader({ clip_name: ip.models.clip_name })

    const faceIDnode = graph.IPAdapterApplyFaceID({
        ipadapter: graph.IPAdapterModelLoader({ ipadapter_file: ip.models.cnet_model_name }),
        clip_vision: ip_clip_name,
        insightface: graph.InsightFaceLoader({ provider: 'CPU' }),
        image: image,
        model: ckpt,
        weight: ip.strength,
        weight_v2: ip.strength,
        faceid_v2: true,
        noise: ip.settings.noise,
        weight_type: 'original',
        start_at: ip.settings.startAtStepPercent,
        end_at: ip.settings.endAtStepPercent,
        unfold_batch: ip.settings?.unfold_batch,
    })

    ckpt = faceIDnode._MODEL

    if (ip.reinforce) {
        const ip_model = graph.IPAdapterModelLoader({ ipadapter_file: ip.reinforce.cnet_model_name })
        const ip_adapted_model = graph.IPAdapterApply({
            ipadapter: ip_model,
            clip_vision: ip_clip_name,
            image: image,
            model: ckpt,
            weight: ip.reinforce.strength,
            noise: ip.reinforce.settings.noise,
            weight_type: 'original',
            start_at: ip.reinforce.settings.startAtStepPercent,
            end_at: ip.reinforce.settings.endAtStepPercent,
            unfold_batch: ip.reinforce.settings.unfold_batch,
        })._MODEL
        ckpt = ip_adapted_model
    }

    return { ip_adapted_model: ckpt }
}
