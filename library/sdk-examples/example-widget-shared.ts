app({
   metadata: {
      description: 'show how to re-use part of the drafts in various places.',
   },
   ui: (b) =>
      b.fields({
         root: b.with(b.string(), (test1_) => {
            const test1 = test1_.shared()
            return b.with(
               b.fields({
                  foo: test1,
                  bar: b.number(),
               }),
               (test2_) => {
                  const test2 = test2_.shared()
                  return b.fields({
                     a: test2,
                     b: test2,
                     k1: test1,
                     k2: test1,
                     d: b.group({
                        layout: 'H',
                        items: {
                           x: test2,
                           y: test2,
                        },
                     }),
                  })
               },
            )
         }),
      }),

   run: async (sdk, ui) => {},
})
