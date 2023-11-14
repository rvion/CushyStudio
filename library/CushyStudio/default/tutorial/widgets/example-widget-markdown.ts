card({
    ui: (form) => ({
        int: form.number({}),
        html: form.markdown({
            markdown: form._FIX_INDENTATION`
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
