/**
 * This is a CushyApp that allow anyone to generate a set of custom cards
 * For the slay-the-spire game
 */

import type { MediaImageL } from '../../../src/models/MediaImage'

import { bang } from '../../../src/csuite/utils/bang'
import { run_ipadapter_standalone, ui_ipadapter_standalone } from '../_ipAdapter/prefab_ipAdapter_base_standalone'
import { run_model, ui_model } from '../_prefabs/prefab_model'
import { run_prompt } from '../_prefabs/prefab_prompt'
import { View_DeckOfCards } from '../_views/View_DeckOfCards'
import { stsAssets } from './_stsAssets'
import { allCards } from './_stsCards'
import { drawCard } from './_stsDrawCard'
import { convertColors, convertKind, convertRarity } from './_stsHelpers'

app({
    metadata: {
        name: 'slay-the-spire art-pack generator',
        description: 'SlayTheSpire (STS) art-pack generator',
    },
    ui: (ui) => ({
        model: ui_model(),
        ipadapter: ui_ipadapter_standalone().optional(),
        // positive: ui.string({ default: 'masterpiece, tree' }),
        seed: ui.seed({}),
        mode: ui.selectOneV2(['xl', '1.5']),
        secondPass: ui.bool(),
        //
        rarity: ui.selectOneV2(['uncommon', 'common', 'rare']).optional(),
        colors: ui.selectOneV2(['red', 'green', 'gray']).optional(),
        kind: ui.selectOneV2(['attack', 'power', 'skill']).optional(),
        cards: ui.selectMany({
            appearance: 'select',
            choices: allCards.map((x) => {
                const color = convertColors(x.Color)
                const kind = convertKind(x.Type)
                const rarity = convertRarity(x.Rarity)
                const label = `${x.Name} ${color} ${kind} (${rarity})`
                return { id: x.ID ?? x.Name, label }
            }),
        }),
        llmModel: ui.llmModel({ default: 'openai/gpt-4' }),
        max: ui.int({ default: 3, min: 1, max: 100 }),
        promptPrefix: ui.prompt(),
        promptSuffix: ui.prompt(),
        character: ui.prompt({ default: 'an elf-robot, with blue hairs' }),

        negative: ui.prompt({ default: 'bad quality, blurry, low resolution, pixelated, noisy' }),
    }),
    run: async (run, ui) => {
        const W = 500
        const H = 380
        const workflow = run.workflow
        const graph = workflow.builder
        let { ckpt, clip, vae } = run_model(ui.model)
        if (ui.ipadapter) ckpt = (await run_ipadapter_standalone(ui.ipadapter, ckpt)).ip_adapted_model
        const isXL = ui.mode.id === 'xl'
        const height = isXL ? H * 3 : H
        const width = isXL ? W * 3 : W
        const negativeText = ui.negative.compile({ onLora: () => {} }).promptIncludingBreaks
        const charX = run_prompt({ prompt: ui.character, ckpt })

        // list of stuff to run once the generation is done
        const AFTERGENERATION: (() => Promise<MediaImageL>)[] = []

        const store = run.Store.getOrCreate<Record<string, string>>({
            key: 'card-descriptions-7',
            scope: 'global',
            makeDefaultValue: () => ({}),
        })

        let startingSeed = ui.seed
        for (const x of allCards) {
            if (AFTERGENERATION.length >= ui.max) break
            // if cards are manually specified, only use those
            if (ui.cards.length > 0) {
                const match = ui.cards.map((i) => i.id).includes(x.ID ?? x.Name)
                if (!match) continue
            }

            const color = convertColors(x.Color)
            const kind = convertKind(x.Type)
            const rarity = convertRarity(x.Rarity)
            const uid = `${x.ID ?? x.Name}-${color}-${kind}-${rarity}`

            console.log(`[🤠] `, color, kind, rarity)
            if (ui.rarity && ui.rarity.id !== rarity) continue
            if (ui.colors && ui.colors.id !== color) continue
            if (ui.kind && ui.kind.id !== kind) continue

            // ----------------------------

            const storedPrompts = store.get()
            const simplifiedDescription = x.Text.replaceAll(/[0-9\[\]\#]/g, '')
            const llmRequest = [
                `I need to illustrate my ${kind} skills`,
                `The name of the skill is ${x.Name}. and does read like that: "{${simplifiedDescription}}".`,
                `The illustration must illustrate the effect of the skill.`,
                `for context, the player is a ${charX.promptIncludingBreaks}. but the image must focus on the skill, not the character`,
                `The prompt must be less than 400 letters`,
            ].join('\n')
            const llmCacheKey = run.hash(ui.llmModel.id + llmRequest)
            let prompt: string = storedPrompts[llmCacheKey] ?? ''
            if (prompt === '') {
                const res = await run.LLM.expandPrompt(llmRequest, ui.llmModel.id, run.LLM.simpleSystemPromptNaturalLanguage)
                prompt = res.prompt
                store.update({ json: { ...storedPrompts, [llmCacheKey]: prompt } })
            }
            const prefix = ui.promptPrefix ? run_prompt({ prompt: ui.promptPrefix, ckpt, clip }).promptIncludingBreaks : ''
            const suffix = ui.promptSuffix ? run_prompt({ prompt: ui.promptSuffix, ckpt, clip }).promptIncludingBreaks : ''
            prompt = prefix ? `${prefix}, (${x.Name} skill:1.1),  ${prompt}` : prompt
            prompt = suffix ? `${prompt}, ${suffix}` : prompt
            run.output_Markdown(
                [`# request:\n\n\`\`\`\n${llmRequest}\n\`\`\`\n`, `# prompt:\n\n\`\`\`\n${prompt}\n\`\`\`\n`].join('\n'),
            )
            const positiveCond = graph.CLIPTextEncode({ clip, text: prompt })
            const negativeCond = graph.CLIPTextEncode({ clip, text: negativeText })
            const seed = startingSeed++
            let latent: _LATENT = graph.EmptyLatentImage({ height, width })
            latent = graph.KSampler({
                seed,
                latent_image: latent,
                cfg: 8,
                model: charX.ckpt,
                sampler_name: 'euler_ancestral',
                scheduler: 'karras',
                positive: positiveCond,
                negative: negativeCond,
            })
            if (ui.secondPass) {
                if (!isXL) latent = graph.LatentUpscale({ samples: latent, crop: 'disabled', upscale_method: 'nearest-exact', height: H*2, width: W*2, }) // prettier-ignore
                latent = graph.KSampler({
                    seed, latent_image: latent, denoise: 0.58, steps: 10, model: charX.ckpt, sampler_name: 'ddim', scheduler: 'ddim_uniform',
                    positive: positiveCond,
                    negative: negativeCond,
                }) // prettier-ignore
            }

            // post processing
            let image: _IMAGE = graph.VAEDecode({ samples: latent, vae })
            if (ui.secondPass || isXL) image = graph.Image_Resize({ image: image, rescale_factor: 0.33, mode: 'rescale', resampling: 'lanczos', supersample: 'false', }) // prettier-ignore
            const maskL = await run.Images.createFromURL(bang(stsAssets[`mask-${kind}`]))
            let maskImg = await maskL.loadInWorkflow() //.loadInWorkflowAsMask('alpha')
            // image = graph.ImageCrop({ image, x: 0, y: 0, width: 500, height: 380 })
            image = graph.JoinImageWithAlpha({ alpha: maskImg, image: image })
            // image = graph.Prune_By_Mask({ image, mask: maskImg })
            graph.PreviewImage({ images: image }).storeAs(uid)
            // ----------------------------

            AFTERGENERATION.push(async (): Promise<MediaImageL> => {
                const illustration = run.Store.getImageStore(uid).imageOrCrash
                const finalCard = await drawCard({
                    color,
                    kind,
                    rarity,
                    cost: x.Cost,
                    name: x.Name,
                    text: x.Text, // 'deal 5 damage deal 5 damage deal 5 damage deal 5 damage deal 5 damage deal 5 damage deal 5 damage deal 5 damage deal 5 damage deal 5 damage deal 5 damage deal 5 damage ',
                    illustration,
                })
                finalCard.addTag('sts-card', 'card', color, kind, rarity)
                return finalCard
            })
        }
        await workflow.sendPromptAndWaitUntilDone()
        const cards = await Promise.all(AFTERGENERATION.map((x) => x()))
        const cardIds = cards.map((image) => image.id)
        run.output_custom({ view: View_DeckOfCards, params: { images: cardIds } })
    },
})
