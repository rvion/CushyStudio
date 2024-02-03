import type { Extension } from '@codemirror/state'
import type { STATE } from 'src/state/state'

import { Completion, CompletionContext, CompletionResult, CompletionSource, autocompletion } from '@codemirror/autocomplete'
import { syntaxTree } from '@codemirror/language'

// Dynamic completion based on context
const dynamicCompletion: CompletionSource = (context: CompletionContext): CompletionResult | null => {
    // prettier-ignore
    const word = context.matchBefore(/[\w]*/) ??
         { from: context.pos, to: context.pos, text: '' }
    // if (!word) return null // No word found, so no completions

    // Get the syntax tree at the current position
    const tree = syntaxTree(context.state)
    const node = tree.resolve(context.pos, -1)

    // example about how to access the whole ancestors tree
    const ancestors = [node]
    const cursor = node.cursor()
    while (cursor.parent()) ancestors.push(cursor.node)
    console.log( `[👙] >>>`, ancestors.map((x) => x.name)) // prettier-ignore

    // Example: Customize based on node type or word prefix
    let completionsOptions: Completion[] = []

    // [DEBUG] completionsOptions.push({ label: 'test1', type: 'keyword', detail: 'test1' })

    const st: STATE = (window as any).st
    const addWildcards = () => {
        for (const [wildcard, values] of Object.entries(st.wildcards)) {
            const noWrap = /^[A-Za-z_]+$/.test(wildcard)
            console.log(`[👙] `, wildcard, noWrap)
            completionsOptions.push({
                displayLabel: `WILDCARD: ${noWrap ? wildcard : `"${wildcard}"`}`,
                label: wildcard,
                type: 'keyword',
                detail: values.join(',').slice(0, 20) + '...',
                // section: 'wildcards',
                apply: noWrap ? `*${wildcard} ` : `*"${wildcard}" `,
            })
        }
    }
    const addLoras = () => {
        for (const loraName of st.schema.getLoras()) {
            completionsOptions.push({
                displayLabel: `LORA: ${loraName}`,
                label: loraName,
                type: 'lora',
                // section: 'lora',
                // apply: `lora:"${loraName}"`,
                apply: `@"${loraName}"`,
            })
        }
    }
    const addEmbeddings = () => {
        for (const embeddingName of st.schema.data.embeddings) {
            const noWrap = /^[A-Za-z_]+$/.test(embeddingName)
            completionsOptions.push({
                displayLabel: `Embeddings: ${embeddingName}`,
                label: embeddingName,
                type: 'embedding',
                // section: 'lora',
                // apply: `lora:"${embeddingName}"`,
                apply: noWrap ? `:${embeddingName}` : `:"${embeddingName}"`,
            })
        }
    }

    if (!(node.name === 'String' || node.name === 'Identifier')) return null

    const from = node.name === 'String' ? node.from + 1 : node.from
    const to = node.name === 'String' ? node.to - 1 : node.to

    const parent = ancestors[1]
    // if (parent) {
    //     if (parent.name === 'LoraName') {
    //         // console.log(`[👙] parent is`, parent.name, from, to)
    //         addLoras()
    //     } else {
    //         addWildcards()
    //         // console.log(`[👙] parent is`, parent.name, from, to)
    //     }
    // } else {
    console.log(`[👙] no meaningful parent`, from, to)
    addLoras()
    addWildcards()
    addEmbeddings()
    // }

    return { from, to, options: completionsOptions }

    // [DEBUG] if (word) {
    // [DEBUG]     if (node.name === 'FunctionDeclaration' || word.text.startsWith('fun'))
    // [DEBUG]         // Add more function-related completions
    // [DEBUG]         completionsOptions.push({ label: 'functionName', type: 'function' })

    // [DEBUG] if (node.name === 'VariableDeclaration' || word.text.startsWith('var'))
    // [DEBUG]     // Add more variable-related completions
    // [DEBUG]     completionsOptions.push({ label: 'variableName', type: 'variable' })
    // [DEBUG] }

    // Add other conditions based on your AST or prefix
}

export const PromptComletion1: Extension = autocompletion({
    //
    activateOnTyping: true,
    override: [
        //
        dynamicCompletion,
    ],
})
