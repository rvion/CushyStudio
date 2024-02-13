import type { OutputFor } from './_prefabs'

// UI -----------------------------------------------------------
export const ui_model = () => {
    const form = getCurrentForm()
    const ckpts = form.schema.st.managerRepository.getKnownCheckpoints()
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
                default: 'revAnimated_v122.safetensors',
                label: 'Checkpoint',
                requirements: ckpts.map((x) => ({ type: 'modelCustom', infos: x })),
            }),
            extra: form.choices({
                appearance: 'tab',
                items: {
                    vae: () => form.enum.Enum_VAELoader_vae_name({}),
                    clipSkip: () =>
                        form.int({
                            label: 'Clip Skip',
                            default: 1,
                            min: 1,
                            max: 5,
                        }),
                    freeU: () => form.group({}),
                    civtai_ckpt_air: () =>
                        form.string({
                            tooltip:
                                'Civitai checkpoint Air, as found on the civitai Website. It should look like this: 43331@176425',
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
    const ckptSimple = ui.extra.civtai_ckpt_air
        ? graph.CivitAI$_Checkpoint$_Loader({
              ckpt_name: ui.ckpt_name,
              ckpt_air: ui.extra.civtai_ckpt_air,
              download_path: 'models\\checkpoints',
          })
        : graph.CheckpointLoaderSimple({ ckpt_name: ui.ckpt_name })
    let ckpt: HasSingle_MODEL = ckptSimple
    let clip: HasSingle_CLIP = ckptSimple

    // 2. OPTIONAL CUSTOM VAE
    let vae: _VAE = ckptSimple._VAE
    if (ui.extra.vae) vae = graph.VAELoader({ vae_name: ui.extra.vae })

    // 3. OPTIONAL CLIP SKIP
    if (ui.extra.clipSkip) clip = graph.CLIPSetLastLayer({ clip, stop_at_clip_layer: -Math.abs(ui.extra.clipSkip) })

    // 4. Optional FreeU
    if (ui.extra.freeU) ckpt = graph.FreeU({ model: ckpt })

    return { ckpt, vae, clip }
}
