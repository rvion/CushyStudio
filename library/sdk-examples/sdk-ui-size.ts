app({
   ui: (b) =>
      b.fields({
         size: b.size({}),
         size_1000: b.size({
            step: 1000,
         }),
      }),
   run: async (flow, form) => {},
})
