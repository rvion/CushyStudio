import type { OutputFor } from './_prefabs'
import type { FormBuilder } from 'src/controls/FormBuilder'
import type { Runtime } from 'src/runtime/Runtime'

// UI -----------------------------------------------------------
export const ui_sampler = () => {
    const form: FormBuilder = getCurrentForm()
    return form.group({
        summary: (ui) => {
            return `denoise:${ui.denoise} steps:${ui.steps} cfg:${ui.cfg}`
        },
        items: () => ({
            denoise: form.float({ step: 0.1, min: 0, max: 1, default: 1, label: 'Denoise' }),
            steps: form.int({ step: 10, default: 20, label: 'Steps', min: 0, softMax: 100 }),
            cfg: form.float({ step: 1, label: 'CFG', min: 0, max: 100, softMax: 10, default: 8 }),
            seed: form.seed({}),
            sampler_name: form.enum.Enum_KSampler_sampler_name({ label: 'Sampler', default: 'euler' }),
            scheduler: form.enum.Enum_KSampler_scheduler({ label: 'Scheduler', default: 'karras' }),
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
export const run_sampler = (run: Runtime, opts: OutputFor<typeof ui_sampler>, ctx: Ctx_sampler): { latent: KSampler } => {
    const graph = run.nodes
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
