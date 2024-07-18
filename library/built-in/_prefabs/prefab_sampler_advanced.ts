import type { Builder, Runtime } from '../../../src/CUSHY'
import type { OutputFor } from './_prefabs'

// ⏸️ export const shared_samplerName = () => {
// ⏸️     const form = getCurrentForm()
// ⏸️     return form.shared(
// ⏸️         'samplerName',
// ⏸️         form.enum.Enum_KSampler_sampler_name({
// ⏸️             label: 'Sampler',
// ⏸️             default: 'dpmpp_sde',
// ⏸️         }),
// ⏸️     )
// ⏸️ }

// UI -----------------------------------------------------------
export const ui_sampler_advanced = (p?: {
    denoise?: number
    steps?: number
    cfg?: number
    sampler_name?: Enum_KSampler_sampler_name
    scheduler?: Enum_KSampler_scheduler
    startCollapsed?: boolean
    sharedSampler?: boolean
}) => {
    const form: X.Builder = getCurrentForm()
    return form.fields(
        {
            sampler_name: p?.sharedSampler
                ? // ⏸️ shared_samplerName()
                  form.enum.Enum_KSampler_sampler_name({
                      label: 'Sampler',
                      default: 'dpmpp_sde',
                  })
                : form.enum.Enum_KSampler_sampler_name({
                      label: 'Sampler',
                      default: p?.sampler_name ?? 'euler',
                  }),
            guidanceType: form.choice({
                items: {
                    CFG: form.fields({
                        cfg: form.float({ step: 1, label: 'CFG', min: 0, max: 100, softMax: 10, default: p?.cfg ?? 6 }),
                    }),
                    DualCFG: form.fields({
                        cfg: form.float({ step: 1, label: 'CFG', min: 0, max: 100, softMax: 10, default: p?.cfg ?? 6 }),
                        cfg_conds2_negative: form.float({
                            step: 1,
                            label: 'CFG 2 Negative',
                            min: 0,
                            max: 100,
                            softMax: 10,
                            default: p?.cfg ?? 6,
                        }),
                        dualCFGPositive2: form.prompt({
                            default: ['highly detailed, masterpiece, best quality,'].join('\n'),
                            icon: 'mdiAlphabeticalVariant',
                            box: { base: { hue: 150, chroma: 0.05 } },
                        }),
                        //prompt2: form.prompt({}),
                    }),
                    PerpNeg: form.fields({
                        cfg: form.float({ step: 1, label: 'CFG', min: 0, max: 100, softMax: 10, default: p?.cfg ?? 6 }),
                        negCfg: form.float({
                            step: 1,
                            label: 'Negative CFG',
                            min: 0,
                            max: 100,
                            softMax: 10,
                            default: p?.cfg ?? 6,
                        }),
                    }),
                },
                appearance: 'tab',
                default: { CFG: true },
            }),
            // cfg: form.float({ step: 1, label: 'CFG', min: 0, max: 100, softMax: 10, default: p?.cfg ?? 6 }),
            //denoise: form.float({ step: 0.1, min: 0, max: 1, default: p?.denoise ?? 1, label: 'Denoise' }),
            sigmasType: form.choice({
                items: {
                    basic: form.fields({
                        denoise: form.float({ step: 0.1, min: 0, max: 1, default: p?.denoise ?? 1, label: 'Denoise' }),
                        steps: form.int({ step: 20, default: p?.steps ?? 20, label: 'Steps', min: 0, softMax: 100 }),
                        scheduler: form.enum.Enum_KSampler_scheduler({ label: 'Scheduler', default: p?.scheduler ?? 'karras' }),
                    }),
                    AlignYourStep: form.fields({
                        denoise: form.float({ step: 0.1, min: 0, max: 1, default: p?.denoise ?? 1, label: 'Denoise' }),
                        steps: form.int({ step: 1, default: p?.steps ?? 10, label: 'Steps', min: 0, softMax: 100 }),
                        modelType: form.enum.Enum_AlignYourStepsScheduler_model_type({ default: 'SDXL' }),
                    }),
                    karrasCustom: form.auto.KarrasScheduler(),
                    ExponentialCustom: form.auto.PolyexponentialScheduler(),
                    polyexponentialCustom: form.auto.PolyexponentialScheduler(),
                    SDTurbo: form.auto.SDTurboScheduler(),
                    VPScheduler: form.auto.VPScheduler(),
                },
                appearance: 'tab',
            }),
            seed: form.seed({}),
            textEncoderType: form.choice({
                appearance: 'tab',
                items: {
                    CLIP: form.group({}),
                    SDXL: form.group({}),
                },
            }),
            // steps: form.int({ step: 10, default: p?.steps ?? 20, label: 'Steps', min: 0, softMax: 100 }),
        },
        {
            summary: (ui) => {
                let sigmas: string = ''
                if (ui.sigmasType.basic) {
                    sigmas = 'basic'
                } else if (ui.sigmasType.AlignYourStep) {
                    sigmas = 'AYS'
                }
                if (ui.sigmasType.karrasCustom) {
                    sigmas = 'karrasCustom'
                }
                if (ui.sigmasType.ExponentialCustom) {
                    sigmas = 'exponentialCustom'
                }
                if (ui.sigmasType.polyexponentialCustom) {
                    sigmas = 'polyexponentialCustom'
                }
                let guidance: string = ''
                let cfg: string = ''
                if (ui.guidanceType.CFG) {
                    guidance = 'CFG'
                    cfg = String(ui.guidanceType.CFG.cfg)
                } else if (ui.guidanceType.DualCFG) {
                    guidance = 'Dual CFG'
                    cfg = String(ui.guidanceType.DualCFG.cfg) + '/' + String(ui.guidanceType.DualCFG.cfg_conds2_negative)
                }
                if (ui.guidanceType.PerpNeg) {
                    guidance = 'PerpNeg'
                    cfg = String(ui.guidanceType.PerpNeg.cfg + '/' + ui.guidanceType.PerpNeg.negCfg)
                }

                return `sigmas:${sigmas} guide:${guidance} cfg:${cfg} `
            },
            icon: 'mdiTimerSandComplete',
            box: { base: { hue: 300, chroma: 0.1 } },
            label: 'Sampler',
            startCollapsed: p?.startCollapsed ?? false,
        },
    )
}

// CTX -----------------------------------------------------------
export type Ctx_sampler_advanced = {
    ckpt: _MODEL
    clip: _CLIP
    latent: _LATENT | HasSingle_LATENT
    positive: string | _CONDITIONING
    positive2: _CONDITIONING
    negative: string | _CONDITIONING
    width?: number
    height?: number
    preview?: boolean
    vae: _VAE
}

export const encodeText = (
    run: Runtime,
    clip: _CLIP,
    text: string,
    encodingType: 'SDXL' | 'CLIP',
    width?: number,
    height?: number,
): _CONDITIONING => {
    const graph = run.nodes

    const condition =
        encodingType == 'SDXL'
            ? graph.CLIPTextEncodeSDXL({
                  clip: clip,
                  text_g: text,
                  text_l: text,
                  width: width ?? 1024,
                  height: height ?? 1024,
                  target_width: width ?? 1024,
                  target_height: height ?? 1024,
              })
            : graph.CLIPTextEncode({
                  clip: clip,
                  text: text,
              })

    return condition
}
// RUN -----------------------------------------------------------
export const run_sampler_advanced = (
    run: Runtime,
    ui: OutputFor<typeof ui_sampler_advanced>,
    ctx: Ctx_sampler_advanced,
    blankLatent?: boolean,
): { output: _LATENT; denoised_output: _LATENT } => {
    const graph = run.nodes
    let ckpt = ctx.ckpt
    // flow.output_text(`run_sampler with seed : ${opts.seed}`)
    const posCondition: _CONDITIONING =
        typeof ctx.positive === 'string'
            ? encodeText(run, ctx.clip, ctx.positive, ui.textEncoderType.SDXL ? 'SDXL' : 'CLIP', ctx.width, ctx.height)
            : ctx.positive
    const negCondition: _CONDITIONING =
        typeof ctx.negative === 'string'
            ? encodeText(run, ctx.clip, ctx.negative, ui.textEncoderType.SDXL ? 'SDXL' : 'CLIP', ctx.width, ctx.height)
            : ctx.negative

    const noise = graph.RandomNoise({ noise_seed: ui.seed }).outputs.NOISE
    let guider: _GUIDER
    if (ui.guidanceType.DualCFG) {
        guider = graph.DualCFGGuider({
            model: ckpt,
            cond1: posCondition,
            cond2: ctx.positive2,
            negative: negCondition,
            cfg_conds: ui.guidanceType.DualCFG.cfg,
            cfg_cond2_negative: ui.guidanceType.DualCFG.cfg_conds2_negative,
        })
    } else if (ui.guidanceType.PerpNeg)
        guider = graph.PerpNegGuider({
            model: ckpt,
            positive: posCondition,
            negative: negCondition,
            empty_conditioning: graph.CLIPTextEncode({ clip: ctx.clip, text: '' }),
            cfg: ui.guidanceType.PerpNeg.cfg,
            neg_scale: ui.guidanceType.PerpNeg.negCfg,
        })
    else if (ui.guidanceType.CFG)
        guider = graph.CFGGuider({
            model: ckpt,
            positive: posCondition,
            negative: negCondition,
            cfg: ui.guidanceType.CFG.cfg,
        })
    else throw new Error('❌ Guider type not known')

    let sigmas: _SIGMAS
    if (ui.sigmasType.basic) {
        sigmas = graph.BasicScheduler({
            scheduler: ui.sigmasType.basic.scheduler,
            steps: ui.sigmasType.basic.steps,
            denoise: blankLatent ? 1 : ui.sigmasType.basic.denoise,
            model: ckpt,
        })
    } else if (ui.sigmasType.AlignYourStep) {
        sigmas = graph.AlignYourStepsScheduler({
            model_type: ui.sigmasType.AlignYourStep.modelType,
            denoise: blankLatent ? 1 : ui.sigmasType.AlignYourStep.denoise,
            steps: ui.sigmasType.AlignYourStep.steps,
        })
    } else if (ui.sigmasType.karrasCustom) {
        sigmas = graph.KarrasScheduler(ui.sigmasType.karrasCustom)
    } else if (ui.sigmasType.ExponentialCustom) {
        sigmas = graph.ExponentialScheduler(ui.sigmasType.ExponentialCustom)
    } else if (ui.sigmasType.polyexponentialCustom) {
        sigmas = graph.PolyexponentialScheduler(ui.sigmasType.polyexponentialCustom)
    } else if (ui.sigmasType.VPScheduler) {
        sigmas = graph.VPScheduler(ui.sigmasType.VPScheduler)
    } else if (ui.sigmasType.SDTurbo) {
        sigmas = graph.SDTurboScheduler({ model: ckpt, ...ui.sigmasType.SDTurbo })
    } else {
        throw new Error('❌ Sigmas type not known')
    }

    const SamplerCustom = graph.SamplerCustomAdvanced({
        noise: noise,
        guider: guider,
        sampler: graph.KSamplerSelect({ sampler_name: ui.sampler_name }),
        sigmas: sigmas,
        latent_image: ctx.latent,
    })

    return {
        output: SamplerCustom.outputs.output,
        denoised_output: SamplerCustom.outputs.denoised_output,
    }
}
