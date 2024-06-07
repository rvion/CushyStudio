import type { FormBuilder } from '../../../src/CUSHY'
import type { OutputFor } from './_prefabs'

// UI -----------------------------------------------------------
export const ui_model = () => {
    const form = getCurrentForm()
    const ckpts = cushy.managerRepository.getKnownCheckpoints()
    return form.group({
        box: { base: { hue: 240, chroma: 0.03 } },
        icon: 'mdiFlaskEmptyPlusOutline',
        presets: [
            {
                label: 'withPopup',
                icon: 'mdiTrain',
                apply: (w) => {
                    const form = cushy.forms.form((ui) =>
                        ui.fields({
                            a: ui.string({ label: 'A' }),
                            b: ui.int({ label: 'B' }),
                        }),
                    )
                    cushy.activityManager.startActivity({
                        uid: 'test',
                        title: 'Multi-Step preset Demo',
                        shell: 'popup-lg',
                        UI: (p) =>
                            form.render({
                                submitAction: () => {
                                    console.log('submit')
                                    cushy.activityManager.stopActivity(p.activity) // 🔴
                                },
                            }),
                    })
                },
            },
            {
                icon: 'mdiStairsBox',
                label: 'test1',
                apply: (w) => {
                    w.value = {
                        checkpointConfig: undefined,
                        ckpt_name: 'albedobaseXL_v21.safetensors',
                        extra: { clipSkip: 2 },
                    }
                },
            },
            {
                icon: 'mdiAccountMusic',
                label: 'test2',
                apply: (w) => {
                    w.setValue({
                        checkpointConfig: undefined,
                        ckpt_name: 'revAnimated_v122.safetensors',
                        extra: {},
                    })
                },
            },
        ],
        label: 'Model',
        summary: (ui) => {
            let out: string = ui.ckpt_name
            if (ui.extra.freeU) out += ' + FreeU'
            if (ui.extra.freeUv2) out += ' + FreeUv2'
            if (ui.extra.vae) out += ' + VAE'
            if (ui.extra.clipSkip) out += ` + ClipSkip(${ui.extra.clipSkip})`
            if (ui.extra.pag) out += ` + PAG(${ui.extra.pag.scale})`
            if (ui.extra.sag) out += ` + SAG(${ui.extra.sag.scale}/${ui.extra.sag.blur_sigma})`
            // 2024-05-30 rvion:
            // | changed the summary when Kohya DeepShrink is enabled.
            // | Was causing some error (not able to convert ui.extra.KohyaDeepShrink to string)
            // | automatically
            if (ui.extra.KohyaDeepShrink) out += ` + Shrink(...)` // ${ui.extra.KohyaDeepShrink}
            return out
        },
        items: {
            ckpt_name: form.enum
                .Enum_CheckpointLoaderSimple_ckpt_name({ label: 'Checkpoint' })
                .addRequirements(ckpts.map((x) => ({ type: 'modelCustom', infos: x }))),
            checkpointConfig: form.enumOpt.Enum_CheckpointLoader_config_name({ label: 'Config' }),
            extra: form.choices({
                border: false,
                label: false,
                appearance: 'tab',
                items: {
                    rescaleCFG: form.float({ min: 0, max: 2, softMax: 1, default: 0.75 }),
                    vae: form.enum.Enum_VAELoader_vae_name(),
                    clipSkip: form.int({ label: 'Clip Skip', default: 1, min: 1, max: 5 }),
                    freeU: form.group(),
                    freeUv2: form.group(),
                    pag: ui_pag(form),
                    sag: ui_sag(form),
                    KohyaDeepShrink: ui_kohyaDeepShrink(form),
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

const ui_pag = (form: FormBuilder) => {
    return form
        .fields(
            {
                include: form.choices({
                    items: { base: form.fields({}), hiRes: form.fields({}) },
                    appearance: 'tab',
                    default: { base: true, hiRes: false },
                }),
                scale: form.float({
                    default: 3,
                    min: 0,
                    softMax: 6,
                    max: 100,
                    step: 0.1,
                    tooltip:
                        'PAG scale, has some resemblance to CFG scale - higher values can both increase structural coherence of the image and oversaturate/fry it entirely. Note: Default for standard models is 3, but that fries lightning and turbo models, so lower it accordingly. Try 0.9 ish for turbo.',
                }),
                adaptiveScale: form.float({
                    default: 0,
                    min: 0,
                    max: 1,
                    step: 0.1,
                    tooltip:
                        'PAG dampening factor, it penalizes PAG during late denoising stages, resulting in overall speedup: 0.0 means no penalty and 1.0 completely removes PAG.',
                }),
            },
            {
                startCollapsed: true,
                tooltip: 'Perturbed Attention Guidance - can improve attention at the cost of performance',
                summary: (ui) => {
                    return `scale:${ui.include.base ? '🟢Base ' : ''}${ui.include.hiRes ? '🟢HiRes ' : ''} scale:${
                        ui.scale
                    } dampening:${ui.adaptiveScale}`
                },
            },
        )
        .addRequirements([{ type: 'customNodesByNameInCushy', nodeName: 'PerturbedAttention' }])
}

const ui_sag = (form: FormBuilder) => {
    return form.fields(
        {
            include: form.choices({
                items: { base: form.fields({}), hiRes: form.fields({}) },
                appearance: 'tab',
                default: { base: true, hiRes: true },
            }),
            scale: form.float({ default: 0.5, step: 0.1, min: -2.0, max: 5.0 }),
            blur_sigma: form.float({ default: 2.0, step: 0.1, min: 0, max: 10.0 }),
        },
        {
            startCollapsed: true,
            tooltip: 'Self Attention Guidance can improve image quality but runs slower',
            summary: (ui) => {
                return `${ui.include.base ? '🟢Base ' : ''}${ui.include.hiRes ? '🟢HiRes ' : ''}`
            },
        },
    )
}

const ui_kohyaDeepShrink = (form: FormBuilder) => {
    return form.fields(
        {
            include: form.choices({
                items: { base: form.fields({}), hiRes: form.fields({}) },
                appearance: 'tab',
                default: { base: false, hiRes: true },
            }),
            advancedSettings: form.fields(
                {
                    downscaleFactor: form.float({
                        default: 2,
                        min: 0.1,
                        max: 9,
                        softMax: 4,
                        step: 0.25,
                        tooltip: 'only applies to shrink on base model. hires will use hires scale factor.',
                    }),
                    block_number: form.int({ default: 3, max: 32, min: 1 }),
                    startPercent: form.float({ default: 0, min: 0, max: 1, step: 0.05 }),
                    endPercent: form.float({ default: 0.35, min: 0, max: 1, step: 0.05 }),
                    downscaleAfterSkip: form.bool({ default: false }),
                    downscaleMethod: form.enum.Enum_PatchModelAddDownscale_downscale_method({
                        default: 'bislerp',
                    }),
                    upscaleMethod: form.enum.Enum_PatchModelAddDownscale_upscale_method({ default: 'bicubic' }),
                },
                {
                    startCollapsed: true,
                    summary: (ui) => {
                        return `scale:${ui.downscaleFactor} end:${ui.endPercent} afterSkip:${ui.downscaleAfterSkip} downMethod:${ui.downscaleMethod}`
                    },
                },
            ),
        },
        {
            startCollapsed: true,
            tooltip:
                'Shrinks and patches the model. Can be used to generate resolutions higher than the model training and helps with hires fix.',
            summary: (ui) => {
                return `${ui.include.base ? '🟢Base (' + ui.advancedSettings.downscaleFactor + ')' : ''}${
                    ui.include.hiRes ? '🟢HiRes ' : ''
                } end:${ui.advancedSettings.endPercent}`
            },
        },
    )
}
// RUN -----------------------------------------------------------
export const run_model = (
    ui: OutputFor<typeof ui_model>,
): {
    ckpt: _MODEL
    vae: _VAE
    clip: _CLIP
} => {
    const run = getCurrentRun()
    const graph = run.nodes

    // 1. MODEL
    let ckptLoader
    if (ui.checkpointConfig) {
        ckptLoader = graph.CheckpointLoader({
            ckpt_name: ui.ckpt_name,
            config_name: ui.checkpointConfig,
        })
    } else if (ui.extra.civitai_ckpt_air) {
        ckptLoader = graph.CivitAI$_Checkpoint$_Loader({
            ckpt_name: ui.ckpt_name,
            ckpt_air: ui.extra.civitai_ckpt_air,
            download_path: 'models\\checkpoints',
        })
    } else {
        ckptLoader = graph.CheckpointLoaderSimple({ ckpt_name: ui.ckpt_name })
    }

    let ckpt: HasSingle_MODEL = ckptLoader
    let clip: HasSingle_CLIP = ckptLoader

    // 2. OPTIONAL CUSTOM VAE
    let vae: _VAE = ckptLoader._VAE
    if (ui.extra.vae) vae = graph.VAELoader({ vae_name: ui.extra.vae })

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
        const setScale = forHiRes ? kohyaScale : ui.extra.KohyaDeepShrink.advancedSettings.downscaleFactor ?? 2
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
