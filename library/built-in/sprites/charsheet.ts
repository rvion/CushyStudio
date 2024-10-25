app({
   metadata: {
      name: 'charsheet',
      description: 'charsheet',
   },
   ui: (b) =>
      b.fields({
         baseImage: b.image({
            assetSuggested: [
               //
               'library/built-in/sprites/charsheet.png',
               'library/built-in/sprites/run-1.png',
            ] as RelativePath[],
         }),
      }),
   run: async (run, ui) => {},
})
