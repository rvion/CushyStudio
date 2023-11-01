import * as _ from './_prefabs'

action({
    author: 'VinsiGit',
    name: 'Normal',
    description: 'Make a Image',
    help: 'Find me on the CushyStudio Discord as Vinsi',
    ui: (form) => ({
        startImage: _.ui_latent(form),
        model: _.ui_sampler(form),
        positive: form.prompt({ label: 'Positive prompt' }),
        negative: form.prompt({ label: 'Negative prompt' }),
        themesHead: _.ui_themes(form),
    }),
    run: async (flow, p) => {
        const graph = flow.nodes

        let negative = ''
        let positive = ''

        let ckpt = graph.CheckpointLoaderSimple({ ckpt_name: p.model.modelName })
        let clipAndModelPositive: HasSingle_CLIP & HasSingle_MODEL = ckpt
        let clipAndModelNegative: HasSingle_CLIP & HasSingle_MODEL = ckpt

        const posRes = _.run_prompt(flow, p.positive, clipAndModelPositive)
        const negRes = _.run_prompt(flow, p.negative, clipAndModelNegative)
        clipAndModelPositive = posRes.clipAndModel
        clipAndModelPositive = negRes.clipAndModel
        positive += posRes.text
        negative += posRes.text
        negative += '(child:1.2, loli:1.2), '

        const clipAndModel = clipAndModelPositive

        let { latent } = await _.run_latent({ flow, opts: p.startImage, vae: ckpt })

        if (p.themesHead.length != 0) {
            for (const themeHead of p.themesHead) {
                for (const theme of themeHead.theme) {
                    flow.print(theme.text)
                    let posit_text = _.braceExpansion(`${positive}, ${themeHead.text} ${theme.text}`)
                    for (const text of posit_text) {
                        const image = _.run_sampler({
                            flow,
                            ckpt,
                            clipAndModel,
                            latent,
                            positive: text,
                            negative,
                            model: p.model,
                            preview: true,
                        })
                    }
                }
            }
        } else {
            let posit_text = _.braceExpansion(`${positive}`)

            for (const text of posit_text) {
                const image = _.run_sampler({
                    flow,
                    ckpt,
                    clipAndModel,
                    latent,
                    positive: text,
                    negative,
                    model: p.model,
                    preview: true,
                })
            }
        }
        await flow.PROMPT()
    },
})
