import type { STATE } from 'src/state/state'
import type { CompiledPrompt } from './WidgetPrompt'
import type { SyntaxNodeRef } from '@lezer/common'
import type { PromptLangNodeName } from './grammar/grammar.types'

import { parser } from './grammar/grammar.parser'
import { $getWeightNumber, $getWildcardNamePos } from './cm-lang/LINT'

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
    // const getLastPositivePromptChar = () => POS[POS.length - 1] ?? ''
    // const getLastNegativePromptChar = () => NEG[NEG.length - 1] ?? ''
    // -----------
    const CONTENT = p.text
    const st = p.st
    const tree = parser.parse(CONTENT ?? '')
    const cursor = tree.cursor()

    let weights = 1

    cursor.iterate(
        // enter
        (ref: SyntaxNodeRef) => {
            const toktype = ref.name as PromptLangNodeName
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
                const [from, to] = $getWeightNumber(ref)
                const numberTxt = CONTENT.slice(from, to)
                const float = parseFloat(numberTxt)
                weights *= float
            }

            if (toktype === 'Identifier') {
                set(CONTENT.slice(ref.from, ref.to))
                return false
            }

            if (toktype === 'Separator') {
                set(',')
                return false
            }

            if (toktype === 'String') {
                set(CONTENT.slice(ref.from + 1, ref.to - 1))
                return false
            }

            if (toktype === 'Embedding') {
                const [from, to] = $getWildcardNamePos(ref)
                const embeddingName = CONTENT.slice(from, to) as Embeddings
                set(`embedding:${embeddingName}`)
                return false
            }

            if (toktype === 'Wildcard') {
                const [from, to] = $getWildcardNamePos(ref)
                const wildcardName = CONTENT.slice(from, to)
                const options = (st.wildcards as any)[wildcardName]
                if (!Array.isArray(options)) {
                    console.log(`[❌] invalid wildcard`)
                    return false
                }
                const picked = st.chooseRandomly(wildcardName, p.seed ?? Math.floor(Math.random() * 99999999), options)
                if (p.printWildcards) debugText.push(picked)
                set(picked)
                return false
            }

            if (toktype === 'Lora') {
                const [from, to] = $getWildcardNamePos(ref)
                const loraName = CONTENT.slice(from, to) as Enum_LoraLoader_lora_name
                p.onLora(loraName, weights, weights)
                // 🔴
                // 🔴const next = run.nodes.LoraLoader({
                // 🔴    model: ckpt,
                // 🔴    clip: clip,
                // 🔴    lora_name: loraName,
                // 🔴    strength_clip: weights, // tok.loraDef.strength_clip,
                // 🔴    strength_model: weights, // tok.loraDef.strength_model,
                // 🔴})

                const associatedText = st.getLoraAssociatedTriggerWords(loraName)
                if (associatedText) set(associatedText)
                // 🔴 clip = next._CLIP
                // 🔴 ckpt = next._MODEL
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
    return {
        debugText,
        negativePrompt: NEG,
        positivePrompt: POS,
    }
}
