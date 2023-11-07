import * as _ from './_prefabs'

card({
    ui: (form) => ({
        model: _.ui_model(form),
        sampler: _.ui_sampler(form),
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
            default: 'nsfw, nude, girl, woman, human',
        }),
        latent: _.ui_latent(form),
        seed: form.seed({}),
        highResFix: _.ui_highresfix(form),
        loop: form.groupOpt({
            items: () => ({
                batchCount: form.int({ default: 1 }),
                delayBetween: form.int({
                    tooltip: 'in ms',
                    default: 0,
                }),
            }),
        }),
        recursiveImgToImg: form.groupOpt({
            items: () => ({
                steps: form.int({ default: 5 }),
                denoise: form.float({ min: 0, max: 1, step: 0.01, default: 0.3 }),
            }),
        }),
        // startImage
        removeBG: form.bool({ default: false }),
        extra: form.groupOpt({
            items: () => ({
                reverse: form.bool({ default: false }),
                show3d: form.groupOpt({
                    items: () => ({
                        normal: form.selectOne({
                            default: { type: 'MiDaS' },
                            choices: [{ type: 'MiDaS' }, { type: 'BAE' }],
                        }),
                        depth: form.selectOne({
                            default: { type: 'Zoe' },
                            choices: [{ type: 'MiDaS' }, { type: 'Zoe' }, { type: 'LeReS' }],
                        }),
                    }),
                }),
            }),
        }),
    }),

    run: async (flow, p) => {
        const graph = flow.nodes
        // MODEL, clip skip, vae, etc. ---------------------------------------------------------------
        let { ckpt, vae, clip } = _.run_model(flow, p.model)

        // RICH PROMPT ENGINE -------- ---------------------------------------------------------------
        const x = _.run_prompt(flow, { richPrompt: p.positive, clip, ckpt })
        const clipPos = x.clip
        const ckptPos = x.ckpt
        const positive = x.conditionning

        const y = _.run_prompt(flow, { richPrompt: p.negative, clip, ckpt })
        const negative = y.conditionning

        // START IMAGE -------------------------------------------------------------------------------
        let { latent } = await _.run_latent({ flow, opts: p.latent, vae })

        // FIRST PASS --------------------------------------------------------------------------------
        const fstPass = _.run_sampler({
            ckpt: ckptPos,
            clip: clipPos,
            vae,
            flow,
            latent,
            model: p.sampler,
            positive: positive,
            negative: negative,
            preview: false,
        })
        latent = fstPass.latent

        if (p.recursiveImgToImg) {
            for (let i = 0; i < p.recursiveImgToImg.steps; i++) {
                latent = _.run_sampler({
                    ckpt: ckptPos,
                    clip: clipPos,
                    vae,
                    flow,
                    latent,
                    model: {
                        // reuse model stuff
                        cfg: p.sampler.cfg,
                        sampler_name: 'ddim',
                        scheduler: 'ddim_uniform',
                        // override the snd pass specific stuff
                        denoise: p.recursiveImgToImg.denoise,
                        steps: 10,
                    },
                    positive: positive,
                    negative: negative,
                    preview: true,
                }).latent
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
                height: p.latent.height * p.highResFix.scaleFactor,
                width: p.latent.width * p.highResFix.scaleFactor,
            })
            const sndPass = _.run_sampler({
                ckpt: ckptPos,
                clip: clipPos,
                vae,
                flow,
                latent,
                model: {
                    // reuse model stuff
                    cfg: p.sampler.cfg,
                    sampler_name: 'ddim',
                    scheduler: 'ddim_uniform',
                    // override the snd pass specific stuff
                    denoise: p.highResFix.denoise,
                    steps: p.highResFix.steps,
                },
                positive: positive,
                negative: negative,
                preview: true,
            })
            latent = sndPass.latent
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
        const show3d = p.extra?.show3d
        if (show3d) {
            flow.add_saveImage(finalImage, 'base')

            const depth = (() => {
                if (show3d.depth.type === 'MiDaS') return graph.MiDaS$7DepthMapPreprocessor({ image: finalImage })
                if (show3d.depth.type === 'Zoe') return graph.Zoe$7DepthMapPreprocessor({ image: finalImage })
                if (show3d.depth.type === 'LeReS') return graph.LeReS$7DepthMapPreprocessor({ image: finalImage })
                return exhaust(show3d.depth)
            })()
            flow.add_saveImage(depth, 'depth')

            const normal = (() => {
                if (show3d.normal.type === 'MiDaS') return graph.MiDaS$7NormalMapPreprocessor({ image: finalImage })
                if (show3d.normal.type === 'BAE') return graph.BAE$7NormalMapPreprocessor({ image: finalImage })
                return exhaust(show3d.normal)
            })()
            flow.add_saveImage(normal, 'normal')
        }

        await flow.PROMPT()
        flow.out_3dImage({ image: 'base', depth: 'depth', normal: 'normal' })

        // LOOP IF NEED BE -----------------------------------------------------------------------
        const loop = p.loop
        if (loop) {
            const ixes = new Array(p.loop.batchCount).fill(0).map((_, i) => i)
            for (const i of ixes) {
                await new Promise((r) => setTimeout(r, loop.delayBetween))
                await flow.PROMPT()
            }
        }
    },
})

// if (p.extra?.reversePrompt) {
//     // FUNNY PROMPT REVERSAL
//     positive.set({ text: p.negative ?? '' })
//     negative.set({ text: p.positive ?? '' })
//     await flow.PROMPT()
// }

// patch
// if (p.tomeRatio != null && p.tomeRatio !== false) {
//     const tome = graph.TomePatchModel({ model, ratio: p.tomeRatio })
//     model = tome.MODEL
// }
