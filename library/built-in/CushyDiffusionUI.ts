import type { Schema } from '../../src/controls/Schema'
import type { Field_group } from '../../src/csuite/fields/group/FieldGroup'

import { ui_cnet, type UI_cnet } from './_controlNet/prefab_cnet'
import { ui_IPAdapterV2, type UI_IPAdapterV2 } from './_ipAdapter/prefab_ipAdapter_baseV2'
import { ui_IPAdapterFaceIDV2, type UI_IPAdapterFaceIDV2 } from './_ipAdapter/prefab_ipAdapter_faceV2'
import { ui_highresfix, type UI_HighResFix } from './_prefabs/_prefabs'
import { ui_3dDisplacement, type UI_3dDisplacement } from './_prefabs/prefab_3dDisplacement'
import { ui_refiners, type UI_Refiners } from './_prefabs/prefab_detailer'
import { ui_latent_v3, type UI_LatentV3 } from './_prefabs/prefab_latent_v3'
import { ui_mask, type UI_Mask } from './_prefabs/prefab_mask'
import { ui_model, type UI_Model } from './_prefabs/prefab_model'
import { ui_advancedPrompt, type UI_advancedPrompt } from './_prefabs/prefab_promptsWithButtons'
import { ui_recursive, type UI_recursive } from './_prefabs/prefab_recursive'
import { ui_regionalPrompting_v1, type UI_regionalPrompting_v1 } from './_prefabs/prefab_regionalPrompting_v1'
import { ui_rembg_v1, type UI_rembg_v1 } from './_prefabs/prefab_rembg'
import { ui_sampler, type UI_Sampler } from './_prefabs/prefab_sampler'
import { ui_upscaleWithModel } from './_prefabs/prefab_upscaleWithModel'
import { ui_watermark_v1, type UI_watermark_v1 } from './_prefabs/prefab_watermark'
import { ui_customSave, type UI_customSave } from './_prefabs/saveSmall'

export type CushyDiffusionUI_ = {
    positive: X.XPrompt
    negative: X.XPrompt
    model: UI_Model
    latent: UI_LatentV3
    sampler: UI_Sampler
    mask: UI_Mask
    upscaleV2: X.XChoices<{
        highResFix: UI_HighResFix
        upscaleWithModel: Schema<
            Field_group<{
                model: X.XEnum<Enum_UpscaleModelLoader_model_name>
            }>
        >
    }>
    customSave: UI_customSave
    removeBG: UI_rembg_v1
    show3d: X.XOptional<UI_3dDisplacement>
    controlnets: UI_cnet
    ipAdapter: X.XOptional<UI_IPAdapterV2>
    faceID: X.XOptional<UI_IPAdapterFaceIDV2>
    extra: UI_extra
}

export function CushyDiffusionUI(ui: X.Builder): CushyDiffusionUI_ {
    return {
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
        extra: extra(ui),
    }
}

// ================================================================================

export type UI_extra = X.XChoices<{
    regionalPrompt: UI_regionalPrompting_v1
    refine: UI_Refiners
    reversePositiveAndNegative: X.XEmpty
    makeAVideo: X.XEmpty
    summary: X.XEmpty
    gaussianSplat: X.XEmpty
    promtPlus: UI_advancedPrompt
    displayAsBeerCan: X.XEmpty
    displayAsSpriteSheet: X.XEmpty
    recursiveImgToImg: UI_recursive
    watermark: UI_watermark_v1
    fancyWatermark: X.XEmpty
}>

function extra(ui: X.Builder): UI_extra {
    return ui.choices({
        appearance: 'tab',
        icon: 'mdiAlien',
        items: {
            regionalPrompt: ui_regionalPrompting_v1(),
            refine: ui_refiners(),
            reversePositiveAndNegative: ui.empty({ label: 'swap +/-' }),
            makeAVideo: ui.empty({ icon: 'mdiMessageVideo' }),
            summary: ui.empty({ icon: 'mdiLanguageMarkdown' }),
            gaussianSplat: ui.empty({ icon: 'mdiDotsHexagon' }),
            promtPlus: ui_advancedPrompt(),
            displayAsBeerCan: ui.empty({ icon: 'mdiBeerOutline' }),
            displayAsSpriteSheet: ui.empty({ icon: 'mdiMovie' }),
            recursiveImgToImg: ui_recursive(),
            watermark: ui_watermark_v1(),
            fancyWatermark: ui.empty({ icon: 'mdiWatermark' }),
        },
    })
}
