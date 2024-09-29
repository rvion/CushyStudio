import type { OutputFor } from './_prefabs'
import type { $prefab_model_extras } from './prefab_model_extras'

import { prefab_model_SD15 } from '../SD15/prefab_model_SD15'
import { prefab_diffusion_SD3 } from '../SD3/prefab_model_SD3'
import { prefab_diffusion_FLUX } from './prefab_model_flux'

export type UI_Model = X.XGroup<{
    modelType: X.XChoice<{
        SD15: X.XGroup<{
            ckpt_name: X.XEnum<Enum_CheckpointLoaderSimple_ckpt_name>
            extra: $prefab_model_extras
        }>
        SD3: X.XGroup<{
            ckpt_name: X.XEnum<Enum_CheckpointLoaderSimple_ckpt_name>
            clip1: X.XEnum<Enum_TripleCLIPLoader_clip_name1>
            clip2: X.XEnum<Enum_TripleCLIPLoader_clip_name2>
            clip3: X.XEnum<Enum_TripleCLIPLoader_clip_name3>
            extra: $prefab_model_extras
        }>
        FLUX: X.XGroup<{
            ckpt_name: X.XEnum<Enum_UNETLoader_unet_name>
            weight_type: X.XEnum<Enum_UNETLoader_weight_dtype>
            clip1: X.XEnum<Enum_DualCLIPLoader_clip_name1>
            clip2: X.XEnum<Enum_DualCLIPLoader_clip_name2>
            type: X.XEnum<Enum_DualCLIPLoader_type>
            extra: $prefab_model_extras
        }>
    }>
    checkpointConfig2: X.XOptional<X.XEnum<Enum_CheckpointLoader_config_name>>
    // extra: $prefab_model_extras // TODO: remove
}>

// UI -----------------------------------------------------------
export function ui_model(): UI_Model {
    const form = getCurrentForm()
    const ckpts = cushy.managerRepository.getKnownCheckpoints()
    return form.group({
        // border: true,
        box: { base: { hue: 240, chroma: 0.03 } },
        icon: 'mdiFlaskEmptyPlusOutline',
        label: 'Model',
        summary: (ui) => {
            let out: string =
                ui.modelType.SD15?.ckpt_name ?? ui.modelType.SD3?.ckpt_name ?? ui.modelType.FLUX?.ckpt_name ?? 'Empty'
            if (ui.extra.freeU) out += ' + FreeU'
            if (ui.extra.freeUv2) out += ' + FreeUv2'
            if (ui.extra.vae) out += ' + VAE'
            if (ui.extra.clipSkip) out += ` + ClipSkip(${ui.extra.clipSkip})`
            if (ui.extra.pag) out += ` + PAG(${ui.extra.pag.scale})`
            if (ui.extra.sag) out += ` + SAG(${ui.extra.sag.scale}/${ui.extra.sag.blur_sigma})`
            // 💬 2024-05-30 rvion:
            // | changed the summary when Kohya DeepShrink is enabled.
            // | Was causing some error (not able to convert ui.extra.KohyaDeepShrink to string)
            // | automatically
            if (ui.extra.KohyaDeepShrink) out += ` + Shrink(...)` // ${ui.extra.KohyaDeepShrink}
            return out
        },
        items: {
            modelType: form.choice(
                {
                    SD15: prefab_model_SD15(),
                    SDXL: prefab_model_SD15(),
                    SD3: prefab_diffusion_SD3(),
                    FLUX: prefab_diffusion_FLUX(),
                },
                { appearance: 'tab' },
            ),
            // checkpointConfig2: form.enumOpt.Enum_CheckpointLoader_config_name({ label: 'Config' }),
        },
        presets: [
            // 💬 2024-08-06 rvion:
            // | this preset was a fake one, only here
            // | to show how to create a multi-step preset
            // ⏸️ {
            // ⏸️     label: 'withPopup',
            // ⏸️     icon: 'mdiTrain',
            // ⏸️     apply: (w): void => {
            // ⏸️         const form = cushy.forms.document((ui) =>
            // ⏸️             ui.fields({
            // ⏸️                 a: ui.string({ label: 'A' }),
            // ⏸️                 b: ui.int({ label: 'B' }),
            // ⏸️             }),
            // ⏸️         )
            // ⏸️         cushy.activityManager.start({
            // ⏸️             title: 'Multi-Step preset Demo',
            // ⏸️             shell: 'popup-lg',
            // ⏸️             UI: (p) =>
            // ⏸️                 form.render({
            // ⏸️                     submitAction: () => {
            // ⏸️                         console.log('submit')
            // ⏸️                         cushy.activityManager.stop(p.routine) // 🔴
            // ⏸️                     },
            // ⏸️                 }),
            // ⏸️         })
            // ⏸️     },
            // ⏸️ },
            {
                icon: 'mdiStar',
                label: '(XL) albedobase21',
                apply: (w): void => {
                    w.value = {
                        checkpointConfig2: undefined,
                        modelType: { SDXL: { ckpt_name: 'albedobaseXL_v21.safetensors', extra: { clipSkip: 2 } } },
                    }
                },
            },
            {
                icon: 'mdiStar',
                label: '(1.5) revAnimated122',
                apply: (w): void => {
                    w.setValue({
                        checkpointConfig2: undefined,
                        modelType: { SD15: { ckpt_name: 'revAnimated_v122.safetensors', extra: {} } },
                    })
                },
            },
            {
                icon: 'mdiStar',
                label: 'SD3',
                apply: (w): void => {
                    w.setValue({
                        checkpointConfig2: undefined,
                        modelType: {
                            SD3: {
                                // ⏸️ type: 'sd3',
                                ckpt_name: 'SD3_medium.safetensors' as Enum_CheckpointLoaderSimple_ckpt_name,
                                clip1: 't5xxl_fp18_e4m3fn.safetensors' as Enum_TripleCLIPLoader_clip_name1,
                                clip2: 'clip_l.safetensors',
                                clip3: 'clip_g.safetensors' as Enum_TripleCLIPLoader_clip_name3,
                                extra: { vae: undefined },
                            },
                        },
                    })
                },
            },
            {
                icon: 'mdiStar',
                label: 'FLUX',
                apply: (w): void => {
                    w.setValue({
                        checkpointConfig2: undefined,
                        modelType: {
                            FLUX: {
                                type: 'flux',
                                ckpt_name: 'flux1-dev.sft' as Enum_UNETLoader_unet_name,
                                weight_type: 'fp8_e4m3fn',
                                clip1: 't5xxl_fp16.safetensors' as Enum_DualCLIPLoader_clip_name1,
                                clip2: 'clip_l.safetensors' as Enum_DualCLIPLoader_clip_name2,
                            },
                        },
                        extra: { vae: 'ae.sft' as Enum_VAELoader_vae_name },
                    })
                },
            },
        ],
    })
}

// RUN -----------------------------------------------------------
export function run_model(ui: OutputFor<typeof ui_model>): {
    ckpt: _MODEL
    vae: _VAE
    clip: _CLIP
} {
    const run = getCurrentRun()
    const graph = run.nodes

    // 1. MODEL
    let ckpt: _MODEL
    let clip: _CLIP
    let vae: _VAE | undefined = undefined
    if (ui.modelType.SD15) {
        const extra = ui.modelType.SD15.extra
        if (extra.checkpointConfig) {
            const ckptLoader = graph.CheckpointLoader({
                ckpt_name: ui.modelType.SD15.ckpt_name,
                config_name: extra.checkpointConfig,
            })
            ckpt = ckptLoader._MODEL
            clip = ckptLoader._CLIP
            vae = ckptLoader._VAE
        } else if (extra.civitai_ckpt_air) {
            const ckptLoader = graph.CivitAI$_Checkpoint$_Loader({
                ckpt_name: ui.modelType.SD15.ckpt_name,
                ckpt_air: extra.civitai_ckpt_air,
                download_path: 'models\\checkpoints',
            })
            ckpt = ckptLoader._MODEL
            clip = ckptLoader._CLIP
            vae = ckptLoader._VAE
        } else {
            const ckptLoader = graph.CheckpointLoaderSimple({ ckpt_name: ui.modelType.SD15.ckpt_name })
            ckpt = ckptLoader._MODEL
            clip = ckptLoader._CLIP
            vae = ckptLoader._VAE
        }
    } else if (ui.modelType.SD3) {
        const ckptLoader = graph.CheckpointLoaderSimple({
            ckpt_name: ui.modelType.SD3.ckpt_name,
        })
        ckpt = ckptLoader._MODEL
        vae = ckptLoader._VAE
        const clipLoader = graph.TripleCLIPLoader({
            clip_name1: ui.modelType.SD3.clip1,
            clip_name2: ui.modelType.SD3.clip2,
            clip_name3: ui.modelType.SD3.clip3,
        })
        clip = clipLoader._CLIP
        ckpt = graph.ModelSamplingSD3({ model: ckpt, shift: 3 })
    } else if (ui.modelType.FLUX) {
        const ckptLoader = graph.UNETLoader({
            unet_name: ui.modelType.FLUX.ckpt_name,
            weight_dtype: ui.modelType.FLUX.weight_type,
        })
        ckpt = ckptLoader._MODEL
        const clipLoader = graph.DualCLIPLoader({
            clip_name1: ui.modelType.FLUX.clip1,
            clip_name2: ui.modelType.FLUX.clip2,
            type: ui.modelType.FLUX.type,
        })
        clip = clipLoader._CLIP
        //Flux requires a vae to be selected
        if (!ui.extra.vae) {
            throw new Error('No VAE selected')
        }
    } else {
        throw new Error(`Unknown model type: ${ui.modelType}`)
    }

    // 2. OPTIONAL CUSTOM VAE
    if (ui.extra.vae) vae = graph.VAELoader({ vae_name: ui.extra.vae })
    if (vae === undefined) {
        throw new Error('No VAE loaded')
    }
    // 3. OPTIONAL CLIP SKIP
    if (ui.extra.clipSkip) clip = graph.CLIPSetLastLayer({ clip, stop_at_clip_layer: -Math.abs(ui.extra.clipSkip) })

    // 4. Optional FreeU
    if (ui.extra.freeUv2) ckpt = graph.FreeU$_V2({ model: ckpt })
    else if (ui.extra.freeU) ckpt = graph.FreeU({ model: ckpt })

    /* Rescale CFG */
    if (ui.extra.rescaleCFG) {
        ckpt = graph.RescaleCFG({ model: ckpt, multiplier: ui.extra.rescaleCFG })
    }

    return { ckpt, vae, clip }
}

// export const run_model_modifiers = (
//     ui: OutputFor<typeof ui_model>,
//     ckpt: _MODEL,
//     forHiRes?: boolean,
//     kohyaScale?: number,
// ): _MODEL => {
//     const run = getCurrentRun()
//     const graph = run.nodes
//     // 5. Optional SAG - Self Attention Guidance
//     if (ui.extra.sag && ((!forHiRes && ui.extra.sag.include.base) || (forHiRes && ui.extra.sag.include.hiRes))) {
//         ckpt = graph.SelfAttentionGuidance({ scale: ui.extra.sag.scale, blur_sigma: ui.extra.sag.blur_sigma, model: ckpt })
//     }

//     // 6. Optional PAG - Perturbed Attention Guidance
//     if (ui.extra.pag && ((!forHiRes && ui.extra.pag.include.base) || (forHiRes && ui.extra.pag.include.hiRes))) {
//         ckpt = graph.PerturbedAttention({ scale: ui.extra.pag.scale, model: ckpt, adaptive_scale: ui.extra.pag.adaptiveScale })
//     }

//     // 7. Kohya Deepshrink
//     if (ui.extra.KohyaDeepShrink) {
//         ckpt = run_model_kohyaDeepShrink(ui.extra.KohyaDeepShrink, ckpt, forHiRes, kohyaScale)
//     }
//     return ckpt
// }
