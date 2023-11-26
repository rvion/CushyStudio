import type { Runtime } from 'src/back/Runtime'
import type { WidgetPromptOutput } from 'src/widgets/prompter/WidgetPromptUI'

export const run_prompt = (
    flow: Runtime,
    p: {
        richPrompt: WidgetPromptOutput
        clip: _CLIP
        ckpt: _MODEL
        outputWildcardsPicked?: boolean
    },
): {
    text: string
    clip: _CLIP
    ckpt: _MODEL
    conditionning: _CONDITIONING
} => {
    let text = ''
    const richPrompt = p.richPrompt
    let clip = p.clip
    let ckpt = p.ckpt
    if (richPrompt) {
        for (const tok of richPrompt.tokens) {
            const _lastChar = text[text.length - 1] ?? ''
            const _space = _lastChar === ' ' ? '' : ' '
            if (tok.type === 'booru') text += `${_space}${tok.tag.text}`
            else if (tok.type === 'text') text += `${_space}${tok.text}`
            else if (tok.type === 'embedding') text += `${_space}embedding:${tok.embeddingName}`
            else if (tok.type === 'wildcard') {
                const options = (flow.wildcards as any)[tok.payload]
                if (Array.isArray(options)) {
                    const picked = flow.chooseRandomly(options)
                    text += ` ${picked}`
                    if (p.outputWildcardsPicked) {
                        flow.output_text(`${tok.payload}: ${picked}`)
                    }
                }
            } else if (tok.type === 'lora') {
                const next = flow.nodes.LoraLoader({
                    model: ckpt,
                    clip: clip,
                    lora_name: tok.loraDef.name,
                    strength_clip: tok.loraDef.strength_clip,
                    strength_model: tok.loraDef.strength_model,
                })

                const associatedText = flow.getLoraAssociatedTriggerWords(tok.loraDef.name)
                if (associatedText) text += ` ${associatedText}`

                clip = next._CLIP
                ckpt = next._MODEL
            }
        }
    }
    const conditionning = flow.nodes.CLIPTextEncode({ clip, text })
    return { text, conditionning, clip, ckpt }
}
