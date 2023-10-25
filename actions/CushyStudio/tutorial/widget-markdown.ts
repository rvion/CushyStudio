action({
    author: 'rvion',
    name: 'demo-markdown',
    ui: (form) => ({
        int: form.number({}),
        html: form.markdown({
            markdown: FIX_INDENTATION`
                ## hello

                how are you

                - test
                  - foo
                  - bar

                ok

                | Syntax      | Description |
                | ----------- | ----------- |
                | Header      | Title       |
                | Paragraph   | Text        |

                `,
        }),
    }),
    run: async (flow, p) => {
        flow.print('hello')
    },
})

// TODO: 2023-10-25 🦊  move that into the markdown widget directly
const FIX_INDENTATION = (str: TemplateStringsArray) => {
    // split string into lines
    let lines = str[0].split('\n').slice(1)
    const indent = (lines[0]! ?? '').match(/^\s*/)![0].length
    // trim whitespace at the start and end of each line
    lines = lines.map((line) => line.slice(indent))
    // join lines back together with preserved newlines
    return lines.join('\n')
}
