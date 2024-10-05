app({
    ui: (b) =>
        b.fields({
            a: b.int().optional(),
            b: b.int().optional(),
            c: b
                .group({
                    items: {
                        foo: b.int().optional(),
                        bar: b.int().optional(),
                    },
                })
                .optional(),
            _: b.markdown(`

2024-02-25 10:28:
- _❌ we don't always want a group border around the optional fields, it's too much visual noise:_
- _❌ we don't want to hide primitives when disabled, simply gray them out_
![](https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/NXqbgbpBPIUSZq2VzPX8tS9kVnjgiE5TvSRo4AKWro.jpg)


        `),
        }),

    run: async (flow, form) => {},
})
