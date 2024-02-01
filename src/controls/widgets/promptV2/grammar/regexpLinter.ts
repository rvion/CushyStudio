import { syntaxTree } from '@codemirror/language'
import { linter, Diagnostic } from '@codemirror/lint'

export const regexpLinter = linter((view) => {
    let diagnostics: Diagnostic[] = []
    syntaxTree(view.state)
        .cursor()
        .iterate((node) => {
            if (node.name == 'RegExp')
                diagnostics.push({
                    from: node.from,
                    to: node.to,
                    severity: 'warning',
                    message: 'Regular expressions are FORBIDDEN',
                    actions: [
                        {
                            name: 'Remove',
                            apply(view, from, to) {
                                view.dispatch({ changes: { from, to } })
                            },
                        },
                    ],
                })
        })
    return diagnostics
})
