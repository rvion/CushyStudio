import { syntaxTree } from '@codemirror/language'
import { Diagnostic, linter } from '@codemirror/lint'
import { EditorView, gutter } from '@codemirror/view'
import { STATE } from 'src/state/state'

export const PromptLinter1 = linter((view: EditorView) => {
    let diagnostics: Diagnostic[] = []
    const st: STATE = (window as any).st
    syntaxTree(view.state)
        .cursor()
        .iterate((ref) => {
            if (ref.name == 'Wildcards') {
                // | Wildcards  (89 -> 99)
                //   | WildcardName  (90 -> 99)
                //     | String "3d_term" (90 -> 99)
                const isString = ref.node.firstChild?.firstChild?.name == 'String'
                const text = isString //
                    ? view.state.sliceDoc(ref.from + 2, ref.to - 1)
                    : view.state.sliceDoc(ref.from + 1, ref.to)

                const isValidWildcard = st.hasWildcard(text)
                if (isValidWildcard) return

                diagnostics.push({
                    from: ref.from,
                    to: ref.to,
                    severity: 'error',
                    message: `Wildcard named "${text}" does not exist`,
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
            if (ref.name == 'Lora') {
                const isString = ref.node.firstChild?.firstChild?.name == 'String'
                const text = isString //
                    ? view.state.sliceDoc(ref.from + 2, ref.to - 1)
                    : view.state.sliceDoc(ref.from + 1, ref.to)

                const isValidLora = st.schema.hasLora(text)
                if (isValidLora) return

                diagnostics.push({
                    from: ref.from,
                    to: ref.to,
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
