app({
   metadata: {
      name: 'ui-buttons',
      description: 'sdk demo for buttons',
   },
   ui: (b) =>
      b.fields({
         button1: b.button({ onClick: () => void cushy.showConfettiAndBringFun() }),
         button2: b.button({ onClick: cushy.showConfettiAndBringFun }),
      }),
   run: async (run, ui) => {},
})
