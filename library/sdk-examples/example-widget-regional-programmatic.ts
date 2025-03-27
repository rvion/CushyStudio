app({
   metadata: {
      name: 'example prompt programmatic',
      description: 'my app description',
   },
   ui: (b) =>
      b.fields({
         userMessage: b.string({ textarea: true }),
         llmModel: b.llmModel(),
         regionalPrompt: b.regional({
            height: 512,
            width: 512,
            initialPosition: ({ width: w, height: h }) => ({
               fill: `#${Math.round(Math.random() * 0xffffff).toString(16)}`,
               height: 64,
               width: 64,
               depth: 1,
               x: Math.round(Math.random() * w),
               y: Math.round(Math.random() * h),
               z: 1,
            }),
            element: () =>
               b.fields({
                  prompt: b.prompt({}),
                  mode: b.selectOneString(['combine', 'concat']),
               }),
         }),
         button: b.button({ onClick: () => void cushy.showConfettiAndBringFun() }),
      }),
   run: (run, ui) => {
      const regional = run.form.regionalPrompt
      const newItem = regional.zFields.items.addItem()!
      newItem.shape.zSet({
         width: 256,
         height: 256,
         x: 0,
         y: 128,
      })
      newItem.value.prompt.text = `Set to dynamic prompt at ${Date.now()}`
   },
})
