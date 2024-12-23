app({
   // name: 'playground-seed-widget',
   ui: (b) =>
      b.fields({
         prompt: b.prompt({}),
         prompt2: b.prompt({}),
         seed3: b.markdown({ markdown: '' }),
      }),

   run: async (flow, form) => {},
})
