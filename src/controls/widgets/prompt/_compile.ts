import type { PromptLangNodeName } from './grammar/grammar.types'
import type { CompiledPrompt } from './WidgetPrompt'
import type { STATE } from 'src/state/state'

import { parser } from './grammar/grammar.parser'
import { Prompt_Node, PromptAST } from './grammar/grammar.practical'

export const compilePrompt = (p: {
    text: string
    st: STATE
    /** for wildcard */
    seed?: number
    onLora: (
        //
        lora: Enum_LoraLoader_lora_name,
        strength_clip: number,
        strength_model: number,
    ) => void
    /** @default true */
    printWildcards?: boolean
}): CompiledPrompt => {
    // -----------
    let POS = ''
    let NEG = ''
    const debugText: string[] = []

    const prompt = new PromptAST(p.text)

    // ---------------
    // const getLastPositivePromptChar = () => POS[POS.length - 1] ?? ''
    // const getLastNegativePromptChar = () => NEG[NEG.length - 1] ?? ''
    // -----------
    const CONTENT = p.text
    const st = p.st
    const tree = parser.parse(CONTENT ?? '')

    const weightStack = [1]
    prompt.root.iterate(
        // enter
        (node: Prompt_Node) => {
            const toktype = node.$kind
            const weights = weightStack[weightStack.length - 1]
            const set = (txt: string) => {
                const lastChar = weights < 0 ? NEG[NEG.length - 1] ?? '' : POS[POS.length - 1] ?? ''
                const space = txt === ',' ? '' : lastChar === ' ' ? '' : ' '
                let finalWeight = Math.abs(weights)
                let finalTxt = finalWeight === 1 ? txt : `(${txt}:${finalWeight})`
                finalTxt = space + finalTxt
                if (weights < 0) NEG += finalTxt
                else POS += finalTxt
            }

            if (toktype === 'WeightedExpression') {
                weightStack.push(weights * node.weight)
                // weights *= node.weight
                return true
            }

            if (toktype === 'Identifier') {
                set(node.text)
                return false
            }

            if (toktype === 'Separator') {
                set(',')
                return false
            }

            if (toktype === 'Number') {
                return false
            }

            if (toktype === 'Break') {
                set('break')
            }

            if (toktype === 'String') {
                set(node.content)
                return false
            }

            if (toktype === 'Embedding') {
                set(`embedding:${node.name}`)
                return false
            }

            if (toktype === 'Wildcard') {
                const options = (st.wildcards as any)[node.name]
                if (!Array.isArray(options)) {
                    console.log(`[❌] invalid wildcard`)
                    return false
                }
                const picked = st.chooseRandomly(node.name, p.seed ?? Math.floor(Math.random() * 99999999), options)
                if (p.printWildcards ?? true) debugText.push(picked)
                set(picked)
                return false
            }

            if (toktype === 'Lora') {
                if (!node.name) return false
                const loraName = node.name
                p.onLora(loraName, node.strength_clip ?? 1, node.strength_model ?? 1)
                // 🔴const next = run.nodes.LoraLoader({
                // 🔴    model: ckpt,
                // 🔴    clip: clip,
                // 🔴    lora_name: loraName,
                // 🔴    strength_clip: weights, // tok.loraDef.strength_clip,
                // 🔴    strength_model: weights, // tok.loraDef.strength_model,
                // 🔴})

                const associatedText = st.getLoraAssociatedTriggerWords(loraName)

                if (associatedText) {
                    console.log(`[👙] 🟢`, associatedText)
                    set(associatedText)
                } else {
                    console.log(`[👙] UUUU: NO associated text for lora:`, loraName)
                }
                return false
                // 🔴 clip = next._CLIP
                // 🔴 ckpt = next._MODEL
            }
            return true
        },
        // leave
        (node) => {
            if (node.$kind === 'WeightedExpression') {
                // weights /= node.weight
                weightStack.pop()
            }
        },
    )
    return {
        debugText,
        negativePrompt: NEG,
        positivePrompt: POS,
    }
}
