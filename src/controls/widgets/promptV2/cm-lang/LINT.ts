import type { Action } from '@codemirror/lint'
import type { STATE } from 'src/state/state'

import { syntaxTree } from '@codemirror/language'
import { Diagnostic, linter } from '@codemirror/lint'
import { EditorView } from '@codemirror/view'
import { PromptLangNodeName } from '../grammar/grammar.types'

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
            if (refName == 'Wildcards') {
                // | Wildcards  (89 -> 99)
                //   | WildcardName  (90 -> 99)
                //     | String "3d_term" (90 -> 99)
                const isString = ref.node.firstChild?.firstChild?.name == 'String'
                const [from, to] = isString ? [ref.from + 2, ref.to - 1] : [ref.from + 1, ref.to]
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
                const isString = ref.node.firstChild?.firstChild?.name == 'String'
                const [from, to] = isString ? [ref.from + 2, ref.to - 1] : [ref.from + 1, ref.to]
                const text = view.state.sliceDoc(from, to)
                if (st.schema.hasLora(text)) return
                diagnostics.push({
                    from: ref.from,
                    to: ref.to,
                    severity: 'error',
                    message: `Lora "${text}" does not exist`,
                    actions: [removeAction],
                })
            }
            if (refName == 'Embedding') {
                const isString = ref.node.firstChild?.firstChild?.name == 'String'
                const [from, to] = isString ? [ref.from + 2, ref.to - 1] : [ref.from + 1, ref.to]
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
