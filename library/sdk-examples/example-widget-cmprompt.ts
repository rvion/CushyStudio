app({
   ui: (b) =>
      b.fields({
         promptV2: b.prompt({}),
      }),

   run: async (flow, form) => {
      const DEBUG = JSON.stringify(form, null, 3)
      flow.output_text(`basicList: ${DEBUG}`)
   },
})
