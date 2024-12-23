app({
   metadata: {
      help: 'This is an example app to show how you can reference dynamically items in a list from an other list',
   },
   // 🔶 if you want to use a form dynamically,
   // for now, you need to form.shared first aroudn it
   ui: (b) =>
      b.fields({
         root: b
            .list({
               label: 'Sampler',
               defaultLength: 2,
               // min: 1,
               element: (i: number) => b.string({ default: `hello ${i}` }),
            })
            .useIn((listOfStuff) =>
               b.fields({
                  _1: b.header({ markdown: `#### Define values:`, label: false, border: false }),
                  listOfStuff,
                  _2: b.header({ markdown: `#### Reference values (select):`, label: false, border: false }),
                  listOfRefs: b.list({
                     defaultLength: 1,
                     element: b.selectOneOption(
                        listOfStuff.items.map((item) => ({ id: item.id, label: item.value })),
                        { label: 'dynamic OneOf' },
                     ),
                  }),
                  listOfRefs2: b.list({
                     defaultLength: 1,
                     element: b.selectManyOptions(
                        listOfStuff.items.map((item) => ({ id: item.id, label: item.value })),
                        { label: 'dynamic Many' },
                     ),
                  }),
                  _3: b.header({ markdown: `#### Reference values (tabs):`, label: false, border: false }),
                  refs4: b.list({
                     defaultLength: 1,
                     element: b.selectOneOption(
                        listOfStuff.items.map((item) => ({ id: item.id, label: item.value })),
                        { label: 'dynamic OneOf(tab)', appearance: 'tab' },
                     ),
                  }),
                  refs5: b.list({
                     defaultLength: 1,
                     element: b.selectManyOptions(
                        listOfStuff.items.map((item) => ({ id: item.id, label: item.value })),
                        { label: 'dynamic Many(tab)', appearance: 'tab' },
                     ),
                  }),
               }),
            ),
      }),
   run(run, ui) {
      console.log(`[🟢] done`)
   },
})
