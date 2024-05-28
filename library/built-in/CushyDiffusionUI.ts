import type { FormBuilder } from '../../src/CUSHY'

import { ui_cnet } from './_controlNet/prefab_cnet'
import { ui_IPAdapterV2 } from './_ipAdapter/prefab_ipAdapter_baseV2'
import { ui_IPAdapterFaceIDV2 } from './_ipAdapter/prefab_ipAdapter_faceV2'
import { ui_highresfix } from './_prefabs/_prefabs'
import { ui_3dDisplacement } from './_prefabs/prefab_3dDisplacement'
import { ui_refiners } from './_prefabs/prefab_detailer'
import { ui_latent_v3 } from './_prefabs/prefab_latent_v3'
import { ui_mask } from './_prefabs/prefab_mask'
import { ui_model } from './_prefabs/prefab_model'
import { ui_advancedPrompt } from './_prefabs/prefab_promptsWithButtons'
import { ui_recursive } from './_prefabs/prefab_recursive'
import { ui_regionalPrompting_v1 } from './_prefabs/prefab_regionalPrompting_v1'
import { ui_rembg_v1 } from './_prefabs/prefab_rembg'
import { ui_sampler } from './_prefabs/prefab_sampler'
import { ui_upscaleWithModel } from './_prefabs/prefab_upscaleWithModel'
import { ui_watermark_v1 } from './_prefabs/prefab_watermark'
import { ui_customSave } from './_prefabs/saveSmall'

export const CushyDiffusionUI = (form: FormBuilder) => ({
    // modelType: form.selectOne({
    //     appearance: 'tab',
    //     choices: [{ id: 'SD 1.5' }, { id: 'SDXL' }],
    // }),
    positive: form.prompt({
        icon: 'mdiBatteryPositive',
        // check: (v) => [
        //     //
        //     v.text.length > 10 || 'too short',
        //     v.text.length < 20 || 'too long',
        // ],
        default: [
            //
            'masterpiece, tree',
            '?color, ?3d_term, ?adj_beauty, ?adj_general',
            '(nature)*0.9, (intricate_details)*1.1',
        ].join('\n'),
    }),
    negative: form.prompt({
        startCollapsed: true,
        default: 'bad quality, blurry, low resolution, pixelated, noisy',
    }),
    model: ui_model(),
    latent: ui_latent_v3(),
    mask: ui_mask(),
    sampler: ui_sampler(),
    highResFix: ui_highresfix().optional(true),
    upscale: ui_upscaleWithModel().optional(),
    customSave: ui_customSave(),
    removeBG: ui_rembg_v1(),
    show3d: ui_3dDisplacement().optional(),
    controlnets: ui_cnet(),
    ipAdapter: ui_IPAdapterV2().optional(),
    faceID: ui_IPAdapterFaceIDV2().optional(),
    extra: form.choices({
        appearance: 'tab',
        items: {
            regionalPrompt: ui_regionalPrompting_v1(),
            refine: ui_refiners(),
            reversePositiveAndNegative: form.group({ label: 'swap +/-' }),
            makeAVideo: form.group(),
            summary: form.group(),
            gaussianSplat: form.group(),
            promtPlus: ui_advancedPrompt(),
            displayAsBeerCan: form.group({}),
            recursiveImgToImg: ui_recursive(),
            watermark: ui_watermark_v1(),
            fancyWatermark: form.group(),
        },
    }),
})
