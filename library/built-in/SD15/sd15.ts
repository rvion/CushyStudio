import { Cnet_args, Cnet_return, run_cnet } from '../_controlNet/prefab_cnet'
import { run_IPAdapterV2 } from '../_ipAdapter/prefab_ipAdapter_baseV2'
import { run_FaceIDV2 } from '../_ipAdapter/prefab_ipAdapter_faceV2'
import { run_Dispacement1, run_Dispacement2 } from '../_prefabs/prefab_3dDisplacement'
import { run_refiners_fromImage } from '../_prefabs/prefab_detailer'
import { run_latent_v3 } from '../_prefabs/prefab_latent_v3'
import { output_demo_summary } from '../_prefabs/prefab_markdown'
import { run_mask } from '../_prefabs/prefab_mask'
import { run_model_modifiers } from '../_prefabs/prefab_model_extras'
import { run_prompt } from '../_prefabs/prefab_prompt'
import { run_advancedPrompt } from '../_prefabs/prefab_promptsWithButtons'
import { run_regionalPrompting_v1 } from '../_prefabs/prefab_regionalPrompting_v1'
import { run_rembg_v1 } from '../_prefabs/prefab_rembg'
import { type Ctx_sampler, run_sampler } from '../_prefabs/prefab_sampler'
import { type Ctx_sampler_advanced, run_sampler_advanced } from '../_prefabs/prefab_sampler_advanced'
import { run_upscaleWithModel } from '../_prefabs/prefab_upscaleWithModel'
import { run_addFancyWatermarkToAllImage, run_watermark_v1 } from '../_prefabs/prefab_watermark'
import { run_customSave } from '../_prefabs/saveSmall'
import { CustomView3dCan } from '../_views/View_3d_TinCan'
import { CustomViewSpriteSheet } from '../_views/View_Spritesheets'
import { eval_model_SD15 } from './prefab_model_SD15'
import { CushySD15UI } from './sd15UI'

app({
    metadata: {
        name: 'Cushy SD15',
        illustration: 'library/built-in/_illustrations/mc.jpg',
        description: 'An example app to play with various stable diffusion technologies. Feel free to contribute improvements to it.', // prettier-ignore
    },
    ui: CushySD15UI,
    run: async (run, ui, ctx) => {
        const graph = run.nodes
        // #region  MODEL, clip skip, vae, etc.
        let { ckpt, vae, clip } = eval_model_SD15(ui.model)

        // #region  PROMPT ENGINE
        let positiveText = ui.positive.text
        if (ui.extra.promtPlus) positiveText += run_advancedPrompt(ui.extra.promtPlus)
        const posPrompt = run_prompt({ prompt: { text: positiveText }, clip, ckpt, printWildcards: true })
        const clipPos = posPrompt.clip
        let ckptPos = posPrompt.ckpt
        let positive: _CONDITIONING = posPrompt.conditioning // graph.CLIPTextEncode({ clip: clipPos, text: finalText })
        if (ui.extra.regionalPrompt)
            positive = run_regionalPrompting_v1(ui.extra.regionalPrompt, { conditionning: positive, clip })
        const negPrompt = run_prompt({ prompt: ui.negative, clip, ckpt })
        let negative: _CONDITIONING = graph.CLIPTextEncode({ clip, text: negPrompt.promptIncludingBreaks })

        // #region START IMAGE
        const imgCtx = ctx.image
        let { latent, width, height } = imgCtx
            ? /* 🔴 HACKY  */
              await (async (): Promise<{ latent: _LATENT; height: number; width: number }> => ({
                  latent: graph.VAEEncode({ pixels: await imgCtx.loadInWorkflow(), vae }),
                  height: imgCtx.height,
                  width: imgCtx.width,
              }))()
            : await run_latent_v3({ opts: ui.latent, vae })

        // #region mask
        let mask: Maybe<_MASK>
        if (ui.extra.mask) mask = await run_mask(ui.extra.mask, ctx.mask)
        if (mask) latent = graph.SetLatentNoiseMask({ mask, samples: latent })

        // #region CNETS
        let cnet_out: Cnet_return | undefined
        if (ui.controlnets) {
            const Cnet_args: Cnet_args = { positive, negative, width, height, ckptPos }
            cnet_out = await run_cnet(ui.controlnets, Cnet_args)
            positive = cnet_out.cnet_positive
            negative = cnet_out.cnet_negative
            ckptPos = cnet_out.ckpt_return //only used for ipAdapter, otherwise it will just be a passthrough
        }

        let ip_adapter: _IPADAPTER | undefined
        if (ui.ipAdapter) {
            const ipAdapter_out = await run_IPAdapterV2(ui.ipAdapter, ckptPos, ip_adapter)
            ckptPos = ipAdapter_out.ip_adapted_model
            ip_adapter = ipAdapter_out.ip_adapter
        }
        if (ui.faceID) {
            const faceID_out = await run_FaceIDV2(ui.faceID, ckptPos, ip_adapter)
            ckptPos = faceID_out.ip_adapted_model
            ip_adapter = faceID_out.ip_adapter
        }

        // FIRST PASS --------------------------------------------------------------------------------
        const ctx_sampler_advanced: Ctx_sampler_advanced = {
            ckpt: run_model_modifiers(ui.model.extra, ckptPos, false),
            clip: clipPos,
            vae,
            // @ts-ignore 🔴 TODO: review this one
            latent,
            positive: positive,
            negative: negative,
            preview: false,
            width: width,
            height: height,
            cfg: ui.sampler?.textEncoderType.FLUX ? ui.sampler.guidanceType?.CFG : undefined,
        }
        latent = run_sampler_advanced(run, ui.sampler, ctx_sampler_advanced).output

        // RECURSIVE PASS ----------------------------------------------------------------------------
        const extra = ui.extra
        if (extra.recursiveImgToImg) {
            for (let i = 0; i < extra.recursiveImgToImg.loops; i++) {
                latent = run_sampler_advanced(
                    run,
                    {
                        seed: ui.sampler.seed + i,
                        guidanceType: { CFG: extra.recursiveImgToImg.cfg },
                        sigmasType: {
                            basic: {
                                steps: extra.recursiveImgToImg.steps,
                                denoise: extra.recursiveImgToImg.denoise,
                                scheduler: 'ddim_uniform',
                            },
                        },
                        sampler_name: 'ddim',
                        textEncoderType: ui.sampler.textEncoderType,
                    },
                    { ...ctx_sampler_advanced, latent, preview: true },
                ).output
            }
        }

        // REFINE PASS BEFORE -------------
        // if (ui.improveFaces) {
        //     const image = run_improveFace_fromLatent(latent)
        //     latent = graph.VAEEncode({ pixels: image, vae })
        // }

        // SECOND PASS (a.k.a. highres fix) ---------------------------------------------------------
        const HRF = ui.extra.highResFix
        if (HRF) {
            const ctx_sampler_fix: Ctx_sampler = {
                ckpt: run_model_modifiers(ui.model.extra, ckptPos, true, HRF.scaleFactor),
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
                HRF.upscaleMethod === 'regular'
                    ? graph.LatentUpscale({
                          samples: latent,
                          crop: 'disabled',
                          upscale_method: 'nearest-exact',
                          height: height * HRF.scaleFactor,
                          width: width * HRF.scaleFactor,
                      })
                    : graph.NNLatentUpscale({
                          latent,
                          version: HRF.upscaleMethod == 'Neural XL' ? 'SDXL' : 'SD 1.x',
                          upscale: HRF.scaleFactor,
                      })
            if (mask) latent = graph.SetLatentNoiseMask({ mask, samples: latent })
            latent = run_sampler(
                run,
                {
                    seed: ui.sampler.seed,
                    cfg:
                        ui.sampler.guidanceType.CFG ??
                        ui.sampler.guidanceType.DualCFG?.cfg ??
                        ui.sampler.guidanceType.PerpNeg?.cfg ??
                        6,
                    steps: HRF.steps,
                    denoise: HRF.denoise,
                    sampler_name: HRF.useMainSampler ? ui.sampler.sampler_name : 'ddim',
                    scheduler: !HRF.useMainSampler ? 'ddim_uniform' : (ui.sampler.sigmasType.basic?.scheduler ?? 'ddim_uniform'),
                },
                { ...ctx_sampler_fix, latent, preview: false },
            ).latent
        }

        // UPSCALE with upscale model ------------------------------------------------------------
        // TODO

        // ---------------------------------------------------------------------------------------
        let finalImage: _IMAGE = graph.VAEDecode({ samples: latent, vae })

        // REFINE PASS AFTER ---------------------------------------------------------------------
        if (extra.refine) {
            finalImage = run_refiners_fromImage(extra.refine, finalImage)
            // latent = graph.VAEEncode({ pixels: image, vae })
        }

        // REMOVE BACKGROUND ---------------------------------------------------------------------
        if (ui.extra.removeBG) {
            const sub = run_rembg_v1(ui.extra.removeBG, finalImage)
            if (sub.length > 0) finalImage = graph.AlphaChanelRemove({ images: sub[0]! })
        }

        // SHOW 3D -------------------------------------------------------------------------------
        const show3d = ui.extra.show3d
        if (show3d) run_Dispacement1(show3d, finalImage)
        else graph.SaveImage({ images: finalImage })

        // UPSCALE with upscale model ------------------------------------------------------------
        if (ui.extra.upscaleWithModel) finalImage = run_upscaleWithModel(ui.extra.upscaleWithModel, { image: finalImage })

        const saveFormat = run_customSave(ui.customSave)
        await run.PROMPT({ saveFormat })

        if (ui.extra?.gaussianSplat) run.output_GaussianSplat({ url: '' })
        if (ui.extra?.summary) output_demo_summary(run)
        if (show3d) run_Dispacement2('base')
        if (ui.extra.displayAsBeerCan) run.output_custom({ view: CustomView3dCan, params: { imageID: run.lastImage?.id } })
        if (ui.extra.displayAsSpriteSheet)
            run.output_custom({ view: CustomViewSpriteSheet, params: { imageID: run.lastImage?.id } })

        // LOOP IF NEED BE -----------------------------------------------------------------------
        if (ui.extra.watermark) await run_watermark_v1(ui.extra.watermark, run.lastImage)
        if (ui.extra.fancyWatermark) await run_addFancyWatermarkToAllImage()
        if (ui.extra?.makeAVideo) await run.Videos.output_video_ffmpegGeneratedImagesTogether(undefined, 2)
    },
})
