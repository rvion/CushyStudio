action('demo1-basic', {
    author: 'rvion',
    // A. define the UI
    ui: (form) => ({
        positive: form.str({ label: 'Positive', default: 'flower' }),
    }),
    // B. defined the execution logic
    run: async (action, form) => {
        //  build a ComfyUI graph
        const graph = action.nodes
        const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: 'albedobaseXL_v02.safetensors' })
        const sampler = graph.KSampler({
            seed: action.randomSeed(),
            steps: 20,
            cfg: 14,
            sampler_name: 'euler',
            scheduler: 'normal',
            denoise: 0.8,
            model: ckpt,
            positive: graph.CLIPTextEncode({ text: form.positive, clip: ckpt }),
            negative: graph.CLIPTextEncode({ text: '', clip: ckpt }),
            latent_image: graph.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 }),
        })

        graph.SaveImage({
            images: graph.VAEDecode({ samples: sampler, vae: ckpt }),
            filename_prefix: 'ComfyUI',
        })

        // run the graph you built
        await action.PROMPT()
    },
})
