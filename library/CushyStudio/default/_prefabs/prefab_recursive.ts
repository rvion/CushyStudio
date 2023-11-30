import type { FormBuilder } from 'src/controls/FormBuilder'

// UI -----------------------------------------------------------
export const ui_recursive = (form: FormBuilder) => {
    return form.groupOpt({
        items: () => ({
            cfg: form.float({ label: 'CFG', min: 3, max: 20, default: 8 }),
            loops: form.int({ default: 5, min: 2, max: 20 }),
            denoise: form.float({ min: 0, max: 1, step: 0.01, default: 0.8 }),
            steps: form.int({ default: 2, min: 2, max: 20 }),
        }),
    })
}

// RUN -----------------------------------------------------------
// export const run_recursive = (
//     //
//     flow: Runtime,
//     opts: OutputFor<typeof ui_recursive>,
//     ctx: Ctx_sampler,
// ) => {
//     const graph = flow.nodes
//     let latent = ctx.latent
//     for (let i = 0; i < opts.loops; i++) {
//         latent = run_sampler(flow, {
//             cfg: opts.cfg,
//             steps: opts.steps,
//             denoise: opts.denoise,
//             sampler_name: 'ddim',
//             scheduler: 'ddim_uniform',
//         }, ctx).latent
//     }
//     return latent
// }
