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

export const CushyDiffusionUI = (ui: FormBuilder) => ({
    positive: ui.prompt({
        icon: 'mdiPlusBoxOutline',
        background: { hue: 150, chroma: 0.05 },
        default: [
            'masterpiece, tree',
            '?color, ?3d_term, ?adj_beauty, ?adj_general',
            '(nature)*0.9, (intricate_details)*1.1',
        ].join('\n'),
    }),
    negative: ui.prompt({
        icon: 'mdiMinusBoxOutline',
        startCollapsed: true,
        default: 'bad quality, blurry, low resolution, pixelated, noisy',
        box: { base: { hue: 0, chroma: 0.05 } },
    }),
    model: ui_model(),
    latent: ui_latent_v3(),
    sampler: ui_sampler(),
    mask: ui_mask(),
    upscaleV2: ui.choicesV2(
        {
            highResFix: ui_highresfix(),
            upscaleWithModel: ui_upscaleWithModel().withConfig({ label: 'Model' }),
        },
        { icon: 'mdiArrowExpandAll' },
    ),
    customSave: ui_customSave(),
    removeBG: ui_rembg_v1(),
    show3d: ui_3dDisplacement().optional(),
    controlnets: ui_cnet(),
    ipAdapter: ui_IPAdapterV2().optional(),
    faceID: ui_IPAdapterFaceIDV2().optional(),
    extra: ui.choices({
        appearance: 'tab',
        icon: 'mdiAlien',
        items: {
            regionalPrompt: ui_regionalPrompting_v1(),
            refine: ui_refiners(),
            reversePositiveAndNegative: ui.group({ label: 'swap +/-' }),
            makeAVideo: ui.group(),
            summary: ui.group(),
            gaussianSplat: ui.group(),
            promtPlus: ui_advancedPrompt(),
            displayAsBeerCan: ui.group({}),
            displayAsSpriteSheet: ui.group({}),
            recursiveImgToImg: ui_recursive(),
            watermark: ui_watermark_v1(),
            fancyWatermark: ui.group(),
        },
    }),
})
