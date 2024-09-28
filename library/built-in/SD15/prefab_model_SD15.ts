import { type $prefab_model_extras, prefab_model_extras } from '../_prefabs/prefab_model_extras'

export type $prefab_model_SD15 = X.XGroup<{
    ckpt_name: X.XEnum<Enum_CheckpointLoaderSimple_ckpt_name>
    extra: $prefab_model_extras
}>

export const prefab_model_SD15 = (): $prefab_model_SD15 => {
    const b = getCurrentForm()
    const ckpts = cushy.managerRepository.getKnownCheckpoints()
    return b.fields({
        ckpt_name: b.enum
            .Enum_CheckpointLoaderSimple_ckpt_name({ label: 'Checkpoint' })
            .addRequirements(ckpts.map((x) => ({ type: 'modelCustom', infos: x }))),
        extra: prefab_model_extras(),
    })
}

export function run_model_SD15(doc: $prefab_model_SD15['$Value']): {
    ckpt: _MODEL
    vae: _VAE
    clip: _CLIP
} {
    const run = getCurrentRun()
    const graph = run.nodes

    // 1. Core Models (ckpt, clip, vale)
    let ckpt: _MODEL
    let clip: _CLIP
    let vae: _VAE | undefined = undefined

    if (doc.extra.checkpointConfig) {
        const ckptLoader = graph.CheckpointLoader({
            ckpt_name: doc.ckpt_name,
            config_name: doc.extra.checkpointConfig,
        })
        ckpt = ckptLoader._MODEL
        clip = ckptLoader._CLIP
        vae = ckptLoader._VAE
    } else if (doc.extra.civitai_ckpt_air) {
        const ckptLoader = graph.CivitAI$_Checkpoint$_Loader({
            ckpt_name: doc.ckpt_name,
            ckpt_air: doc.extra.civitai_ckpt_air,
            download_path: 'models\\checkpoints',
        })
        ckpt = ckptLoader._MODEL
        clip = ckptLoader._CLIP
        vae = ckptLoader._VAE
    } else {
        const ckptLoader = graph.CheckpointLoaderSimple({ ckpt_name: doc.ckpt_name })
        ckpt = ckptLoader._MODEL
        clip = ckptLoader._CLIP
        vae = ckptLoader._VAE
    }

    // 2. OPTIONAL CUSTOM VAE
    if (doc.extra.vae) vae = graph.VAELoader({ vae_name: doc.extra.vae })
    if (vae === undefined) {
        throw new Error('No VAE loaded')
    }

    // 3. OPTIONAL CLIP SKIP
    if (doc.extra.clipSkip) clip = graph.CLIPSetLastLayer({ clip, stop_at_clip_layer: -Math.abs(doc.extra.clipSkip) })

    // 4. Optional FreeU
    if (doc.extra.freeUv2) ckpt = graph.FreeU$_V2({ model: ckpt })
    else if (doc.extra.freeU) ckpt = graph.FreeU({ model: ckpt })

    /* Rescale CFG */
    if (doc.extra.rescaleCFG) {
        ckpt = graph.RescaleCFG({ model: ckpt, multiplier: doc.extra.rescaleCFG })
    }

    return { ckpt, vae, clip }
}
