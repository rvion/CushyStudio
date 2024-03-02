/**
 * This is a CushyApp that allow anyone to generate a set of custom cards
 * For the slay-the-spire game
 */

import { run_model, ui_model } from '../_prefabs/prefab_model'
import { run_prompt } from '../_prefabs/prefab_prompt'
import { stsAssets } from './_stsAssets'
import { allCards } from './_stsCards'
import { drawCard } from './_stsDrawCard'
import { convertColors, convertKind, convertRarity } from './_stsHelpers'
import { bang } from 'src/utils/misc/bang'

app({
    metadata: {
        name: 'slay-the-spire art-pack generator',
        description: 'SlayTheSpire (STS) art-pack generator',
    },
    ui: (ui) => ({
        model: ui_model(),
        // positive: ui.string({ default: 'masterpiece, tree' }),
        seed: ui.seed({}),
        mode: ui.selectOneV2(['xl', '1.5']),
        secondPass: ui.bool(),
        rarity: ui.selectOneV2(['uncommon', 'common', 'rare']).optional(),
        colors: ui.selectOneV2(['red', 'green', 'gray']).optional(),
        kind: ui.selectOneV2(['attack', 'power', 'skill']).optional(),
        max: ui.int({ default: 3, min: 1, max: 100 }),
        character: ui.prompt({ default: 'an elf-robot, with blue hairs' }),
        negative: ui.prompt({ default: 'bad quality, blurry, low resolution, pixelated, noisy' }),
    }),
    run: async (run, ui) => {
        const W = 500
        const H = 380
        const workflow = run.workflow
        const graph = workflow.builder
        const { ckpt, clip, vae } = run_model(ui.model)
        const isXL = ui.mode.id === 'xl'
        const height = isXL ? H * 2 : H
        const width = isXL ? W * 2 : W
        let latent: _LATENT = graph.EmptyLatentImage({ height, width })
        const negativeText = ui.negative.compile({ seed: ui.seed, onLora: () => {} }).positivePrompt
        const charX = run_prompt({ prompt: ui.character, ckpt, seed: ui.seed })

        // list of stuff to run once the generation is done
        const AFTERGENERATION: (() => void)[] = []

        const store = run.Store.getOrCreate<Record<string, string>>({
            key: 'card-descriptions-5',
            scope: 'global',
            makeDefaultValue: () => ({}),
        })

        let startingSeed = ui.seed
        for (const x of allCards) {
            if (AFTERGENERATION.length >= ui.max) break

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
            const llmRequest = [
                'I need a prompt to illustrate a card for a deck-building game where cards represent actions the hero can do (if card clearly represent an action, you can decide to make the character part of the illustration).',
                `The card name is ${x.Name}. THE WHOLE IMAGE MUST PRIMARILLY DEPICT the concept of "{${x.Text}}".`,
                `The card is a ${rarity} ${kind} card. The effect of the card is ${x.Text}. The illustration must illustrate the effect of the card.`,
                `(if you need more context, the character is a ${charX.positiveText})`,
                `cards must be very visually different, so make sure the prompt will generate something very specific to the card name (${x.Name}) and effect.`,
                `make sure keywords will not lead to ambiguous illustration. A defence card must not show an attack, for instance.`,
            ].join('\n')
            const llmCacheKey = run.hash(llmRequest)
            let prompt: string = storedPrompts[llmCacheKey] ?? ''
            if (prompt === '') {
                const res = await run.LLM.expandPrompt(llmRequest, 'mistralai/mixtral-8x7b-instruct')
                prompt = res.prompt
                store.update({ json: { ...storedPrompts, [llmCacheKey]: prompt } })
            }
            // if card is not filtered, add nodes to the graph to generate those images
            // const prompt = [
            //     `masterpiece, (${x.Name}:1.1), illustration for an ${kind}, that have an effect that ${x.Text}, ${charX.positiveText}`,
            //     `${color}`,
            // ].join(', ')
            run.output_text(prompt)
            const positiveCond = graph.CLIPTextEncode({ clip, text: prompt })
            const negativeCond = graph.CLIPTextEncode({ clip, text: negativeText })
            latent = graph.KSampler({
                seed: startingSeed++,
                latent_image: latent,
                model: charX.ckpt,
                sampler_name: 'ddim',
                scheduler: 'karras',
                positive: positiveCond,
                negative: negativeCond,
            })
            if (ui.secondPass) {
                if (!isXL) latent = graph.LatentUpscale({ samples: latent, crop: 'disabled', upscale_method: 'nearest-exact', height: H*2, width: W*2, }) // prettier-ignore
                latent = graph.KSampler({
                    seed: ui.seed, latent_image: latent, denoise: 0.58, steps: 10, model: charX.ckpt, sampler_name: 'ddim', scheduler: 'ddim_uniform',
                    positive: positiveCond,
                    negative: negativeCond,
                }) // prettier-ignore
            }

            // post processing
            let image: _IMAGE = graph.VAEDecode({ samples: latent, vae })
            if (ui.secondPass || isXL) image = graph.Image_Resize({ image: image, rescale_factor: 0.5, mode: 'rescale', resampling: 'lanczos', supersample: 'false', }) // prettier-ignore
            const maskL = await run.Images.createFromURL(bang(stsAssets[`mask-${kind}`]))
            let maskImg = await maskL.loadInWorkflow() //.loadInWorkflowAsMask('alpha')
            // image = graph.ImageCrop({ image, x: 0, y: 0, width: 500, height: 380 })
            image = graph.JoinImageWithAlpha({ alpha: maskImg, image: image })
            // image = graph.Prune_By_Mask({ image, mask: maskImg })
            graph.PreviewImage({ images: image }).storeAs(uid)
            // ----------------------------

            AFTERGENERATION.push(async () => {
                const illustration = run.Store.getImageStore(uid).imageOrCrash
                await drawCard({
                    color,
                    kind,
                    rarity,
                    cost: x.Cost,
                    name: x.Name,
                    text: x.Text, // 'deal 5 damage deal 5 damage deal 5 damage deal 5 damage deal 5 damage deal 5 damage deal 5 damage deal 5 damage deal 5 damage deal 5 damage deal 5 damage deal 5 damage ',
                    illustration,
                })
            })
        }

        await workflow.sendPromptAndWaitUntilDone()
        await Promise.all(AFTERGENERATION.map((x) => x()))
    },
})
