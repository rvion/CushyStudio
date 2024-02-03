import type { SyntaxNodeRef } from '@lezer/common'
import type { PromptLangNodeName } from 'src/controls/widgets/prompt/grammar/grammar.types'

import { $getWeightNumber, $getWildcardNamePos } from 'src/controls/widgets/prompt/cm-lang/LINT'
import { parser } from 'src/controls/widgets/prompt/grammar/grammar.parser'

export const run_prompt = (p: {
    richPrompt: { text: string }
    /** recommanded, but if left empty, AUTO will be used */
    clip?: _CLIP
    /** recommanded, but if left empty, AUTO will be used */
    ckpt?: _MODEL

    outputWildcardsPicked?: boolean
    seed?: number
}): {
    text: string
    clip: _CLIP
    ckpt: _MODEL
    conditionning: _CONDITIONING
} => {
    const run = getCurrentRun()
    let textOUT = ''
    const richPrompt = p.richPrompt
    let clip = p.clip ?? run.AUTO
    let ckpt = p.ckpt ?? run.AUTO
    if (richPrompt) {
        const textToOutput: string[] = []
        const CONTENT = richPrompt.text
        const tree = parser.parse(CONTENT ?? '')
        const cursor = tree.cursor()

        let weights = 0

        cursor.iterate(
            // enter
            (ref: SyntaxNodeRef) => {
                const toktype = ref.name as PromptLangNodeName
                const _lastChar = textOUT[textOUT.length - 1] ?? ''
                const _space = _lastChar === ' ' ? '' : ' '
                // const TXT = () => CONTENT.slice(node.from, node.to)
                // TODO: if (toktype === 'booru') text += `${_space}${tok.tag.text}`
                if (toktype === 'WeightedExpression') {
                    const [from, to] = $getWeightNumber(ref)
                    const numberTxt = CONTENT.slice(from, to)
                    const float = parseFloat(numberTxt)
                    weights *= float
                }
                if (toktype === 'Identifier') {
                    textOUT +=
                        weights == 1 //
                            ? `${_space}${CONTENT.slice(ref.from, ref.to)}`
                            : `${_space}(${CONTENT.slice(ref.from, ref.to)}:${weights})`
                    return false
                }
                if (toktype === 'String') {
                    textOUT +=
                        weights == 1 //
                            ? `${_space}${CONTENT.slice(ref.from + 1, ref.to - 1)}`
                            : `${_space}(${CONTENT.slice(ref.from + 1, ref.to - 1)}:${weights})`
                    return false
                }
                if (toktype === 'Embedding') {
                    const [from, to] = $getWildcardNamePos(ref)
                    const embeddingName = CONTENT.slice(from, to) as Embeddings
                    textOUT += `${_space}embedding:${embeddingName}`
                    return false
                }
                if (toktype === 'Wildcards') {
                    const [from, to] = $getWildcardNamePos(ref)
                    const wildcardName = CONTENT.slice(from, to)
                    const options = (run.wildcards as any)[wildcardName]
                    if (!Array.isArray(options)) {
                        console.log(`[❌] invalid wildcard`)
                        return false
                    }
                    const picked = run.chooseRandomly(wildcardName, p.seed ?? run.randomSeed(), options)
                    textOUT += `${_space}${picked}`
                    if (p.outputWildcardsPicked) textToOutput.push(picked)
                    return false
                }
                if (toktype === 'Lora') {
                    const [from, to] = $getWildcardNamePos(ref)
                    const loraName = CONTENT.slice(from, to) as Enum_LoraLoader_lora_name
                    const next = run.nodes.LoraLoader({
                        model: ckpt,
                        clip: clip,
                        lora_name: loraName,
                        strength_clip: weights, // tok.loraDef.strength_clip,
                        strength_model: weights, // tok.loraDef.strength_model,
                    })

                    const associatedText = run.getLoraAssociatedTriggerWords(loraName)
                    if (associatedText) textOUT += ` ${associatedText}`

                    clip = next._CLIP
                    ckpt = next._MODEL
                }
            },
            // leave
            (ref) => {
                const toktype = ref.name as PromptLangNodeName
                if (toktype === 'WeightedExpression') {
                    const [from, to] = $getWeightNumber(ref)
                    const numberTxt = CONTENT.slice(from, to)
                    const float = parseFloat(numberTxt)
                    weights /= float
                }
            },
        )

        if (p.outputWildcardsPicked && textToOutput.length > 0)
            run.output_text({ title: 'wildcards', message: textToOutput.join(' ') })
    }
    return {
        text: textOUT,
        get conditionning() {
            return run.nodes.CLIPTextEncode({ clip, text: textOUT })
        },
        clip,
        ckpt,
    }
}
