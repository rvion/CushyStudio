app({
    metadata: {
        help: 'This is an example app to show how to use the `choices` widget. It is not meant to be useful.',
    },
    ui: (b) =>
        b.fields({
            multiChoice: b.choices({
                testInt: b.int(),
                testString: b.string(),
                testGroup: b.group({ items: { c1: b.string(), c2: b.string() } }),
                testList: b.list({ element: () => b.string() }),
            }),
            multiChoiceAsTabs: b.choices(
                {
                    testInt: b.int(),
                    testString: b.string(),
                    testGroup: b.group({ items: { c1: b.string(), c2: b.string() } }),
                    testList: b.list({ element: () => b.string() }),
                    xxx: b.list({ element: () => b.list({ element: b.string({ default: 'coucou' }) }) }),
                },
                { appearance: 'tab' },
            ),
        }),

    run: async (run, form) => {
        const foo = form.multiChoice
        const out: string[] = []
        //                          infered as (number) 👇
        if (foo.testInt != null) out.push(`got a number: ${foo.testInt}`)
        //                             infered as (string) 👇
        if (foo.testString != null) out.push(`got a string: ${foo.testString}`)
        //                                                    infered as (string) 👇
        if (foo.testGroup != null) out.push(`got a group: ${JSON.stringify(foo.testGroup.c1)}`)
        //                                      infered as (number) 👇
        if (foo.testList != null) out.push(`got a list with ${foo.testList.length}: ${JSON.stringify(foo.testList)}`)
        run.output_Markdown(out.join('\n\n'))
    },
})
