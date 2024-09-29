export const prefab_diffusion_FLUX = (): X.XGroup<{
    ckpt_name: X.XEnum<Enum_UNETLoader_unet_name>
    weight_type: X.XEnum<Enum_UNETLoader_weight_dtype>
    clip1: X.XEnum<Enum_CLIPLoader_clip_name>
    clip2: X.XEnum<Enum_CLIPLoader_clip_name>
    type: X.XEnum<Enum_DualCLIPLoader_type>
}> => {
    const b = getCurrentForm()
    const ckpts = cushy.managerRepository.getKnownCheckpoints()
    return b
        .fields({
            ckpt_name: b.enum.Enum_UNETLoader_unet_name({
                // @ts-ignore
                default: 'flux1-dev.sft',
            }),
            weight_type: b.enum.Enum_UNETLoader_weight_dtype({ label: 'Weight Type', default: 'fp8_e4m3fn' }),
            clip1: b.enum
                .Enum_DualCLIPLoader_clip_name1({
                    // @ts-ignore
                    default: 't5xxl_fp16.safetensors',
                })
                .addRequirementOnComfyManagerModel('google-t5/t5-v1_1-xxl_encoderonly-fp16')
                .addRequirementOnComfyManagerModel('google-t5/t5-v1_1-xxl_encoderonly-fp8_e4m3fn'),
            clip2: b.enum
                .Enum_DualCLIPLoader_clip_name2({ default: 'clip_l.safetensors' })
                .addRequirementOnComfyManagerModel('comfyanonymous/clip_l'),
            type: b.enum.Enum_DualCLIPLoader_type({ default: 'flux' }),
        })
        .addRequirements([
            { type: 'modelInManager', modelName: 'FLUX.1 VAE model' },
            { type: 'modelInManager', modelName: 'FLUX.1 [schnell] Diffusion model' },
            { type: 'modelInManager', modelName: 'kijai/FLUX.1 [dev] Diffusion model (float8_e4m3fn)' },
            { type: 'modelInManager', modelName: 'kijai/FLUX.1 [schnell] Diffusion model (float8_e4m3fn)' },
            { type: 'modelInManager', modelName: 'Comfy Org/FLUX.1 [dev] Checkpoint model (fp8)' },
            { type: 'modelInManager', modelName: 'Comfy Org/FLUX.1 [schnell] Checkpoint model (fp8)' },
        ])
    // .addPreset({
    //     icon: 'mdiStar',
    //     label: 'FLUX',
    //     apply: (w): void => {
    //         w.setValue({
    //             FLUX: {
    //                 type: 'flux',
    //                 ckpt_name: 'flux1-dev.sft' as Enum_UNETLoader_unet_name,
    //                 weight_type: 'fp8_e4m3fn',
    //                 clip1: 't5xxl_fp16.safetensors' as Enum_DualCLIPLoader_clip_name1,
    //                 clip2: 'clip_l.safetensors' as Enum_DualCLIPLoader_clip_name2,
    //             },
    //             extra: { vae: 'ae.sft' as Enum_VAELoader_vae_name },
    //         })
    //     },
    // })
}
