action('LOAD MODEL', {
    help: 'load model with optional clip-skip, loras, etc.', // <- action help text
    ui: (form) => ({
        model: form.enum({ enumName: 'Enum_EfficientLoader_ckpt_name' }),
        vae: form.enumOpt({ enumName: 'Enum_VAELoader_vae_name' }),
        clipSkip: form.intOpt({}),
        tomeRatio: form.intOpt({}),
        loras: form.loras({}),
    }),
    run: async (flow, p) => {
        const graph = flow.nodes

        // model and loras
        const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: p.model })
        let clipAndModel: HasSingle_CLIP & HasSingle_MODEL = ckpt
        for (const lora of p.loras ?? []) {
            clipAndModel = graph.LoraLoader({
                model: clipAndModel,
                clip: clipAndModel,
                lora_name: lora.name,
                strength_clip: lora.strength_clip ?? 1.0,
                strength_model: lora.strength_model ?? 1.0,
            })
        }
        let clip = clipAndModel._CLIP
        let model = clipAndModel._MODEL
        if (p.clipSkip) {
            clip = graph.CLIPSetLastLayer({ clip, stop_at_clip_layer: p.clipSkip }).CLIP
        }

        // vae
        let vae: VAE = ckpt._VAE
        if (p.vae) vae = graph.VAELoader({ vae_name: p.vae }).VAE

        // patch
        if (p.tomeRatio != null && p.tomeRatio !== false) {
            const tome = graph.TomePatchModel({ model, ratio: p.tomeRatio })
            model = tome.MODEL
        }
        // return { ckpt, clip, model, vae }
    },
})
