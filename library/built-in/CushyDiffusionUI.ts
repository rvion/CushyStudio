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
import { ui_sampler_advanced, type UI_Sampler_Advanced } from './_prefabs/prefab_sampler_advanced'
import { ui_upscaleWithModel } from './_prefabs/prefab_upscaleWithModel'
import { ui_watermark_v1, type UI_watermark_v1 } from './_prefabs/prefab_watermark'
import { ui_customSave, type UI_customSave } from './_prefabs/saveSmall'
import { sampleNegative, samplePrompts } from './samplePrompts'

export type CushyDiffusionUI_ = {
    positive: X.XPrompt
    negative: X.XPrompt
    model: UI_Model
    latent: UI_LatentV3
    sampler: UI_Sampler_Advanced
    customSave: UI_customSave
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
            default: samplePrompts.tree,
            presets: [
                //
                { label: 'Portrait', icon: 'mdiFaceWoman', apply: (w) => w.setText('portrait, face') },
                { label: 'Landscape', icon: 'mdiImageFilterHdr', apply: (w) => w.setText('landscape, nature') },
                { label: 'Tree', icon: 'mdiTree', apply: (w) => w.setText(samplePrompts.tree) },
                { label: 'Abstract', icon: 'mdiShape', apply: (w) => w.setText('abstract, art') },
            ],
        }),
        negative: ui.prompt({
            icon: 'mdiMinusBoxOutline',
            startCollapsed: true,
            default: 'bad quality, blurry, low resolution, pixelated, noisy',
            box: { base: { hue: 0, chroma: 0.05 } },
            presets: [
                { icon: 'mdiCloseOctagon', label: 'simple negative', apply: (w) => w.setText(sampleNegative.simpleNegative) },
                {
                    icon: 'mdiCloseOctagon',
                    label: 'simple negative + nsfw',
                    apply: (w) => w.setText(sampleNegative.simpleNegativeNsfw),
                },
            ],
        }),
        model: ui_model(),
        latent: ui_latent_v3(),
        sampler: ui_sampler_advanced(),
        customSave: ui_customSave(),
        controlnets: ui_cnet(),
        ipAdapter: ui_IPAdapterV2().optional(),
        faceID: ui_IPAdapterFaceIDV2().optional(),
        extra: extra(ui),
    }
}

// ================================================================================

export type UI_extra = X.XChoices<{
    show3d: UI_3dDisplacement
    regionalPrompt: UI_regionalPrompting_v1
    removeBG: UI_rembg_v1
    mask: UI_Mask
    highResFix: UI_HighResFix
    upscaleWithModel: X.XGroup<{ model: X.XEnum<Enum_UpscaleModelLoader_model_name> }>
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
            show3d: ui_3dDisplacement(),
            regionalPrompt: ui_regionalPrompting_v1(),
            mask: ui_mask(),
            removeBG: ui_rembg_v1(),
            highResFix: ui_highresfix(),
            upscaleWithModel: ui_upscaleWithModel(), //.withConfig({ label: 'Model' }),
            refine: ui_refiners(),
            reversePositiveAndNegative: ui.empty({
                label: 'swap +/-',
                tooltip: 'swap the positive and negative prompts. USE AT YOUR OWN RISK.',
            }),
            makeAVideo: ui.empty({
                icon: 'mdiMessageVideo',
                tooltip: 'generate a video from all the generated images in that step ',
            }),
            summary: ui.empty({
                icon: 'mdiLanguageMarkdown',
                tooltip: 'outputs a markdown summary about the execution and outputs',
            }),
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
