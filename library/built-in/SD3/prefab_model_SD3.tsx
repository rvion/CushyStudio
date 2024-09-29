import { type $prefab_model_extras, prefab_model_extras } from '../_prefabs/prefab_model_extras'

export const prefab_diffusion_SD3 = (): X.XGroup<{
    ckpt_name: X.XEnum<Enum_CheckpointLoaderSimple_ckpt_name>
    clip1: X.XEnum<Enum_CLIPLoader_clip_name>
    clip2: X.XEnum<Enum_CLIPLoader_clip_name>
    clip3: X.XEnum<Enum_CLIPLoader_clip_name>
    extra: $prefab_model_extras
}> => {
    const b = getCurrentForm()
    const ckpts = cushy.managerRepository.getKnownCheckpoints()
    return b
        .fields({
            ckpt_name: b.enum.Enum_CheckpointLoaderSimple_ckpt_name({ label: 'Checkpoint' }),
            clip1: b.enum.Enum_TripleCLIPLoader_clip_name1({
                // @ts-ignore
                default: 't5xxl_fp16.safetensors',
            }),
            clip2: b.enum.Enum_TripleCLIPLoader_clip_name2({ default: 'clip_l.safetensors' }),
            clip3: b.enum.Enum_TripleCLIPLoader_clip_name3({
                // @ts-ignore
                default: 'clip_g.safetensors',
            }),
            extra: prefab_model_extras(),
        })
        .addRequirements([
            //
        ])
}
