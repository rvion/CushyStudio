import { syntaxTree } from '@codemirror/language'
import { linter, Diagnostic } from '@codemirror/lint'
import { STATE } from 'src/state/state'

export const regexpLinter = linter((view) => {
    let diagnostics: Diagnostic[] = []
    const st: STATE = (window as any).st
    syntaxTree(view.state)
        .cursor()
        .iterate((node) => {
            if (node.name == 'Lora') {
                const text = view.state.sliceDoc(node.from + 2, node.to - 1)
                const isValidLora = st.schema.hasLora(text)
                if (isValidLora) return
                // console.log(
                //     //
                //     `[👙]`,
                //     text,
                //     st.schema.getLoras(),
                //     st.schema.getLoras().includes(text),
                // )
                diagnostics.push({
                    from: node.from,
                    to: node.to,
                    severity: 'error',
                    message: `Lora named "${text}" does not exist`,
                    actions: [
                        {
                            name: 'Remove',
                            apply(view, from, to) {
                                view.dispatch({ changes: { from, to } })
                            },
                        },
                    ],
                })
            }
        })
    return diagnostics
})
