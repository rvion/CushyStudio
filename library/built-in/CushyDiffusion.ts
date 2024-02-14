import { exhaust } from 'src/utils/misc/ComfyUtils'
import { ui_highresfix } from './_prefabs/_prefabs'
import { Cnet_args, Cnet_return, run_cnet, ui_cnet } from './_prefabs/prefab_cnet'
import { run_refiners_fromImage, ui_refiners } from './_prefabs/prefab_detailer'
import { run_latent_v3, ui_latent_v3 } from './_prefabs/prefab_latent_v3'
import { output_demo_summary } from './_prefabs/prefab_markdown'
import { run_model, ui_model } from './_prefabs/prefab_model'
import { run_prompt } from './_prefabs/prefab_prompt'
import { ui_recursive } from './_prefabs/prefab_recursive'
import { Ctx_sampler, run_sampler, ui_sampler } from './_prefabs/prefab_sampler'
import { run_upscaleWithModel, ui_upscaleWithModel } from './_prefabs/prefab_upscaleWithModel'
import { run_customSave, ui_customSave } from './_prefabs/saveSmall'
import { run_rembg_v1, ui_rembg_v1 } from './_prefabs/prefab_rembg'

app({
    metadata: {
        name: 'Cushy Diffusion',
        illustration: 'library/built-in/_illustrations/mc.jpg',
        description:
            'An example app to play with various stable diffusion technologies. Feel free to contribute improvements to it.',
    },
    ui: (form) => ({
        // modelType: form.selectOne({
        //     appearance: 'tab',
        //     choices: [{ id: 'SD 1.5' }, { id: 'SDXL' }],
        // }),
        positive: form.prompt({
            default: [
                //
                'masterpiece, tree',
                '?color, ?3d_term, ?adj_beauty, ?adj_general',
                '(nature)*0.9, (intricate_details)*1.1',
            ].join('\n'),
        }),
        //
        negative: form.prompt({
            startCollapsed: true,
            default: 'bad quality, blurry, low resolution, pixelated, noisy',
        }),
        model: ui_model(),
        latent: ui_latent_v3(),
        sampler: ui_sampler(),
        refine: ui_refiners(),
        highResFix: ui_highresfix({ activeByDefault: true }),
        upscale: ui_upscaleWithModel(),
        customSave: ui_customSave(),
        removeBG: ui_rembg_v1(),

        show3d: form.groupOpt({
            requirements: [
                //
                { type: 'customNodesByNameInCushy', nodeName: 'Zoe$7DepthMapPreprocessor' },
                { type: 'customNodesByNameInCushy', nodeName: 'MarigoldDepthEstimation' },
            ],
            items: () => {
                return {
                    normal: form.selectOne({
                        tooltip: 'no Normal map may be better, bad model yields bumpy stuff',
                        default: { id: 'None' },
                        choices: [{ id: 'MiDaS' }, { id: 'BAE' }, { id: 'None' }],
                    }),
                    depth: form.choice({
                        default: 'Marigold',
                        items: {
                            MiDaS: () => form.group({}),
                            Zoe: () => form.group({}),
                            LeReS: () => form.group({}),
                            Marigold: () => form.auto.MarigoldDepthEstimation(),
                        },
                    }),
                }
            },
        }),
        controlnets: ui_cnet(),
        recursiveImgToImg: ui_recursive(),
        loop: form.groupOpt({
            items: () => ({
                batchCount: form.int({ default: 1 }),
                delayBetween: form.int({ tooltip: 'in ms', default: 0 }),
            }),
        }),
        testStuff: form.choices({
            appearance: 'tab',
            items: {
                reversePositiveAndNegative: () => form.group({}),
                makeAVideo: () => form.group({}),
                summary: () => form.group({}),
                gaussianSplat: () => form.group({}),
            },
        }),
    }),

    run: async (run, ui) => {
        const graph = run.nodes
        // MODEL, clip skip, vae, etc. ---------------------------------------------------------------
        let { ckpt, vae, clip } = run_model(ui.model)

        // RICH PROMPT ENGINE -------- ---------------------------------------------------------------
        const posPrompt = run_prompt({
            prompt: ui.positive,
            clip,
            ckpt,
            printWildcards: true,
        })
        const clipPos = posPrompt.clip
        let ckptPos = posPrompt.ckpt
        let positive = posPrompt.positiveConditionning
        // let negative = x.conditionningNeg

        const negPrompt = run_prompt({ prompt: ui.negative, clip, ckpt })
        let negative: _CONDITIONING = graph.CLIPTextEncode({
            clip,
            text: negPrompt.positiveText + posPrompt.negativeText,
        })

        // const y = run_prompt({ richPrompt: negPrompt, clip, ckpt, outputWildcardsPicked: true })
        // let negative = y.conditionning

        // START IMAGE -------------------------------------------------------------------------------
        let { latent, width, height } = await run_latent_v3({ opts: ui.latent, vae })

        // CNETS -------------------------------------------------------------------------------
        let cnet_out: Cnet_return | undefined
        if (ui.controlnets) {
            const Cnet_args: Cnet_args = { positive, negative, width, height, ckptPos }
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
        const HRF = ui.highResFix
        if (HRF) {
            const ctx_sampler_fix: Ctx_sampler = {
                ckpt: ckptPos,
                clip: clipPos,
                vae,
                latent,
                positive: cnet_out?.post_cnet_positive ?? positive,
                negative: cnet_out?.post_cnet_negative ?? negative,
                preview: false,
            }
            if (HRF.saveIntermediaryImage) {
                graph.SaveImage({ images: graph.VAEDecode({ samples: latent, vae }) })
            }
            latent =
                HRF.upscaleMethod.id === 'regular'
                    ? graph.LatentUpscale({
                          samples: latent,
                          crop: 'disabled',
                          upscale_method: 'nearest-exact',
                          height: height * ui.highResFix.scaleFactor,
                          width: width * ui.highResFix.scaleFactor,
                      })
                    : graph.NNLatentUpscale({
                          latent,
                          version: HRF.upscaleMethod.id == 'Neural XL' ? 'SDXL' : 'SD 1.x',
                          upscale: HRF.scaleFactor,
                      })
            latent = latent = run_sampler(
                run,
                {
                    seed: ui.sampler.seed,
                    cfg: ui.sampler.cfg,
                    steps: HRF.steps,
                    denoise: HRF.denoise,
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
        if (ui.refine) {
            finalImage = run_refiners_fromImage(ui.refine, finalImage)
            // latent = graph.VAEEncode({ pixels: image, vae })
        }

        // REMOVE BACKGROUND ---------------------------------------------------------------------
        if (ui.removeBG) run_rembg_v1(ui.removeBG, finalImage)

        // SHOW 3D --------------------------------------------------------------------------------
        const show3d = ui.show3d
        if (show3d) {
            run.add_saveImage(finalImage, 'base')
            const depth = (() => {
                if (show3d.depth.MiDaS) return graph.MiDaS$7DepthMapPreprocessor({ image: finalImage })
                if (show3d.depth.Zoe) return graph.Zoe$7DepthMapPreprocessor({ image: finalImage })
                if (show3d.depth.LeReS) return graph.LeReS$7DepthMapPreprocessor({ image: finalImage })
                if (show3d.depth.Marigold) return graph.MarigoldDepthEstimation({ image: finalImage })
                throw new Error('❌ show3d activated, but no depth option choosen')
            })()
            run.add_saveImage(depth, 'depth')

            const normal = (() => {
                if (show3d.normal.id === 'MiDaS') return graph.MiDaS$7NormalMapPreprocessor({ image: finalImage })
                if (show3d.normal.id === 'BAE') return graph.BAE$7NormalMapPreprocessor({ image: finalImage })
                if (show3d.normal.id === 'None') return graph.EmptyImage({ color: 0x7f7fff, height: 512, width: 512 })
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

        const saveFormat = run_customSave(ui.customSave)
        await run.PROMPT({ saveFormat })

        if (ui.testStuff?.gaussianSplat) run.output_GaussianSplat({ url: '' })
        if (ui.testStuff?.summary) output_demo_summary(run)
        if (show3d) run.output_3dImage({ image: 'base', depth: 'depth', normal: 'normal' })

        // LOOP IF NEED BE -----------------------------------------------------------------------
        const loop = ui.loop
        if (loop) {
            const ixes = new Array(ui.loop.batchCount).fill(0).map((_, i) => i)
            for (const i of ixes) {
                await new Promise((r) => setTimeout(r, loop.delayBetween))
                await run.PROMPT({ saveFormat })
            }
        }

        if (ui.testStuff?.makeAVideo) await run.Videos.output_video_ffmpegGeneratedImagesTogether(undefined, 2)
    },
})
