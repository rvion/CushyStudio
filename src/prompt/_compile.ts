import type { CompiledPrompt } from './FieldPrompt'

import { chooseRandomly } from '../csuite/rnd/chooseRnadomly'
import { Prompt_Node, PromptAST } from './grammar/grammar.practical'

export type PromptCompilationCtx = {
    getLoraAssociatedTriggerWords(loraName: string): Maybe<string>
    wildcards: { [wildcardName: string]: string[] }
}

export const compilePrompt = (p: {
    text: string
    ctx: PromptCompilationCtx
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
    const subPrompts: string[] = []
    let BUFF = ''
    const BREAK = () => {
        subPrompts.push(BUFF)
        BUFF = ''
    }
    // ⏸️ let NEG = ''
    const debugText: string[] = []

    const prompt = new PromptAST(p.text)

    // ---------------
    // const getLastPositivePromptChar = () => POS[POS.length - 1] ?? ''
    // const getLastNegativePromptChar = () => NEG[NEG.length - 1] ?? ''
    // -----------
    // ⏸️ const CONTENT = p.text
    const st = p.ctx
    // ⏸️ const tree = parser.parse(CONTENT ?? '')

    const weightStack = [1]
    prompt.root.iterate(
        // enter
        (node: Prompt_Node) => {
            const toktype = node.$kind
            const weights = weightStack[weightStack.length - 1]!
            const set = (txt: string) => {
                const lastChar =
                    //  ⏸️ weights < 0
                    //  ⏸️     ? NEG[NEG.length - 1] ?? ''
                    //  ⏸️     : POS[POS.length - 1] ?? ''
                    BUFF[BUFF.length - 1] ?? ''

                const space = txt === ',' ? '' : lastChar === ' ' ? '' : ' '
                let finalWeight = Math.abs(weights)
                let finalTxt = finalWeight === 1 ? txt : `(${txt}:${finalWeight})`
                finalTxt = space + finalTxt
                // ⏸️ if (weights < 0) NEG += finalTxt
                // ⏸️ else POS += finalTxt
                BUFF += finalTxt
                // CURR += finalTxt
            }

            if (toktype === 'WeightedExpression') {
                weightStack.push(weights * node.weight)
                return true
            }

            if (toktype === 'Identifier') { set(node.text) ;                return false } // prettier-ignore
            if (toktype === 'Separator')  { set(',') ;                      return false } // prettier-ignore
            if (toktype === 'Number')     {                                 return false } // prettier-ignore
            if (toktype === 'String')     { set(node.content) ;             return false } // prettier-ignore
            if (toktype === 'Embedding')  { set(`embedding:${node.name}`) ; return false } // prettier-ignore
            if (toktype === 'Break')      { BREAK() } // prettier-ignore

            if (toktype === 'Wildcard') {
                const options = (st.wildcards as any)[node.name]
                if (!Array.isArray(options)) {
                    console.log(`[❌] invalid wildcard`)
                    return false
                }
                const picked = chooseRandomly(node.name, p.seed ?? Math.floor(Math.random() * 99999999), options)
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
                    console.log(`[🧐] 🟢`, associatedText)
                    set(associatedText)
                } else {
                    console.log(`[🧐] UUUU: NO associated text for lora:`, loraName)
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

    BREAK()
    return {
        debugText,
        promptIncludingBreaks: subPrompts.join(' BREAK '),
        subPrompts,
    }
}
