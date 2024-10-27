app({
   metadata: {
      help: 'This is an example app to show how to use the `choice` widget. It is not meant to be useful.',
   },
   ui: (b) =>
      b.fields({
         exampleChoice: b.choice({
            image: b.image({}),
            list: b.list({ element: () => b.int({}) }),
            group: b.group({
               items: {
                  x: b.markdown({ markdown: '## Hello world' }),
                  c: b.int({}),
                  d: b.string({}),
               },
            }),
         }),
         exampleChoiceAsTabs: b.choice(
            {
               image: b.image({}),
               list: b.list({ element: () => b.int({}) }),
               group: b.group({
                  items: {
                     x: b.markdown({ markdown: '## Hello world' }),
                     c: b.int({ max: 50 }),
                     d: b.string({}),
                  },
               }),
            },
            { appearance: 'tab' },
         ),
      }),

   run: async (flow, form) => {
      const graph = flow.nodes
      //   👇 < should be infered as (string | number)
      form.exampleChoice
      if (form.exampleChoice.group) {
         flow.output_text(`got a group: ${JSON.stringify(form.exampleChoice.group)}`)
      }
      if (form.exampleChoice.list) {
         flow.output_text(`got a list: ${JSON.stringify(form.exampleChoice.list)}`)
      }
      if (form.exampleChoice.image) {
         flow.output_text(`got an image: ${JSON.stringify(form.exampleChoice.image)}`)
      }
   },
})
