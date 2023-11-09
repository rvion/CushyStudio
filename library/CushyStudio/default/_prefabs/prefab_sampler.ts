import type { Runtime } from 'src/back/Runtime'
import type { FormBuilder } from 'src/controls/FormBuilder'
import { OutputFor } from '../_prefabs'

// UI -----------------------------------------------------------
export const ui_sampler = (form: FormBuilder) => {
    return form.group({
        items: () => ({
            denoise: form.float({ step: 0.01, min: 0, max: 1, default: 1, label: 'Denoise', group: 'KSampler' }),
            steps: form.int({ default: 20, label: 'Steps', min: 0, group: 'KSampler' }),
            cfg: form.float({
                label: 'CFG',
                min: 3,
                max: 20,
                default: 8,
                group: 'KSampler',
            }),
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

// RUN -----------------------------------------------------------
export const run_sampler = (p: {
    //
    flow: Runtime
    ckpt: _MODEL
    clip: _CLIP
    latent: HasSingle_LATENT
    positive: string | _CONDITIONING
    negative: string | _CONDITIONING
    model: OutputFor<typeof ui_sampler>
    preview?: boolean
    vae: _VAE
}): { image: VAEDecode; latent: HasSingle_LATENT } => {
    const graph = p.flow.nodes
    const latent: HasSingle_LATENT = graph.KSampler({
        model: p.ckpt,
        seed: p.flow.randomSeed(),
        latent_image: p.latent,
        cfg: p.model.cfg,
        steps: p.model.steps,
        sampler_name: p.model.sampler_name,
        scheduler: p.model.scheduler,
        denoise: p.model.denoise,
        positive: typeof p.positive === 'string' ? graph.CLIPTextEncode({ clip: p.clip, text: p.positive }) : p.positive,
        negative: typeof p.negative === 'string' ? graph.CLIPTextEncode({ clip: p.clip, text: p.negative }) : p.negative,
    })
    const image = graph.VAEDecode({
        vae: p.vae,
        samples: latent,
    })
    if (p.preview) graph.PreviewImage({ images: image })
    return { image, latent }
}
