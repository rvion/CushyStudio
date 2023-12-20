import type { Runtime } from 'src/back/Runtime'
import type { FormBuilder } from 'src/controls/FormBuilder'
import type { OutputFor } from './_prefabs'

// UI -----------------------------------------------------------
export const ui_sampler = (form: FormBuilder) => {
    return form.group({
        items: () => ({
            denoise: form.float({ step: 0.01, min: 0, max: 1, default: 1, label: 'Denoise', group: 'KSampler' }),
            steps: form.int({ default: 20, label: 'Steps', min: 0, group: 'KSampler' }),
            cfg: form.float({ label: 'CFG', min: 3, max: 20, default: 8, group: 'KSampler' }),
            seed: form.seed({ group: 'KSampler' }),
            sampler_name: form.enum({
                label: 'Sampler',
                enumName: 'Enum_KSampler_sampler_name',
                default: 'euler',
                group: 'KSampler',
            }),
            scheduler: form.enum({
                label: 'Scheduler',
                enumName: 'Enum_KSampler_scheduler',
                default: 'karras',
                group: 'KSampler',
            }),
        }),
    })
}

// CTX -----------------------------------------------------------
export type Ctx_sampler = {
    ckpt: _MODEL
    clip: _CLIP
    latent: HasSingle_LATENT
    positive: string | _CONDITIONING
    negative: string | _CONDITIONING
    preview?: boolean
    vae: _VAE
}

// RUN -----------------------------------------------------------
export const run_sampler = (flow: Runtime, opts: OutputFor<typeof ui_sampler>, ctx: Ctx_sampler): { latent: KSampler } => {
    const graph = flow.nodes
    // flow.output_text(`run_sampler with seed : ${opts.seed}`)
    const latent = graph.KSampler({
        model: ctx.ckpt,
        seed: opts.seed,
        latent_image: ctx.latent,
        cfg: opts.cfg,
        steps: opts.steps,
        sampler_name: opts.sampler_name,
        scheduler: opts.scheduler,
        denoise: opts.denoise,
        positive:
            typeof ctx.positive === 'string' //
                ? graph.CLIPTextEncode({ clip: ctx.clip, text: ctx.positive })
                : ctx.positive,
        negative:
            typeof ctx.negative === 'string' //
                ? graph.CLIPTextEncode({ clip: ctx.clip, text: ctx.negative })
                : ctx.negative,
    })
    // const image = graph.VAEDecode({
    //     vae: ctx.vae,
    //     samples: latent,
    // })
    if (ctx.preview)
        graph.PreviewImage({
            images: graph.VAEDecode({
                vae: ctx.vae,
                samples: latent,
            }),
        })
    return { latent }
}
