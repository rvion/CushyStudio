import type { Extension } from '@codemirror/state'
import type { STATE } from 'src/state/state'

import { Completion, CompletionContext, CompletionResult, CompletionSource, autocompletion } from '@codemirror/autocomplete'
import { syntaxTree } from '@codemirror/language'
import { PromptLangNodeName } from '../grammar/grammar.types'
import { isValidPromptLangIdentifier } from './isIdentifier'
import { $ancestorsBottomUp } from './utils'

// Dynamic completion based on context
const dynamicCompletion: CompletionSource = (context: CompletionContext): CompletionResult | null => {
    // Get the syntax tree at the current position
    const st: STATE = cushy
    const tree = syntaxTree(context.state)
    const node = tree.resolve(context.pos, -1)

    // ancestor chain
    const x = $ancestorsBottomUp(node)
    const nodeToReplace = x.find((x) => {
        const name = x.name as PromptLangNodeName
        return (
            name === 'Lora' || //
            name === 'Wildcard' ||
            name === 'Embedding' ||
            name === 'Tag'
        )
    })

    const onlyHasPrefix =
        node.name === 'Lora' || //
        node.name === 'Wildcard' ||
        node.name === 'Embedding' ||
        node.name === 'Tag'

    const alreadyhasPrefix = onlyHasPrefix ? false : Boolean(nodeToReplace)
    // console.log(`[🟢] x`, x.map((x) => x.name)) // prettier-ignore
    // console.log(`[🟢] x`, nodeToReplace?.name) // prettier-ignore

    // OUTPUT
    let completionsOptions: Completion[] = []

    const addWildcards = () => {
        for (const [wildcard, values] of Object.entries(st.wildcards)) {
            const noWrap = isValidPromptLangIdentifier(wildcard)
            const info = values.join(', ')
            const prefix = alreadyhasPrefix ? '' : `?`
            completionsOptions.push({
                displayLabel: wildcard,
                label: wildcard,
                type: 'wildcard',
                boost: 99,
                detail: info.slice(0, 20) + '...',
                apply: noWrap ? `${prefix}${wildcard} ` : `${prefix}"${wildcard}" `,
            })
        }
    }
    const addLoras = () => {
        for (const loraName of st.schema.getLoras()) {
            const noWrap = isValidPromptLangIdentifier(loraName)
            const prefix = alreadyhasPrefix ? '' : `@`
            completionsOptions.push({
                displayLabel: `lora: ${loraName}`,
                label: loraName,
                type: 'lora',
                boost: 99,
                apply: noWrap ? `${prefix}${loraName}` : `${prefix}"${loraName}"`,
            })
        }
    }
    const addEmbeddings = () => {
        for (const embeddingName of st.schema.data.embeddings) {
            const noWrap = isValidPromptLangIdentifier(embeddingName)
            const prefix = alreadyhasPrefix ? '' : `:`
            completionsOptions.push({
                displayLabel: `${embeddingName}`,
                detail: 'embedding',
                label: embeddingName.toLowerCase(),
                type: 'embedding',
                boost: 99,
                apply: noWrap ? `${prefix}${embeddingName}` : `${prefix}"${embeddingName}"`,
            })
        }
    }
    const addTags = () => {
        for (const tag of st.danbooru.tags) {
            const tagName = tag.text
            const noWrap = isValidPromptLangIdentifier(tagName)
            const prefix = alreadyhasPrefix ? '' : `%`
            completionsOptions.push({
                displayLabel: `${tagName}`,
                detail: 'tag',
                boost: -99,
                label: tagName,
                type: 'tag',
                apply: noWrap ? `${prefix}${tagName}` : `${prefix}"${tagName}"`,
            })
        }
    }

    const leftNodeName = node.name as PromptLangNodeName
    const validNodeNames: PromptLangNodeName[] = [
        //
        'String',
        'Identifier',
        //
        'Lora',
        'Wildcard',
        'Embedding',
        'Tag',
    ]
    // console.log(`[👙] leftNodeName=`, leftNodeName, ' => ', validNodeNames.includes(leftNodeName))
    if (!validNodeNames.includes(leftNodeName)) return null

    const from =
        /* nodeToReplace //
        ? nodeToReplace.from
        :  */ node.name === 'String' ? node.from + 1 : node.from
    const to =
        /* nodeToReplace //
        ? nodeToReplace.to
        :  */ node.name === 'String' ? node.to - 1 : node.to

    // console.log(`[👙] no meaningful parent`, from, to)
    if (nodeToReplace == null || nodeToReplace.name === 'Lora') addLoras()
    if (nodeToReplace == null || nodeToReplace.name === 'Wildcard') addWildcards()
    if (nodeToReplace == null || nodeToReplace.name === 'Embedding') addEmbeddings()
    if (nodeToReplace == null || nodeToReplace.name === 'Tag') addTags()
    // }

    return {
        filter: onlyHasPrefix ? false : true,
        from,
        to,
        options: completionsOptions,
    }
}

export const PromptComletion1: Extension = autocompletion({
    //
    activateOnTyping: true,
    updateSyncTime: 50,
    // closeOnBlur: false,
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
