import type { Action } from '@codemirror/lint'
import type { EditorView } from '@codemirror/view'
import type { STATE } from 'src/state/state'

import { Diagnostic, linter } from '@codemirror/lint'
import { PromptAST } from '../grammar/grammar.practical'

export const PromptLinter1 = linter((view: EditorView) => {
    let diagnostics: Diagnostic[] = []
    const st: STATE = cushy
    const removeAction: Action = {
        name: 'Remove',
        apply(view, from, to) {
            view.dispatch({ changes: { from, to } })
        },
    }

    const prompt = new PromptAST(view.state.doc.toString())
    prompt.findAll('Lora').forEach((lora) => {
        const loraName = lora.name
        if (!loraName) return
        if (st.schema.hasLora(loraName)) return
        diagnostics.push({
            from: lora.from,
            to: lora.to,
            severity: 'error',
            message: `Lora "${lora.name}" does not exist`,
            actions: [removeAction],
        })
    })
    prompt.findAll('Wildcard').forEach((wildcard) => {
        const wildcarName = wildcard.name
        if (!wildcarName) return
        if (st.hasWildcard(wildcarName)) return
        diagnostics.push({
            from: wildcard.from,
            to: wildcard.to,
            severity: 'error',
            message: `Wildcard "${wildcard.name}" does not exist`,
            actions: [removeAction],
        })
    })
    prompt.findAll('Embedding').forEach((embedding) => {
        const embeddingName = embedding.name
        if (!embeddingName) return
        if (st.schema.hasEmbedding(embeddingName)) return
        diagnostics.push({
            from: embedding.from,
            to: embedding.to,
            severity: 'error',
            message: `Lora "${embedding.name}" does not exist`,
            actions: [removeAction],
        })
    })

    return diagnostics
})
