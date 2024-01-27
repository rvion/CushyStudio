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
        customNodesByTitle: [
            //
            'ComfyUI_IPAdapter_plus',
        ],
        items: () => ({
            help: form.markdown({ startCollapsed: true, markdown: ipAdapterDoc }),
            ...ui_ipadapter_CLIPSelection(form),
            ...ui_ipadapter_modelSelection(
                form,
                'ip-adapter-plus-face_sd15.safetensors',
                // 'ip-adapter-faceid-plus_sd15.bin',
                ipAdapter_faceID_ClipModelList,
            ),
            lora: form.enum.Enum_Load_Lora_lora_name({
                // enumName: 'Enum_AV$_CheckpointModelsToParametersPipe_lora_1_name',
                default: 'ipadapter\\ip-adapter-faceid_sd15_lora.safetensors',
                label: 'Face ID Lora',
                recommandedModels: {
                    modelFolderPrefix: 'models/lora',
                    knownModel: ipAdapter_faceID_LoraList,
                },
                tooltip:
                    'Select the same LORA as the model. So for ip-adapter-faceid-plus, select ip-adapter-faceid-plus_sd15_lora',
            }),
            lora_strength: form.float({ default: 0.5, min: 0, max: 2, step: 0.1 }),
            ...ui_subform_IPAdapter_common(form),
            includeAdditionalIPAdapter: form.groupOpt({
                startActive: false,
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
    ckpt = graph.Load_Lora({
        model: ckpt,
        clip: run.AUTO,
        strength_clip: ip.lora_strength,
        strength_model: ip.lora_strength,
        lora_name: ip.lora,
    })

    const ip_clip_name = graph.CLIPVisionLoader({ clip_name: ip.clip_name })

    const faceIDnode = graph.IPAdapterApplyFaceID({
        ipadapter: graph.IPAdapterModelLoader({ ipadapter_file: ip.cnet_model_name }),
        clip_vision: ip_clip_name,
        insightface: graph.InsightFaceLoader({ provider: 'CPU' }),
        image: image,
        model: ckpt,
        weight: ip.strength,
        noise: ip.advanced?.noise ?? 0,
        weight_type: 'original',
        start_at: ip.advanced?.startAtStepPercent ?? 0.33,
        end_at: ip.advanced?.endAtStepPercent ?? 1,
        unfold_batch: ip.advanced?.unfold_batch ?? false,
    })

    ckpt = faceIDnode._MODEL

    if (ip.includeAdditionalIPAdapter) {
        const ip_model = graph.IPAdapterModelLoader({ ipadapter_file: ip.includeAdditionalIPAdapter.cnet_model_name })
        const ip_adapted_model = graph.IPAdapterApply({
            ipadapter: ip_model,
            clip_vision: ip_clip_name,
            image: image,
            model: ckpt,
            weight: ip.includeAdditionalIPAdapter.strength,
            noise: ip.includeAdditionalIPAdapter.advanced?.noise ?? 0,
            weight_type: 'original',
            start_at: ip.includeAdditionalIPAdapter.advanced?.startAtStepPercent ?? 0.33,
            end_at: ip.includeAdditionalIPAdapter.advanced?.endAtStepPercent ?? 0.67,
            unfold_batch: ip.includeAdditionalIPAdapter.advanced?.unfold_batch ?? false,
        })._MODEL
        ckpt = ip_adapted_model
    }

    return { ip_adapted_model: ckpt }
}
