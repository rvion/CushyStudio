import { ui_cnet, type UI_cnet } from '../_controlNet/prefab_cnet'
import { type $extra1, extra1 } from '../_extra/extra1'
import { type $extra2, extra2 } from '../_extra/extra2'
import { ui_IPAdapterV2, type UI_IPAdapterV2 } from '../_ipAdapter/prefab_ipAdapter_baseV2'
import { ui_IPAdapterFaceIDV2, type UI_IPAdapterFaceIDV2 } from '../_ipAdapter/prefab_ipAdapter_faceV2'
import { ui_latent_v3, type UI_LatentV3 } from '../_prefabs/prefab_latent_v3'
import { ui_sampler_advanced, type UI_Sampler_Advanced } from '../_prefabs/prefab_sampler_advanced'
import { ui_customSave, type UI_customSave } from '../_prefabs/saveSmall'
import { sampleNegative, samplePrompts } from '../samplePrompts'
import { type $prefabModelSD15andSDXL, prefabModelSD15andSDXL } from '../SD15/_model_SD15_SDXL'

export type $CushySDXLUI = X.XGroup<{
    positive: X.XPrompt
    negative: X.XPrompt
    model: $prefabModelSD15andSDXL
    latent: UI_LatentV3
    sampler: UI_Sampler_Advanced
    customSave: UI_customSave
    controlnets: UI_cnet
    ipAdapter: X.XOptional<UI_IPAdapterV2>
    faceID: X.XOptional<UI_IPAdapterFaceIDV2>
    extra: $extra1
    extra2: $extra2
}>

// type K = $CushySDXLUI['$Field']

export function CushySDXLUI(ui: X.Builder): $CushySDXLUI {
    return ui.fields({
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
        model: prefabModelSD15andSDXL({
            ckpt_name: 'albedobaseXL_v21.safetensors',
        }).addRequirements({
            // just for Lorn
            type: 'modelInCivitai',
            civitaiModelId: '889818',
            // civitaiModelId: 'https://civitai.com/api/download/models/889818',
            // civitaiURL: 'https://civitai.com/models/795765/illustrious-xl',
            base: 'SDXL',
            optional: true,
        }),
        latent: ui_latent_v3({
            size: { default: { modelType: 'SDXL 1024' } },
        }),
        sampler: ui_sampler_advanced(),
        customSave: ui_customSave(),
        controlnets: ui_cnet(),
        ipAdapter: ui_IPAdapterV2().optional(),
        faceID: ui_IPAdapterFaceIDV2().optional(),
        extra: extra1(),
        extra2: extra2(),
    })
}
