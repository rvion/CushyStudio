import type { SyntaxNodeRef, SyntaxNode } from '@lezer/common'
import type { Action } from '@codemirror/lint'
import type { STATE } from 'src/state/state'
import type { EditorView } from '@codemirror/view'
import type { PromptLangNodeName } from '../grammar/grammar.types'

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
                if (st.schema.hasLora(xx.loraName)) return
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
    content: string | EditorView,
    loraNodeRef: SyntaxNodeRef,
): {
    loraName: Enum_LoraLoader_lora_name
    strength_clip: number
    strength_model: number
    ref: SyntaxNodeRef
} => {
    // UTILS ------------------------------------------------------------
    const getText = (from: number, to: number) =>
        typeof content === 'string' //
            ? content.slice(from, to)
            : content.state.sliceDoc(from, to)
    const ABORT = (err: string) => {
        console.log(`[❌ 🔴] LORA AST ERROR: ${err}`)
        const loraName = 'error' as Enum_LoraLoader_lora_name
        return { loraName, strength_clip: 1, strength_model: 1, ref: loraNodeRef }
    }

    // NAME ------------------------------------------------------------
    if (loraNodeRef.name !== 'Lora') return ABORT(`$extractLoraInfos called with a "${loraNodeRef.name}" instead of a "Lora"`)
    const nameNode = loraNodeRef.node.getChild('LoraName')?.firstChild
    if (nameNode == null) return ABORT('no name node')
    if (nameNode.name !== 'Identifier' && nameNode.name !== 'String') return ABORT('invalid name node')
    const isString = loraNodeRef.node.firstChild?.firstChild?.name == 'String'
    const posName = isString ? [nameNode.from + 1, nameNode.to - 1] : [nameNode.from, nameNode.to]
    const loraName = getText(posName[0], posName[1]) as Enum_LoraLoader_lora_name

    // WEIGHTS ------------------------------------------------------------
    const numbers = loraNodeRef.node.getChildren('Number')
    let strength_clip = 1
    let strength_model = 1
    if (numbers.length >= 1) {
        const node: SyntaxNode = numbers[0]
        // console.log(`[👙] AAAA`, node.name, getText(node.from, node.to), parseFloat(getText(node.from, node.to)))
        // if (getText(node.from, node.to).includes('masterpiece')) debugger
        const number = parseFloat(getText(node.from, node.to))
        strength_clip = number
    }
    if (numbers.length >= 2) {
        const node: SyntaxNode = numbers[1]
        const number = parseFloat(getText(node.from, node.to))
        strength_model = number
    }

    return { loraName, strength_model, strength_clip, ref: loraNodeRef }
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
