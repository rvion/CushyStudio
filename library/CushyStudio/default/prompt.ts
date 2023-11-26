import type { RelativePath } from 'src/utils/fs/BrandedPaths'
import { run_latent, ui_latent } from './_prefabs/prefab_latent'
import { run_model, ui_model } from './_prefabs/prefab_model'
import { run_prompt } from './_prefabs/prefab_prompt'
import { ui_recursive } from './_prefabs/prefab_recursive'
import { Ctx_sampler, run_sampler, ui_sampler } from './_prefabs/prefab_sampler'
import { ui_highresfix } from './_prefabs'

app({
    ui: (form) => ({
        positive: form.prompt({
            default: {
                tokens: [
                    { type: 'text', text: 'masterpiece, tree ' },
                    { type: 'wildcard', payload: 'color', version: 1 },
                    { type: 'text', text: ' ' },
                    { type: 'wildcard', payload: '3d_term', version: 1 },
                    { type: 'text', text: ' ' },
                    { type: 'wildcard', payload: 'adj_beauty', version: 1 },
                    { type: 'text', text: ' ' },
                    { type: 'wildcard', payload: 'adj_general', version: 1 },
                    { type: 'text', text: ' nature, intricate_details' },
                ],
            },
        }),
        negative: form.prompt({ default: 'nsfw, nude, girl, woman, human' }),
        // seed: form.seed({}),
        model: ui_model(form),
        latent: ui_latent(form),
        sampler: ui_sampler(form),
        controlnets: form.groupOpt({
            items: () => ({
                pose: form.list({
                    //
                    element: () =>
                        form.group({
                            items: () => ({
                                pose: form.image({
                                    assetSuggested: 'library/CushyStudio/default/_poses/' as RelativePath,
                                }),
                            }),
                        }),
                }),
            }),
        }),
        recursiveImgToImg: ui_recursive(form),
        highResFix: ui_highresfix(form),
        loop: form.groupOpt({
            items: () => ({
                batchCount: form.int({ default: 1 }),
                delayBetween: form.int({
                    tooltip: 'in ms',
                    default: 0,
                }),
            }),
        }),
        // startImage
        removeBG: form.bool({ default: false }),
        reversePositiveAndNegative: form.bool({ default: false }),
        makeAVideo: form.bool({ default: false }),
        show3d: form.groupOpt({
            items: () => {
                return {
                    normal: form.selectOne({
                        default: { id: 'MiDaS' },
                        choices: [{ id: 'MiDaS' }, { id: 'BAE' }],
                    }),
                    depth: form.selectOne({
                        default: { id: 'Zoe' },
                        choices: [{ id: 'MiDaS' }, { id: 'Zoe' }, { id: 'LeReS' }],
                    }),
                }
            },
        }),
    }),

    run: async (flow, p) => {
        const graph = flow.nodes
        // MODEL, clip skip, vae, etc. ---------------------------------------------------------------
        let { ckpt, vae, clip } = run_model(flow, p.model)

        const posPrompt = p.reversePositiveAndNegative ? p.negative : p.positive
        const negPrompt = p.reversePositiveAndNegative ? p.positive : p.negative

        // RICH PROMPT ENGINE -------- ---------------------------------------------------------------
        const x = run_prompt(flow, { richPrompt: posPrompt, clip, ckpt, outputWildcardsPicked: true })
        const clipPos = x.clip
        const ckptPos = x.ckpt
        const positive = x.conditionning

        const y = run_prompt(flow, { richPrompt: negPrompt, clip, ckpt, outputWildcardsPicked: true })
        const negative = y.conditionning

        // START IMAGE -------------------------------------------------------------------------------
        let { latent } = await run_latent({ flow, opts: p.latent, vae })

        // FIRST PASS --------------------------------------------------------------------------------
        const ctx_sampler: Ctx_sampler = {
            ckpt: ckptPos,
            clip: clipPos,
            vae,
            latent,
            positive: positive,
            negative: negative,
            preview: false,
        }
        const firstPass = run_sampler(flow, p.sampler, ctx_sampler)
        latent = firstPass.latent

        // graph.FUIOSUIO({}) as any

        // RECURSIVE PASS ----------------------------------------------------------------------------
        if (p.recursiveImgToImg) {
            for (let i = 0; i < p.recursiveImgToImg.loops; i++) {
                latent = run_sampler(
                    flow,
                    {
                        seed: p.sampler.seed + i,
                        cfg: p.recursiveImgToImg.cfg,
                        steps: p.recursiveImgToImg.steps,
                        denoise: p.recursiveImgToImg.denoise,
                        sampler_name: 'ddim',
                        scheduler: 'ddim_uniform',
                    },
                    { ...ctx_sampler, latent, preview: true },
                ).latent
            }
        }

        // SECOND PASS (a.k.a. highres fix) ---------------------------------------------------------
        if (p.highResFix) {
            if (p.highResFix.saveIntermediaryImage) {
                graph.SaveImage({ images: graph.VAEDecode({ samples: latent, vae }) })
            }
            latent = graph.LatentUpscale({
                samples: latent,
                crop: 'disabled',
                upscale_method: 'nearest-exact',
                height: p.latent.size.height * p.highResFix.scaleFactor,
                width: p.latent.size.width * p.highResFix.scaleFactor,
            })
            latent = latent = run_sampler(
                flow,
                {
                    seed: p.sampler.seed,
                    cfg: p.sampler.cfg,
                    steps: p.highResFix.steps,
                    denoise: p.highResFix.denoise,
                    sampler_name: 'ddim',
                    scheduler: 'ddim_uniform',
                },
                { ...ctx_sampler, latent, preview: false },
            ).latent
        }

        let finalImage: HasSingle_IMAGE = graph.VAEDecode({ samples: latent, vae })
        // DECODE --------------------------------------------------------------------------------
        graph.SaveImage({ images: finalImage })

        // REMOVE BACKGROUND ---------------------------------------------------------------------
        if (p.removeBG) {
            finalImage = graph.Image_Rembg_$1Remove_Background$2({
                images: flow.AUTO,
                model: 'u2net',
                background_color: 'magenta',
            })
            graph.SaveImage({ images: finalImage })
        }

        // SHOW 3D --------------------------------------------------------------------------------
        const show3d = p.show3d
        if (show3d) {
            flow.add_saveImage(finalImage, 'base')

            const depth = (() => {
                if (show3d.depth.id === 'MiDaS') return graph.MiDaS$7DepthMapPreprocessor({ image: finalImage })
                if (show3d.depth.id === 'Zoe') return graph.Zoe$7DepthMapPreprocessor({ image: finalImage })
                if (show3d.depth.id === 'LeReS') return graph.LeReS$7DepthMapPreprocessor({ image: finalImage })
                return exhaust(show3d.depth)
            })()
            flow.add_saveImage(depth, 'depth')

            const normal = (() => {
                if (show3d.normal.id === 'MiDaS') return graph.MiDaS$7NormalMapPreprocessor({ image: finalImage })
                if (show3d.normal.id === 'BAE') return graph.BAE$7NormalMapPreprocessor({ image: finalImage })
                return exhaust(show3d.normal)
            })()
            flow.add_saveImage(normal, 'normal')
        }

        await flow.PROMPT()

        if (show3d) {
            flow.out_3dImage({ image: 'base', depth: 'depth', normal: 'normal' })
        }

        // LOOP IF NEED BE -----------------------------------------------------------------------
        const loop = p.loop
        if (loop) {
            const ixes = new Array(p.loop.batchCount).fill(0).map((_, i) => i)
            for (const i of ixes) {
                await new Promise((r) => setTimeout(r, loop.delayBetween))
                await flow.PROMPT()
            }
        }

        if (p.makeAVideo) {
            await flow.createAnimation()
        }
    },
})
