import { exhaust } from 'src/utils/misc/ComfyUtils'
import { ui_highresfix } from './_prefabs/_prefabs'
import { run_latent, ui_latent } from './_prefabs/prefab_latent'
import { output_demo_summary } from './_prefabs/prefab_markdown'
import { run_model, ui_model } from './_prefabs/prefab_model'
import { run_prompt } from './_prefabs/prefab_prompt'
import { ui_recursive } from './_prefabs/prefab_recursive'
import { Ctx_sampler, run_sampler, ui_sampler } from './_prefabs/prefab_sampler'

import IMG from './_illustrations/mc.jpg'

app({
    metadata: {
        name: 'Cushy Diffusion UI',
        illustration: IMG,
        description: 'A card that contains all the features needed to play with stable diffusion',
    },
    ui: (ui) => ({
        positive: ui.prompt({
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
        negative: ui.prompt({
            startCollapsed: true,
            default: 'nsfw, nude, girl, woman, human',
        }),
        model: ui_model(ui),
        latent: ui_latent(ui),
        sampler: ui_sampler(ui),
        highResFix: ui_highresfix(ui, { activeByDefault: true }),
        controlnets: ui.groupOpt({
            items: () => ({
                pose: ui.list({
                    //
                    element: () =>
                        ui.group({
                            items: () => ({
                                pose: ui.image({ assetSuggested: 'library/CushyStudio/default/_poses/' as RelativePath }),
                            }),
                        }),
                }),
            }),
        }),
        recursiveImgToImg: ui_recursive(ui),
        loop: ui.groupOpt({
            items: () => ({
                batchCount: ui.int({ default: 1 }),
                delayBetween: ui.int({ tooltip: 'in ms', default: 0 }),
            }),
        }),
        // startImage
        removeBG: ui.bool({ default: false }),
        reversePositiveAndNegative: ui.bool({ default: false }),
        makeAVideo: ui.bool({ default: false }),
        summary: ui.bool({ default: false }),
        gaussianSplat: ui.bool({ default: false }),
        show3d: ui.groupOpt({
            items: () => {
                return {
                    normal: ui.selectOne({
                        default: { id: 'MiDaS' },
                        choices: [{ id: 'MiDaS' }, { id: 'BAE' }],
                    }),
                    depth: ui.selectOne({
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
        let positive = x.conditionning

        const y = run_prompt(flow, { richPrompt: negPrompt, clip, ckpt, outputWildcardsPicked: true })
        const negative = y.conditionning

        // START IMAGE -------------------------------------------------------------------------------
        let { latent } = await run_latent({ flow, opts: p.latent, vae })

        // CNETS -------------------------------------------------------------------------------
        const cnets = p.controlnets
        if (cnets) {
            for (const cnet of cnets.pose) {
                positive = graph.ControlNetApply({
                    conditioning: positive,
                    control_net: graph.ControlNetLoader({
                        control_net_name: 'control_openpose-fp16.safetensors',
                    }),
                    image: (await flow.loadImageAnswer(cnet.pose))._IMAGE,
                    strength: 1,
                })
            }
        }

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
        latent = run_sampler(flow, p.sampler, ctx_sampler).latent

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
        } else {
            // DECODE --------------------------------------------------------------------------------
            graph.SaveImage({ images: finalImage })
        }

        await flow.PROMPT()

        if (p.gaussianSplat) flow.output_GaussianSplat({ url: '' })
        if (p.summary) output_demo_summary(flow)
        if (show3d) flow.output_3dImage({ image: 'base', depth: 'depth', normal: 'normal' })

        // LOOP IF NEED BE -----------------------------------------------------------------------
        const loop = p.loop
        if (loop) {
            const ixes = new Array(p.loop.batchCount).fill(0).map((_, i) => i)
            for (const i of ixes) {
                await new Promise((r) => setTimeout(r, loop.delayBetween))
                await flow.PROMPT()
            }
        }

        if (p.makeAVideo) await flow.output_video_ffmpegGeneratedImagesTogether(undefined, 2)
    },
})
