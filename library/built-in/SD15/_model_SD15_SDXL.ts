import { type $schemaModelExtras, evalModelExtras_part1, schemaModelExtras } from '../_prefabs/prefab_model_extras'

export type $prefabModelSD15andSDXL = X.XGroup<{
    ckpt_name: X.XEnum<Enum_CheckpointLoaderSimple_ckpt_name>
    extra: $schemaModelExtras
}>

export const prefabModelSD15andSDXL = (
    p: {
        ckpt_name?: Enum_CheckpointLoaderSimple_ckpt_name
        extra?: $schemaModelExtras['$Value']
    } = {},
): $prefabModelSD15andSDXL => {
    const b = getCurrentForm()
    const ckpts = cushy.managerRepository.getKnownCheckpoints()
    return b.fields({
        ckpt_name: b.enum
            .Enum_CheckpointLoaderSimple_ckpt_name({
                label: 'Checkpoint',
                // default: p.ckpt_name ?? 'revAnimated_v122.safetensors', 🔴
                default: p.ckpt_name ?? undefined,
            })
            .addRequirements(
                ckpts.map((x) => ({
                    type: 'modelCustom',
                    infos: x,
                })),
            ),
        extra: schemaModelExtras(),
    })
}

export function evalModelSD15andSDXL(doc: $prefabModelSD15andSDXL['$Value']): {
    ckpt: _MODEL
    vae: _VAE
    clip: _CLIP
} {
    const run = getCurrentRun()
    const graph = run.nodes
    let ckpt: _MODEL
    let clip: _CLIP
    let vae: _VAE | undefined = undefined

    // SD15/SD2 Specific Part ------------------------
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

    return evalModelExtras_part1(doc.extra, { vae, clip, ckpt })
}