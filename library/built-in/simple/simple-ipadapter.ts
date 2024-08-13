import { run_ipadapter_standalone, ui_ipadapter_standalone } from '../_ipAdapter/prefab_ipAdapter_base_standalone'
import { run_prompt } from '../_prefabs/prefab_prompt'

app({
    metadata: {
        name: 'Simple IPAdapter Test',
        description: 'simple ipadapter test',
    },
    ui: (form) => ({
        positive: form.prompt({ default: 'masterpiece, tree ' }),
        useImageToStart: form.boolean({ default: false }),
        ipadapter: ui_ipadapter_standalone(),
        denoise: form.float({ default: 0, min: 0, max: 1 }),
        negative: form.prompt({
            startCollapsed: true,
            default: 'bad quality, blurry, low resolution, pixelated, noisy',
        }),
        // latent: ui_latent(),
    }),

    run: async (run, ui) => {
        const graph = run.nodes

        // ui
        // MODEL, clip skip, vae, etc. ---------------------------------------------------------------
        let ckptls = graph.CheckpointLoaderSimple({ ckpt_name: 'revAnimated_v122.safetensors' }) //run_model(ui.model)
        let vae: _VAE = ckptls
        let ckpt: _MODEL = ckptls
        let clip: _CLIP = ckptls

        const posPrompt = ui.positive
        const negPrompt = ui.negative

        // RICH PROMPT ENGINE -------- ---------------------------------------------------------------
        const x = run_prompt({ prompt: posPrompt, clip, ckpt, printWildcards: true })
        clip = x.clip
        ckpt = x.ckpt
        let positive = x.conditioning

        const y = run_prompt({ prompt: negPrompt, clip, ckpt, printWildcards: true })
        let negative = y.conditioning

        // START IMAGE -------------------------------------------------------------------------------
        const IMG = ui.ipadapter.image

        const xx = await run_ipadapter_standalone(ui.ipadapter, ckpt)

        const imgC = await IMG.loadInWorkflow()
        const img = graph.VAEDecode({
            samples: graph.KSampler({
                latent_image: ui.useImageToStart
                    ? graph.VAEEncode({ pixels: imgC, vae: vae })
                    : graph.EmptyLatentImage({
                          width: IMG.width,
                          height: IMG.height,
                      }),
                model: xx.ip_adapted_model,
                negative: negative,
                positive: positive,
                sampler_name: 'ddim',
                scheduler: 'karras',
                denoise: ui.denoise,
                seed: run.randomSeed(),
            }),
            vae,
        })
        run.add_previewImage(img)
        await run.PROMPT()
    },
})
