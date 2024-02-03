import type { Extension } from '@codemirror/state'
import type { STATE } from 'src/state/state'

import { Completion, CompletionContext, CompletionResult, CompletionSource, autocompletion } from '@codemirror/autocomplete'
import { syntaxTree } from '@codemirror/language'
import { $ancestorsBottomUp } from './utils'

// Dynamic completion based on context
const dynamicCompletion: CompletionSource = (context: CompletionContext): CompletionResult | null => {
    // Get the syntax tree at the current position
    const st: STATE = (window as any).st
    const tree = syntaxTree(context.state)
    const node = tree.resolve(context.pos, -1)

    // ancestor chain
    const x = $ancestorsBottomUp(node)
    console.log(`[👙] x`, x.map((x) => x.name)) // prettier-ignore

    // OUTPUT
    let completionsOptions: Completion[] = []

    if (!(node.name === 'String' || node.name === 'Identifier')) return null
    const from = node.name === 'String' ? node.from + 1 : node.from
    const to = node.name === 'String' ? node.to - 1 : node.to

    const nodeToReplace = x.find(
        (x) =>
            x.name === 'Lora' || //
            x.name === 'Wildcards' ||
            x.name === 'Embedding',
    )

    const addWildcards = () => {
        for (const [wildcard, values] of Object.entries(st.wildcards)) {
            const noWrap = /^[A-Za-z_]+$/.test(wildcard)
            const info = values.join(', ')
            completionsOptions.push({
                // info: info,
                displayLabel: wildcard, // `${noWrap ? wildcard : `"${wildcard}"`}`,
                label: wildcard,
                type: 'wildcard',
                detail: info.slice(0, 20) + '...',
                apply: noWrap ? `*${wildcard} ` : `*"${wildcard}" `,
            })
        }
    }
    const addLoras = () => {
        for (const loraName of st.schema.getLoras()) {
            const noWrap = /^[A-Za-z_]+$/.test(loraName)
            completionsOptions.push({
                displayLabel: `lora: ${loraName}`,
                label: loraName,
                type: 'lora',
                apply: noWrap ? `@${loraName}` : `@"${loraName}"`,
            })
        }
    }
    const addEmbeddings = () => {
        for (const embeddingName of st.schema.data.embeddings) {
            const noWrap = /^[A-Za-z_]+$/.test(embeddingName)
            completionsOptions.push({
                displayLabel: `${embeddingName}`,
                detail: 'embedding',
                label: embeddingName,
                type: 'embedding',
                apply: noWrap ? `:${embeddingName}` : `:"${embeddingName}"`,
            })
        }
    }
    // console.log(`[👙] no meaningful parent`, from, to)
    addLoras()
    addWildcards()
    addEmbeddings()
    // }

    return {
        from,
        to,
        options: completionsOptions,
    }
}

export const PromptComletion1: Extension = autocompletion({
    //
    activateOnTyping: true,
    updateSyncTime: 50,
    closeOnBlur: false,
    override: [
        //
        dynamicCompletion,
    ],
    optionClass: (completion) => {
        return `cm-cushy-completion-for-${completion.type}`
        //
    },
})

// const word = context.matchBefore(/[\w]*/) ??
//      { from: context.pos, to: context.pos, text: '' }
