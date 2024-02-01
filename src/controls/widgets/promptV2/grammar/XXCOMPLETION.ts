import { Completion, CompletionContext, CompletionResult, CompletionSource, autocompletion } from '@codemirror/autocomplete'
import { syntaxTree } from '@codemirror/language'
import { Extension } from '@uiw/react-codemirror'
import { STATE } from 'src/state/state'
import { regexpLinter } from './LINT'

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
    const cursor = node.cursor()
    while (cursor.parent()) console.log(`[👙] >>>`, cursor.name)

    // Example: Customize based on node type or word prefix
    let completionsOptions: Completion[] = []
    completionsOptions.push({ label: 'test1', type: 'keyword', detail: 'test1' })

    const st: STATE = (window as any).st
    for (const [key, values] of Object.entries(st.wildcards)) {
        completionsOptions.push({
            label: key,
            type: 'keyword',
            detail: values.join(', '),
            section: 'wildcards',
            apply: `*${key} `,
        })
    }

    for (const loraName of st.schema.getLoras()) {
        completionsOptions.push({
            label: loraName,
            type: 'lora',
            section: 'lora',
            apply: `@"${loraName}"`,
        })
    }

    if (word) {
        if (node.name === 'FunctionDeclaration' || word.text.startsWith('fun'))
            // Add more function-related completions
            completionsOptions.push({ label: 'functionName', type: 'function' })

        if (node.name === 'VariableDeclaration' || word.text.startsWith('var'))
            // Add more variable-related completions
            completionsOptions.push({ label: 'variableName', type: 'variable' })
    }

    // Add other conditions based on your AST or prefix

    let xx: CompletionResult
    return {
        from: word?.from,
        to: word?.to,
        options: completionsOptions,
    }
}

export const exampleCompletion2: Extension = autocompletion({
    //
    activateOnTyping: true,
    override: [
        //
        dynamicCompletion,
    ],
})
