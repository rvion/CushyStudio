app({
   ui: (b) =>
      b.fields({
         foo: b.group({
            layout: 'H',
            items: {
               a: b.int({}),
               b: b.int({}),
            },
         }),
         bar: b.group({
            layout: 'H',
            items: {
               a: b.int({}),
               b: b.int({}),
            },
         }),
      }),
   run: async (flow, form) => {},
})
