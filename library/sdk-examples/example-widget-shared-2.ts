app({
   metadata: {
      description: 'show how to re-use part of the drafts in various places.',
   },
   ui: (b) =>
      b.fields({
         root: b.with(b.fields({ xx: b.int(), yy: b.string() }), (int) =>
            b.fields({
               foo2: b.int(),
               foo1: b.linked(int),
               foo3: b.linked(int),
            }),
         ),
      }),

   run: async (sdk, ui) => {
      console.clear()
      console.log(JSON.stringify(ui))
   },
})
