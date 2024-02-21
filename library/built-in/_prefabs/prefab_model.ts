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
            if (ui.extra.vae) out += ' + VAE'
            if (ui.extra.clipSkip) out += ` + ClipSkip(${ui.extra.clipSkip})`
            return out
        },
        items: () => ({
            ckpt_name: form.enum.Enum_CheckpointLoaderSimple_ckpt_name({
                label: 'Checkpoint',
                requirements: ckpts.map((x) => ({ type: 'modelCustom', infos: x })),
            }),
            extra: form.choices({
                appearance: 'tab',
                items: {
                    ckpt_config: form.enum.Enum_CheckpointLoader_config_name({ label: 'Config' }),
                    rescale_cfg: form.auto.RescaleCFG(),
                    vae: form.enum.Enum_VAELoader_vae_name({}),
                    clipSkip: form.int({ label: 'Clip Skip', default: 1, min: 1, max: 5 }),
                    freeU: form.group(),
                    civtai_ckpt_air: form.string({
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
    if (ui.extra.ckpt_config) {
        ckptLoader = graph.CheckpointLoader({
            ckpt_name: ui.ckpt_name,
            config_name: ui.extra.ckpt_config,
        })
    } else if (ui.extra.civtai_ckpt_air) {
        ckptLoader = graph.CivitAI$_Checkpoint$_Loader({
            ckpt_name: ui.ckpt_name,
            ckpt_air: ui.extra.civtai_ckpt_air,
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
    if (ui.extra.freeU) ckpt = graph.FreeU({ model: ckpt })

    return { ckpt, vae, clip }
}
