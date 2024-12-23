app({
   ui: (b) =>
      b.fields({
         help: b.markdown({
            label: false,
            markdown: [
               //
               `This example showcase how apps can remember data across`,
               `multiple runs though custom data store.`,
               `- Press [Run] to see the amount of times you've pressed play`,
               `- 📝 note: you can restart the app, update it, it will remember how many times you pressed it.`,
            ].join('\n\n'),
         }),
      }),

   run: async (sdk, ui) => {
      const store = sdk.Store.getOrCreate({ key: 'example-key-1337', makeDefaultValue: () => ({ count: 0 }) })
      const prevValue = store.get()
      sdk.output_Markdown(
         [
            //
            `store created: **${sdk.formatAsRelativeDateTime(store.createdAt)}**`,
            `previous run : **${sdk.formatAsRelativeDateTime(store.updatedAt)}**`,
            `run count    : **${store.get().count + 1} times**`,
         ].join('\n\n'),
      )
      store.update({ json: { count: prevValue.count + 1 } })
   },
})
