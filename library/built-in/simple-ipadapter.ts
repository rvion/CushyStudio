// import {
//     run_ipadapter_standalone,
//     ui_ipadapter_standalone,
// } from './_prefabs/ControlNet/ipAdapter/prefab_ipAdapter_base_standalone'
import { run_ipadapter_standalone, ui_ipadapter_standalone } from './_prefabs/ControlNet/ipAdapter/prefab_ipAdapter_base_standalone'
import { run_latent, ui_latent } from './_prefabs/prefab_latent'
import { run_prompt } from './_prefabs/prefab_prompt'

app({
    metadata: {
        name: 'Cushy Diffusion UI',
        illustration: 'library/built-in/_illustrations/mc.jpg',
        description: 'A card that contains all the features needed to play with stable diffusion',
    },
    ui: (form) => ({
        positive: form.prompt({
            default: {
                tokens: [{ type: 'text', text: 'masterpiece, tree ' }],
            },
        }),
        negative: form.prompt({
            startCollapsed: true,
            default: 'bad quality, blurry, low resolution, pixelated, noisy',
        }),
        latent: ui_latent(),
        ipadapter: ui_ipadapter_standalone(),
    }),

    run: async (run, ui) => {
        const graph = run.nodes

        // ui
        // MODEL, clip skip, vae, etc. ---------------------------------------------------------------
        let aa = graph.CheckpointLoaderSimple({ ckpt_name: 'revAnimated_v122.safetensors' }) //run_model(ui.model)
        const ckpt = aa
        const vae = aa
        const clip = aa

        const posPrompt = ui.positive
        const negPrompt = ui.negative

        // RICH PROMPT ENGINE -------- ---------------------------------------------------------------
        const x = run_prompt({ richPrompt: posPrompt, clip, ckpt, outputWildcardsPicked: true })
        const clipPos = x.clip
        let ckptPos = x.ckpt
        let positive = x.conditionning

        const y = run_prompt({ richPrompt: negPrompt, clip, ckpt, outputWildcardsPicked: true })
        let negative = y.conditionning

        // START IMAGE -------------------------------------------------------------------------------
        let { latent, width, height } = await run_latent({ opts: ui.latent, vae })
        if (ui.ipadapter) {
            const foo = await run_ipadapter_standalone(ui.ipadapter, 0 as any)
            // foo.
            // graph.
        }
    },
})
