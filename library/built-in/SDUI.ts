import { exhaust } from 'src/utils/misc/ComfyUtils'
import { ui_highresfix } from './_prefabs/_prefabs'
import { Cnet_args, Cnet_return, run_cnet, ui_cnet } from './_prefabs/prefab_cnet'
import { run_improveFace_fromImage, ui_improveFace } from './_prefabs/prefab_detailer'
import { run_latent, ui_latent } from './_prefabs/prefab_latent'
import { output_demo_summary } from './_prefabs/prefab_markdown'
import { run_model, ui_model } from './_prefabs/prefab_model'
import { run_prompt } from './_prefabs/prefab_prompt'
import { ui_recursive } from './_prefabs/prefab_recursive'
import { Ctx_sampler, run_sampler, ui_sampler } from './_prefabs/prefab_sampler'
import { run_upscaleWithModel, ui_upscaleWithModel } from './_prefabs/prefab_upscaleWithModel'
import { run_saveAllImages, ui_saveAllImages } from './_prefabs/saveSmall'

app({
    metadata: {
        name: 'Cushy Diffusion UI',
        illustration: 'library/built-in/_illustrations/mc.jpg',
        description: 'A card that contains all the features needed to play with stable diffusion',
    },
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
        negative: form.prompt({
            startCollapsed: true,
            default: 'bad quality, blurry, low resolution, pixelated, noisy',
        }),
        model: ui_model(),
        latent: ui_latent(),
        sampler: ui_sampler(),
        highResFix: ui_highresfix(form, { activeByDefault: true }),
        upscale: ui_upscaleWithModel(),
        controlnets: ui_cnet(),
        recursiveImgToImg: ui_recursive(),
        loop: form.groupOpt({
            items: () => ({
                batchCount: form.int({ default: 1 }),
                delayBetween: form.int({ tooltip: 'in ms', default: 0 }),
            }),
        }),
        compressImage: ui_saveAllImages(),
        // startImage
        removeBG: form.bool({ default: false }),
        reversePositiveAndNegative: form.bool({ default: false }),
        makeAVideo: form.bool({ default: false }),
        summary: form.bool({ default: false }),
        gaussianSplat: form.bool({ default: false }),
        improveFaces: ui_improveFace(),
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

    run: async (run, ui) => {
        const graph = run.nodes
        // MODEL, clip skip, vae, etc. ---------------------------------------------------------------
        let { ckpt, vae, clip } = run_model(ui.model)

        const posPrompt = ui.reversePositiveAndNegative ? ui.negative : ui.positive
        const negPrompt = ui.reversePositiveAndNegative ? ui.positive : ui.negative

        // RICH PROMPT ENGINE -------- ---------------------------------------------------------------
        const x = run_prompt(run, { richPrompt: posPrompt, clip, ckpt, outputWildcardsPicked: true })
        const clipPos = x.clip
        let ckptPos = x.ckpt
        let positive = x.conditionning

        const y = run_prompt(run, { richPrompt: negPrompt, clip, ckpt, outputWildcardsPicked: true })
        let negative = y.conditionning

        // START IMAGE -------------------------------------------------------------------------------
        let { latent, width, height } = await run_latent({ opts: ui.latent, vae })

        // CNETS -------------------------------------------------------------------------------
        let cnet_out: Cnet_return | undefined
        if (ui.controlnets) {
            const Cnet_args: Cnet_args = {
                positive,
                negative,
                width,
                height,
                ckptPos,
            }
            cnet_out = await run_cnet(ui.controlnets, Cnet_args)
            positive = cnet_out.cnet_positive
            negative = cnet_out.cnet_negative
            ckptPos = cnet_out.ckpt_return //only used for ipAdapter, otherwise it will just be a passthrough
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
        latent = run_sampler(run, ui.sampler, ctx_sampler).latent

        // RECURSIVE PASS ----------------------------------------------------------------------------
        if (ui.recursiveImgToImg) {
            for (let i = 0; i < ui.recursiveImgToImg.loops; i++) {
                latent = run_sampler(
                    run,
                    {
                        seed: ui.sampler.seed + i,
                        cfg: ui.recursiveImgToImg.cfg,
                        steps: ui.recursiveImgToImg.steps,
                        denoise: ui.recursiveImgToImg.denoise,
                        sampler_name: 'ddim',
                        scheduler: 'ddim_uniform',
                    },
                    { ...ctx_sampler, latent, preview: true },
                ).latent
            }
        }

        // REFINE PASS BEFORE -------------
        // if (ui.improveFaces) {
        //     const image = run_improveFace_fromLatent(latent)
        //     latent = graph.VAEEncode({ pixels: image, vae })
        // }

        // SECOND PASS (a.k.a. highres fix) ---------------------------------------------------------
        const ctx_sampler_fix: Ctx_sampler = {
            ckpt: ckptPos,
            clip: clipPos,
            vae,
            latent,
            positive: cnet_out?.post_cnet_positive ?? positive,
            negative: cnet_out?.post_cnet_negative ?? negative,
            preview: false,
        }
        if (ui.highResFix) {
            if (ui.highResFix.saveIntermediaryImage) {
                graph.SaveImage({ images: graph.VAEDecode({ samples: latent, vae }) })
            }
            latent = graph.LatentUpscale({
                samples: latent,
                crop: 'disabled',
                upscale_method: 'nearest-exact',
                height: ui.latent.size.height * ui.highResFix.scaleFactor,
                width: ui.latent.size.width * ui.highResFix.scaleFactor,
            })
            latent = latent = run_sampler(
                run,
                {
                    seed: ui.sampler.seed,
                    cfg: ui.sampler.cfg,
                    steps: ui.highResFix.steps,
                    denoise: ui.highResFix.denoise,
                    sampler_name: 'ddim',
                    scheduler: 'ddim_uniform',
                },
                { ...ctx_sampler_fix, latent, preview: false },
            ).latent
        }

        // UPSCALE with upscale model ------------------------------------------------------------
        // TODO

        // ---------------------------------------------------------------------------------------
        let finalImage: _IMAGE = graph.VAEDecode({ samples: latent, vae })

        // REFINE PASS AFTER ---------------------------------------------------------------------
        if (ui.improveFaces) {
            finalImage = run_improveFace_fromImage(finalImage)
            // latent = graph.VAEEncode({ pixels: image, vae })
        }

        // REMOVE BACKGROUND ---------------------------------------------------------------------
        if (ui.removeBG) {
            finalImage = graph.Image_Rembg_$1Remove_Background$2({
                images: run.AUTO,
                model: 'u2net',
                background_color: 'none',
            })
            graph.SaveImage({ images: finalImage })
        }

        // SHOW 3D --------------------------------------------------------------------------------
        const show3d = ui.show3d
        if (show3d) {
            run.add_saveImage(finalImage, 'base')

            const depth = (() => {
                if (show3d.depth.id === 'MiDaS') return graph.MiDaS$7DepthMapPreprocessor({ image: finalImage })
                if (show3d.depth.id === 'Zoe') return graph.Zoe$7DepthMapPreprocessor({ image: finalImage })
                if (show3d.depth.id === 'LeReS') return graph.LeReS$7DepthMapPreprocessor({ image: finalImage })
                return exhaust(show3d.depth)
            })()
            run.add_saveImage(depth, 'depth')

            const normal = (() => {
                if (show3d.normal.id === 'MiDaS') return graph.MiDaS$7NormalMapPreprocessor({ image: finalImage })
                if (show3d.normal.id === 'BAE') return graph.BAE$7NormalMapPreprocessor({ image: finalImage })
                return exhaust(show3d.normal)
            })()
            run.add_saveImage(normal, 'normal')
        } else {
            // DECODE --------------------------------------------------------------------------------
            graph.SaveImage({ images: finalImage })
        }

        if (ui.upscale) {
            finalImage = run_upscaleWithModel(ui.upscale, { image: finalImage })
        }

        await run.PROMPT()

        if (ui.gaussianSplat) run.output_GaussianSplat({ url: '' })
        if (ui.summary) output_demo_summary(run)
        if (show3d) run.output_3dImage({ image: 'base', depth: 'depth', normal: 'normal' })

        if (ui.compressImage) {
            run_saveAllImages({ format: 'webp', quality: ui.compressImage.quality })
        }

        // LOOP IF NEED BE -----------------------------------------------------------------------
        const loop = ui.loop
        if (loop) {
            const ixes = new Array(ui.loop.batchCount).fill(0).map((_, i) => i)
            for (const i of ixes) {
                await new Promise((r) => setTimeout(r, loop.delayBetween))
                await run.PROMPT()
            }
        }

        if (ui.makeAVideo) await run.Videos.output_video_ffmpegGeneratedImagesTogether(undefined, 2)
    },
})
