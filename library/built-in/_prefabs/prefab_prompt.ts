import type { Runtime } from 'src/runtime/Runtime'
import type { WidgetPromptOutput } from 'src/widgets/prompter/WidgetPromptUI'

export const run_prompt = (
    run: Runtime,
    p: {
        richPrompt: WidgetPromptOutput
        /** recommanded, but if left empty, AUTO will be used */
        clip?: _CLIP
        /** recommanded, but if left empty, AUTO will be used */
        ckpt?: _MODEL

        outputWildcardsPicked?: boolean
        seed?: number
    },
): {
    text: string
    clip: _CLIP
    ckpt: _MODEL
    conditionning: _CONDITIONING
} => {
    let text = ''
    const richPrompt = p.richPrompt
    let clip = p.clip ?? run.AUTO
    let ckpt = p.ckpt ?? run.AUTO
    if (richPrompt) {
        const textToOutput: string[] = []
        for (const tok of richPrompt.tokens) {
            const _lastChar = text[text.length - 1] ?? ''
            const _space = _lastChar === ' ' ? '' : ' '
            if (tok.type === 'booru') text += `${_space}${tok.tag.text}`
            else if (tok.type === 'text') text += `${_space}${tok.text}`
            else if (tok.type === 'embedding') text += `${_space}embedding:${tok.embeddingName}`
            else if (tok.type === 'wildcard') {
                const options = (run.wildcards as any)[tok.payload]
                if (Array.isArray(options)) {
                    const picked = run.chooseRandomly(`${tok.payload}`, p.seed ?? run.randomSeed(), options)
                    text += ` ${picked}`
                    if (p.outputWildcardsPicked) textToOutput.push(picked)
                }
            } else if (tok.type === 'lora') {
                const next = run.nodes.LoraLoader({
                    model: ckpt,
                    clip: clip,
                    lora_name: tok.loraDef.name,
                    strength_clip: tok.loraDef.strength_clip,
                    strength_model: tok.loraDef.strength_model,
                })

                const associatedText = run.getLoraAssociatedTriggerWords(tok.loraDef.name)
                if (associatedText) text += ` ${associatedText}`

                clip = next._CLIP
                ckpt = next._MODEL
            }
        }
        if (p.outputWildcardsPicked && textToOutput.length > 0)
            run.output_text({ title: 'wildcards', message: textToOutput.join(' ') })
    }
    return {
        text,
        get conditionning() {
            return run.nodes.CLIPTextEncode({ clip, text })
        },
        clip,
        ckpt,
    }
}
