import type { OutputFor } from './_prefabs'

// UI -----------------------------------------------------------
export const ui_model = () => {
    const form = getCurrentForm()
    const ckpts = cushy.managerRepository.getKnownCheckpoints()
    return form.group({
        label: 'AI Model',
        summary: (ui) => {
            let out: string = ui.ckpt_name
            if (ui.extra.freeU) out += ' + FreeU'
            if (ui.extra.freeUv2) out += ' + FreeUv2'
            if (ui.extra.vae) out += ' + VAE'
            if (ui.extra.clipSkip) out += ` + ClipSkip(${ui.extra.clipSkip})`
            if (ui.extra.sag) out += ` + SAG(${ui.extra.sag.scale}/${ui.extra.sag.blur_sigma})`
            return out
        },
        items: () => ({
            ckpt_name: form.enum.Enum_CheckpointLoaderSimple_ckpt_name({
                label: 'Checkpoint',
                requirements: ckpts.map((x) => ({ type: 'modelCustom', infos: x })),
            }),
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
                    sag: form.group({
                        startCollapsed: true,
                        tooltip: 'Self Attention Guidance can improve image quality but runs slower',
                        items: {
                            scale: form.float({ default: 0.5, step: 0.1, min: -2.0, max: 5.0 }),
                            blur_sigma: form.float({ default: 2.0, step: 0.1, min: 0, max: 10.0 }),
                        },
                    }),
                    civitai_ckpt_air: form.string({
                        requirements: [{ type: 'customNodesByNameInCushy', nodeName: 'CivitAI$_Checkpoint$_Loader' }],
                        tooltip: 'Civitai checkpoint Air, as found on the civitai Website. It should look like this: 43331@176425', // prettier-ignore
                        label: 'Civitai Ref',
                        placeHolder: 'e.g. 43331@176425',
                    }),
                },
            }),
        }),
    })
}

// RUN -----------------------------------------------------------
export const run_model = (ui: OutputFor<typeof ui_model>) => {
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

    // 5. Optional SAG - Self Attention Guidance
    if (ui.extra.sag) {
        ckpt = graph.SelfAttentionGuidance({ scale: ui.extra.sag.scale, blur_sigma: ui.extra.sag.blur_sigma, model: ckpt })
    }

    /* Rescale CFG */
    if (ui.extra.rescaleCFG) {
        ckpt = graph.RescaleCFG({ model: ckpt, multiplier: ui.extra.rescaleCFG })
    }

    return { ckpt, vae, clip }
}
