import type { OutputFor } from './_prefabs'

import { ui_model_kohyaDeepShrink, type UI_model_kohyaDeepShrink } from './prefab_model_kohyaDeepShrink'
import { ui_model_pag, type UI_model_pag } from './prefab_model_pag'
import { ui_model_sag, type UI_model_sag } from './prefab_model_sag'

export type UI_Model = X.XGroup<{
    modelType: X.XChoice<{
        Diffusion: X.XGroup<{
            ckpt_name: X.XEnum<Enum_CheckpointLoaderSimple_ckpt_name>
        }>
        SD3: X.XGroup<{
            ckpt_name: X.XEnum<Enum_CheckpointLoaderSimple_ckpt_name>
            clip1: X.XEnum<Enum_TripleCLIPLoader_clip_name1>
            clip2: X.XEnum<Enum_TripleCLIPLoader_clip_name2>
            clip3: X.XEnum<Enum_TripleCLIPLoader_clip_name3>
        }>
        FLUX: X.XGroup<{
            ckpt_name: X.XEnum<Enum_UNETLoader_unet_name>
            weight_type: X.XEnum<Enum_UNETLoader_weight_dtype>
            clip1: X.XEnum<Enum_DualCLIPLoader_clip_name1>
            clip2: X.XEnum<Enum_DualCLIPLoader_clip_name2>
            type: X.XEnum<Enum_DualCLIPLoader_type>
        }>
    }>
    checkpointConfig: X.XOptional<X.XEnum<Enum_CheckpointLoader_config_name>>
    extra: X.XChoices<{
        checkpointConfig: X.XEnum<Enum_CheckpointLoader_config_name>
        rescaleCFG: X.XNumber
        vae: X.XEnum<Enum_VAELoader_vae_name>
        clipSkip: X.XNumber
        freeU: X.XGroup<X.SchemaDict>
        freeUv2: X.XGroup<X.SchemaDict>
        pag: UI_model_pag
        sag: UI_model_sag
        KohyaDeepShrink: UI_model_kohyaDeepShrink
        civitai_ckpt_air: X.XString
    }>
}>

// UI -----------------------------------------------------------
export function ui_model(): UI_Model {
    const form = getCurrentForm()
    const ckpts = cushy.managerRepository.getKnownCheckpoints()
    return form.group({
        // border: true,
        box: { base: { hue: 240, chroma: 0.03 } },
        icon: 'mdiFlaskEmptyPlusOutline',
        presets: [
            // 💬 2024-08-06 rvion:
            // | this preset was a fake one, only here
            // | to show how to create a multi-step preset
            // ⏸️ {
            // ⏸️     label: 'withPopup',
            // ⏸️     icon: 'mdiTrain',
            // ⏸️     apply: (w): void => {
            // ⏸️         const form = cushy.forms.entity((ui) =>
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
                        checkpointConfig: undefined,
                        modelType: { Diffusion: { ckpt_name: 'albedobaseXL_v21.safetensors' } },
                        extra: { clipSkip: 2 },
                    }
                },
            },
            {
                icon: 'mdiStar',
                label: '(1.5) revAnimated122',
                apply: (w): void => {
                    w.setValue({
                        checkpointConfig: undefined,
                        modelType: { Diffusion: { ckpt_name: 'revAnimated_v122.safetensors' } },
                        extra: {},
                    })
                },
            },
            {
                icon: 'mdiStar',
                label: 'SD3',
                apply: (w): void => {
                    w.setValue({
                        checkpointConfig: undefined,
                        modelType: {
                            SD3: {
                                // ⏸️ type: 'sd3',
                                ckpt_name: 'SD3_medium.safetensors' as Enum_CheckpointLoaderSimple_ckpt_name,
                                clip1: 't5xxl_fp18_e4m3fn.safetensors' as Enum_TripleCLIPLoader_clip_name1,
                                clip2: 'clip_l.safetensors',
                                clip3: 'clip_g.safetensors' as Enum_TripleCLIPLoader_clip_name3,
                            },
                        },
                        extra: { vae: undefined },
                    })
                },
            },
            {
                icon: 'mdiStar',
                label: 'FLUX',
                apply: (w): void => {
                    w.setValue({
                        checkpointConfig: undefined,
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
        label: 'Model',
        summary: (ui) => {
            let out: string =
                ui.modelType.Diffusion?.ckpt_name ?? ui.modelType.SD3?.ckpt_name ?? ui.modelType.FLUX?.ckpt_name ?? 'Empty'
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
            modelType: form.choice({
                items: {
                    Diffusion: form.fields({
                        ckpt_name: form.enum
                            .Enum_CheckpointLoaderSimple_ckpt_name({ label: 'Checkpoint' })
                            .addRequirements(ckpts.map((x) => ({ type: 'modelCustom', infos: x }))),
                    }),
                    SD3: form
                        .fields({
                            ckpt_name: form.enum.Enum_CheckpointLoaderSimple_ckpt_name({ label: 'Checkpoint' }),
                            clip1: form.enum.Enum_TripleCLIPLoader_clip_name1({ default: 't5xxl_fp16.safetensors' }),
                            clip2: form.enum.Enum_TripleCLIPLoader_clip_name2({ default: 'clip_l.safetensors' }),
                            clip3: form.enum.Enum_TripleCLIPLoader_clip_name3({ default: 'clip_g.safetensors' }),
                        })
                        .addRequirements([
                            //
                        ]),
                    FLUX: form
                        .fields({
                            ckpt_name: form.enum.Enum_UNETLoader_unet_name({ default: 'flux1-dev.sft' }),
                            weight_type: form.enum.Enum_UNETLoader_weight_dtype({ label: 'Weight Type', default: 'fp8_e4m3fn' }),
                            clip1: form.enum
                                .Enum_DualCLIPLoader_clip_name1({ default: 't5xxl_fp16.safetensors' })
                                .addRequirementOnComfyManagerModel('google-t5/t5-v1_1-xxl_encoderonly-fp16')
                                .addRequirementOnComfyManagerModel('google-t5/t5-v1_1-xxl_encoderonly-fp8_e4m3fn'),
                            clip2: form.enum
                                .Enum_DualCLIPLoader_clip_name2({ default: 'clip_l.safetensors' })
                                .addRequirementOnComfyManagerModel('comfyanonymous/clip_l'),
                            type: form.enum.Enum_DualCLIPLoader_type({ default: 'flux' }),
                        })
                        .addRequirements([
                            { type: 'modelInManager', modelName: 'FLUX.1 VAE model' },
                            { type: 'modelInManager', modelName: 'FLUX.1 [schnell] Diffusion model' },
                            { type: 'modelInManager', modelName: 'kijai/FLUX.1 [dev] Diffusion model (float8_e4m3fn)' },
                            { type: 'modelInManager', modelName: 'kijai/FLUX.1 [schnell] Diffusion model (float8_e4m3fn)' },
                            { type: 'modelInManager', modelName: 'Comfy Org/FLUX.1 [dev] Checkpoint model (fp8)' },
                            { type: 'modelInManager', modelName: 'Comfy Org/FLUX.1 [schnell] Checkpoint model (fp8)' },
                        ]),
                },
                appearance: 'tab',
            }),
            checkpointConfig: form.enumOpt.Enum_CheckpointLoader_config_name({ label: 'Config' }),
            extra: form.choices({
                border: false,
                // label: false,
                appearance: 'tab',
                items: {
                    checkpointConfig: form.enum.Enum_CheckpointLoader_config_name({ label: 'Config' }),
                    rescaleCFG: form.float({ min: 0, max: 2, softMax: 1, default: 0.75 }),
                    vae: form.enum.Enum_VAELoader_vae_name(),
                    clipSkip: form.int({ label: 'Clip Skip', default: 1, min: 1, max: 5 }),
                    freeU: form.group(),
                    freeUv2: form.group(),
                    pag: ui_model_pag(form),
                    sag: ui_model_sag(form),
                    KohyaDeepShrink: ui_model_kohyaDeepShrink(form),
                    civitai_ckpt_air: form
                        .string({
                            tooltip: 'Civitai checkpoint Air, as found on the civitai Website. It should look like this: 43331@176425', // prettier-ignore
                            label: 'Civitai Ref',
                            placeHolder: 'e.g. 43331@176425',
                        })
                        .addRequirements([{ type: 'customNodesByNameInCushy', nodeName: 'CivitAI$_Checkpoint$_Loader' }]),
                },
            }),
        },
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
    if (ui.modelType.Diffusion) {
        if (ui.checkpointConfig) {
            const ckptLoader = graph.CheckpointLoader({
                ckpt_name: ui.modelType.Diffusion.ckpt_name,
                config_name: ui.checkpointConfig,
            })
            ckpt = ckptLoader._MODEL
            clip = ckptLoader._CLIP
            vae = ckptLoader._VAE
        } else if (ui.extra.civitai_ckpt_air) {
            const ckptLoader = graph.CivitAI$_Checkpoint$_Loader({
                ckpt_name: ui.modelType.Diffusion.ckpt_name,
                ckpt_air: ui.extra.civitai_ckpt_air,
                download_path: 'models\\checkpoints',
            })
            ckpt = ckptLoader._MODEL
            clip = ckptLoader._CLIP
            vae = ckptLoader._VAE
        } else {
            const ckptLoader = graph.CheckpointLoaderSimple({ ckpt_name: ui.modelType.Diffusion.ckpt_name })
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

export const run_model_modifiers = (
    ui: OutputFor<typeof ui_model>,
    ckpt: _MODEL,
    forHiRes?: boolean,
    kohyaScale?: number,
): _MODEL => {
    const run = getCurrentRun()
    const graph = run.nodes
    // 5. Optional SAG - Self Attention Guidance
    if (ui.extra.sag && ((!forHiRes && ui.extra.sag.include.base) || (forHiRes && ui.extra.sag.include.hiRes))) {
        ckpt = graph.SelfAttentionGuidance({ scale: ui.extra.sag.scale, blur_sigma: ui.extra.sag.blur_sigma, model: ckpt })
    }
    // 6. Optional PAG - Perturbed Attention Guidance
    if (ui.extra.pag && ((!forHiRes && ui.extra.pag.include.base) || (forHiRes && ui.extra.pag.include.hiRes))) {
        ckpt = graph.PerturbedAttention({ scale: ui.extra.pag.scale, model: ckpt, adaptive_scale: ui.extra.pag.adaptiveScale })
    }
    // 7. Kohya Deepshrink
    if (
        ui.extra.KohyaDeepShrink &&
        ((!forHiRes && ui.extra.KohyaDeepShrink.include.base) || (forHiRes && ui.extra.KohyaDeepShrink.include.hiRes))
    ) {
        const setScale = forHiRes ? kohyaScale : (ui.extra.KohyaDeepShrink.advancedSettings.downscaleFactor ?? 2)
        const set = ui.extra.KohyaDeepShrink.advancedSettings
        ckpt = graph.PatchModelAddDownscale({
            downscale_factor: setScale,
            model: ckpt,
            block_number: set.block_number,
            start_percent: set.startPercent,
            end_percent: set.endPercent,
            downscale_after_skip: set.downscaleAfterSkip,
            downscale_method: set.downscaleMethod,
            upscale_method: set.upscaleMethod,
        })
    }
    return ckpt
}
