import { ui_highresfix, type UI_HighResFix } from './_prefabs/_prefabs'
import { ui_3dDisplacement, type UI_3dDisplacement } from './_prefabs/prefab_3dDisplacement'
import { ui_refiners, type UI_Refiners } from './_prefabs/prefab_detailer'
import { ui_mask, type UI_Mask } from './_prefabs/prefab_mask'
import { ui_advancedPrompt, type UI_advancedPrompt } from './_prefabs/prefab_promptsWithButtons'
import { ui_recursive, type UI_recursive } from './_prefabs/prefab_recursive'
import { ui_regionalPrompting_v1, type UI_regionalPrompting_v1 } from './_prefabs/prefab_regionalPrompting_v1'
import { ui_rembg_v1, type UI_rembg_v1 } from './_prefabs/prefab_rembg'
import { ui_upscaleWithModel } from './_prefabs/prefab_upscaleWithModel'
import { ui_watermark_v1, type UI_watermark_v1 } from './_prefabs/prefab_watermark'

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
export function extra(ui: X.Builder): UI_extra {
    return ui.choices(
        {
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
        { appearance: 'tab', icon: 'mdiAlien' },
    )
}
