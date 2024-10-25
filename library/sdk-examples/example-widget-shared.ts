app({
   metadata: {
      description: 'show how to re-use part of the drafts in various places.',
   },
   ui: (b) =>
      b.fields({
         root: b.with(b.string(), (test1) =>
            b.with(
               b.fields({
                  foo: b.linked(test1),
                  bar: b.number(),
               }),
               (test2) =>
                  b.fields({
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
                  }),
            ),
         ),
      }),

   run: async (sdk, ui) => {},
})
