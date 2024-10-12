import type { ComfyWorkflowBuilder } from '../../../src/back/NodeBuilder'
import type { Field_group_value } from '../../../src/csuite/fields/group/FieldGroup'
import type { $extra1 } from '../_extra/extra1'

import { isFieldChoice, isFieldGroup } from '../../../src/csuite/fields/WidgetUI.DI'
import { hashStringToNumber } from '../../../src/csuite/hashUtils/hash'
import { Cnet_args, Cnet_return, run_cnet, type UI_cnet } from '../_controlNet/prefab_cnet'
import { type $extra2, eval_extra2 } from '../_extra/extra2'
import { run_IPAdapterV2, type UI_IPAdapterV2 } from '../_ipAdapter/prefab_ipAdapter_baseV2'
import { run_FaceIDV2, type UI_IPAdapterFaceIDV2 } from '../_ipAdapter/prefab_ipAdapter_faceV2'
import { run_Dispacement1, run_Dispacement2 } from '../_prefabs/prefab_3dDisplacement'
import { run_refiners_fromImage } from '../_prefabs/prefab_detailer'
import { run_latent_v3, type UI_LatentV3 } from '../_prefabs/prefab_latent_v3'
import { run_mask } from '../_prefabs/prefab_mask'
import { evalModelExtras_part2 } from '../_prefabs/prefab_model_extras'
import { run_prompt } from '../_prefabs/prefab_prompt'
import { run_advancedPrompt } from '../_prefabs/prefab_promptsWithButtons'
import { run_regionalPrompting_v1 } from '../_prefabs/prefab_regionalPrompting_v1'
import { run_rembg_v1 } from '../_prefabs/prefab_rembg'
import { type Ctx_sampler, run_sampler } from '../_prefabs/prefab_sampler'
import { type Ctx_sampler_advanced, run_sampler_advanced, type UI_Sampler_Advanced } from '../_prefabs/prefab_sampler_advanced'
import { run_upscaleWithModel } from '../_prefabs/prefab_upscaleWithModel'
import { run_customSave, type UI_customSave } from '../_prefabs/saveSmall'
import { type $prefabModelSD15andSDXL, evalModelSD15andSDXL } from '../SD15/_model_SD15_SDXL'
import { CushySDXLUI } from './_cushySDXLUI'

app({
    metadata: {
        name: 'Cushy SDXL',
        illustration: 'library/built-in/_illustrations/mc.jpg',
        description: 'An example app to play with various stable diffusion technologies. Feel free to contribute improvements to it.', // prettier-ignore
    },
    ui: CushySDXLUI,
    layout2: (f) => f.Controlnets,
    layout: (ui) => {
        const xxx = ui.field.Latent.bField
        // ui.apply({
        //     layout: () => [
        //         //
        //         <div>{`${xxx.logicalParent?.path} | ${xxx.logicalParent?.type}`}</div>,
        //         <div>{`${xxx.logicalParent?.logicalParent?.path} | ${xxx.logicalParent?.logicalParent?.type}`}</div>,
        //         <div>{`${xxx.type}`}</div>,
        //         '*',
        //     ],
        //     // layout: () => [
        //     //     <Card hue={knownOKLCHHues.success}>
        //     //         <ui.field.Positive.UI />
        //     //         <ui.field.PositiveExtra.UI />
        //     //         {ui.field.Extra.fields.promtPlus && <ui.field.Extra.fields.promtPlus.UI />}
        //     //         {ui.field.Extra.fields.regionalPrompt && <ui.field.Extra.fields.regionalPrompt.UI />}
        //     //     </Card>,
        //     //     <Card hue={knownOKLCHHues.info}>
        //     //         <ui.field.Model.UI />
        //     //     </Card>,
        //     //     '*',
        //     // ],
        // })

        const model = ui.field.Model
        const latent = ui.field.Latent
        ui.for(latent.bField, { Shell: ui.catalog.Shell.Left })
        // ui.for(ui.field.PositiveExtra, { Title: null })
        // ui.for(ui.field.Model.Extra.fields.pag, {
        //     Shell: ui.catalog.Shell.Left,
        //     Title: ui.catalog.Title.h3,
        //     Decoration: ui.catalog.Decorations.Card,
        // })

        ui.forAllFields((ui2) => {
            // ui2.apply()
            const isTopLevelGroup = ui2.field.depth === 1 && true //
            // (ui2.field.type === 'group' || ui2.field.type === 'list' || ui2.field.type === 'choices')
            if (ui.field.Positive.Prompts.childrenAll.includes(ui2.field.parent)) {
                ui2.apply({
                    Icon: false,
                    Shell: ui.catalog.Shell.List1,
                })
            }
            if (isTopLevelGroup) {
                ui2.apply({
                    Decoration: (p) => <ui.catalog.Decorations.Card hue={hashStringToNumber(ui2.field.path)} {...p} />,
                    Title: ui2.catalog.Title.h3,
                })
            }
            if (ui2.field.path.startsWith(latent.path + '.') && ui2.field.type !== 'shared')
                ui2.apply({ Shell: ui.catalog.Shell.Right })

            if (ui2.field.path.startsWith(model.path + '.')) ui2.apply({ Shell: ui.catalog.Shell.Right })
            if (ui2.field.path.startsWith(ui.field.Sampler.path + '.')) {
                if (ui2.field.type === 'group' || ui2.field.type === 'list' || ui2.field.type === 'choices')
                    ui2.apply({ Title: ui.catalog.Title.h4 })
                ui2.apply({ Shell: ui.catalog.Shell.Right })
            }

            // 🟢 disable "head" sections in choice > groups
            if (isFieldGroup(ui2.field) && isFieldChoice(ui2.field.parent)) return { Head: false }
        })
    },
    run: async (run, ui, ctx) => {
        const graph = run.nodes
        // #region  MODEL, clip skip, vae, etc.
        let { ckpt, vae, clip: clip_ } = evalModelSD15andSDXL(ui.model)

        // #region PROMPT ENGINE -- POSITIVE
        const mergeConditionning = (
            //
            a: _CONDITIONING | undefined,
            b: _CONDITIONING,
        ): _CONDITIONING => {
            if (a == null) return b
            return graph.ConditioningCombine({ conditioning_1: a, conditioning_2: b })
        }

        let ckptPos = ckpt
        let clipPos = clip_
        let positive!: _CONDITIONING
        for (const prompt of ui.positive.prompts) {
            if (prompt == null /* disabled */) continue
            const res = evalPrompt(prompt.text, ui, clipPos, ckptPos, graph)
            positive = mergeConditionning(positive, res.conditioning)
            ckptPos = res.ckpt
            clipPos = res.clip
        }

        const allArtists = []
        if (ui.positive.artists && ui.positive.artists.length > 0) allArtists.push(...ui.positive.artists)
        // if (ui.positiveExtra.artistsV2 && ui.positiveExtra.artistsV2.length > 0) allArtists.push(...ui.positiveExtra.artistsV2)
        if (allArtists.length > 1) {
            const res = evalPrompt(allArtists.join(', '), ui, clipPos, ckptPos, graph)
            positive = mergeConditionning(positive, res.conditioning)
            ckptPos = res.ckpt
            clipPos = res.clip
        }

        if (ui.extra.promtPlus) {
            const text = run_advancedPrompt(ui.extra.promtPlus)
            const res = evalPrompt(text, ui, clipPos, ckpt, graph)
            positive = mergeConditionning(positive, res.conditioning)
            ckptPos = res.ckpt
            clipPos = res.clip
        }

        if (ui.extra.regionalPrompt)
            positive = run_regionalPrompting_v1(ui.extra.regionalPrompt, {
                conditionning: positive!,
                clip: clipPos,
            })

        // #region PROMPT ENGINE -- NEGATIVE
        let ckptNeg = ckpt
        let clipNeg = clip_
        let negative!: _CONDITIONING
        for (const prompt of ui.negative) {
            if (prompt == null /* disabled */) continue
            const res = evalPrompt(prompt.text, ui, clipNeg, ckpt, graph)
            negative = mergeConditionning(negative, res.conditioning)
            ckptNeg = res.ckpt
            clipNeg = res.clip
        }

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
            ckpt: evalModelExtras_part2(ui.model.extra, ckptPos, false),
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
                ckpt: evalModelExtras_part2(ui.model.extra, ckptPos, true, HRF.scaleFactor),
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

        if (show3d) run_Dispacement2('base')

        await eval_extra2(ui.extra2)
    },
})
function evalPrompt(
    text: string,
    ui: Field_group_value<{
        positive: X.XGroup<{
            prompts: X.XList<X.XOptional<X.XPrompt>>
        }>
        negative: X.XList<X.XOptional<X.XPrompt>>
        model: $prefabModelSD15andSDXL
        latent: UI_LatentV3
        sampler: UI_Sampler_Advanced
        customSave: UI_customSave
        controlnets: UI_cnet
        ipAdapter: X.XOptional<UI_IPAdapterV2>
        faceID: X.XOptional<UI_IPAdapterFaceIDV2>
        extra: $extra1
        extra2: $extra2
    }>,
    initialClip: _CLIP,
    initialCkpt: _MODEL,
    graph: ComfyWorkflowBuilder,
): {
    conditioning: _CONDITIONING
    ckpt: _MODEL
    clip: _CLIP
} {
    const posPrompt = run_prompt({
        prompt: { text },
        clip: initialClip,
        ckpt: initialCkpt,
        printWildcards: true,
    })
    const clip = posPrompt.clip
    let ckpt = posPrompt.ckpt
    let conditioning: _CONDITIONING = posPrompt.conditioning // graph.CLIPTextEncode({ clip: clipPos, text: finalText })
    return { conditioning, ckpt, clip }
}
