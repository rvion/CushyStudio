import type { SyntaxNodeRef, SyntaxNode } from '@lezer/common'
import type { Action } from '@codemirror/lint'
import type { STATE } from 'src/state/state'
import type { EditorView } from '@codemirror/view'
import type { PromptLangNodeName } from '../grammar/grammar.types'
import type { LoraTextNode } from 'src/widgets/prompter/nodes/lora/LoraBoxUI'

import { syntaxTree } from '@codemirror/language'
import { Diagnostic, linter } from '@codemirror/lint'
import { bang } from 'src/utils/misc/bang'

export const PromptLinter1 = linter((view: EditorView) => {
    let diagnostics: Diagnostic[] = []
    const st: STATE = (window as any).st
    const removeAction: Action = {
        name: 'Remove',
        apply(view, from, to) {
            view.dispatch({ changes: { from, to } })
        },
    }
    syntaxTree(view.state)
        .cursor()
        .iterate((ref) => {
            const refName = ref.name as PromptLangNodeName
            if (refName == 'Wildcard') {
                // | Wildcard  (89 -> 99)
                //   | WildcardName  (90 -> 99)
                //     | String "3d_term" (90 -> 99)
                const [from, to] = $getWildcardNamePos(ref)
                const text = view.state.sliceDoc(from, to)
                if (st.hasWildcard(text)) return
                diagnostics.push({
                    from: ref.from,
                    to: ref.to,
                    severity: 'error',
                    message: `Wildcard "${text}" does not exist`,
                    actions: [removeAction],
                })
            }
            if (refName == 'Lora') {
                const xx = $extractLoraInfos(view, ref)
                const loraName = xx.loraName
                if (loraName == null) return
                if (st.schema.hasLora(loraName)) return
                console.log(`[👙] 🟢--`, xx)
                diagnostics.push({
                    from: ref.from,
                    to: ref.to,
                    severity: 'error',
                    message: `Lora "${xx.loraName}" does not exist (${JSON.stringify(xx.loraName)})`,
                    actions: [removeAction],
                })
            }
            if (refName == 'Embedding') {
                const [from, to] = $getWildcardNamePos(ref)
                const text = view.state.sliceDoc(from, to)
                if (st.schema.hasEmbedding(text)) return
                diagnostics.push({
                    from: ref.from,
                    to: ref.to,
                    severity: 'error',
                    message: `Embedding "${text}" does not exist`,
                    actions: [removeAction],
                })
            }
        })
    return diagnostics
})

export const $extractLoraInfos = (
    //
    content: string | EditorView,
    loraNodeRef: SyntaxNodeRef,
): LoraTextNode => {
    // UTILS ------------------------------------------------------------
    const getText = (from: number, to: number) =>
        typeof content === 'string' //
            ? content.slice(from, to)
            : content.state.sliceDoc(from, to)
    const ABORT = (err: string): LoraTextNode => {
        console.log(`[❌ 🔴] LORA AST ERROR: ${err}`)
        // const loraName = 'error' as Enum_LoraLoader_lora_name
        // console.log(`[👙 UUUUUU] `, loraNodeRef.name)
        return {}
    }

    // NAME ------------------------------------------------------------
    if (loraNodeRef.name !== 'Lora') return ABORT(`$extractLoraInfos called with a "${loraNodeRef.name}" instead of a "Lora"`)
    const nameNode = loraNodeRef.node.getChild('LoraName')?.firstChild
    if (nameNode == null) return ABORT('no name node')
    if (nameNode.name !== 'Identifier' && nameNode.name !== 'String') return ABORT('invalid name node')
    const isString = loraNodeRef.node.firstChild?.firstChild?.name == 'String'
    const namePos = isString //
        ? { from: nameNode.from + 1, to: nameNode.to - 1 }
        : { from: nameNode.from, to: nameNode.to }
    const loraName = getText(namePos.from, namePos.to) as Enum_LoraLoader_lora_name

    // WEIGHTS ------------------------------------------------------------
    const numbers = loraNodeRef.node.getChildren('Number')
    let strength_clip = 1
    let strength_model = 1
    let num1Pos: Maybe<{ from: number; to: number }> = undefined
    let num2Pos: Maybe<{ from: number; to: number }> = undefined
    if (numbers.length >= 1) {
        const node: SyntaxNode = numbers[0]
        num1Pos = { from: node.from, to: node.to }
        strength_model = parseFloat(getText(node.from, node.to))
    }
    if (numbers.length >= 2) {
        const node: SyntaxNode = numbers[1]
        num2Pos = { from: node.from, to: node.to }
        strength_clip = parseFloat(getText(node.from, node.to))
    }

    return { namePos, num1Pos, num2Pos, loraName, strength_model, strength_clip }
}

export const $getWildcardNamePos = (ref: SyntaxNodeRef): [from: number, to: number] => {
    // safety net
    if (!['Wildcard', 'Lora', 'Embedding'].includes(ref.name))
        throw new Error(`$getWildcardNamePos called with a node not in ['Wildcard', 'Lora', 'Embedding']`)

    // compute pos
    const isString = ref.node.firstChild?.firstChild?.name == 'String'
    return isString ? [ref.from + 2, ref.to - 1] : [ref.from + 1, ref.to]
}

export const $getWeightNumber = (ref: SyntaxNodeRef): [from: number, to: number] => {
    if (ref.name !== 'WeightedExpression') throw new Error(`❌ $getWeightNumber called with a node not in ['WeightedExpression']`)
    const number = bang(ref.node.lastChild, '❌ weight expression without weight')
    if ((number.name as PromptLangNodeName) !== 'Number') {
        // debugger
        console.log(`❌ Expected a number`)
        return [0, 0]
    }
    return [number.from, number.to]
}
