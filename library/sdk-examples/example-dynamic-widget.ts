import { createElement } from 'react'

/**🔶 This is an advanced example of the runtime updating the widget live during runtime */
app({
   ui: (b) =>
      b.fields({
         demo1: b.number().list(),
      }),

   run: async (run) => {
      // add a item dynamically
      run.form.fields.demo1.addItem()
      cushy.layout.addCustomV2(() => createElement('div', {}, 'This is a custom widget'), {})
      // then repeatedly update the value of the items
      for (const _ of [1, 2, 3, 4, 5]) {
         await run.sleep(100)
         run.form.fields.demo1.items.map((i) => {
            i.value += 3
         })
      }
   },
})
