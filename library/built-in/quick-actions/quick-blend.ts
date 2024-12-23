app({
   metadata: {
      name: 'blend-modes',
      description: 'quickly test blend modes supported by sharp',
      author: 'rvion',
      categories: ['quick actions', 'image', 'sharp'],
      help: `see [https://sharp.pixelplumbing.com/api-composite](https://sharp.pixelplumbing.com/api-composite)`,
   },
   ui: (b) =>
      b.fields({
         img1: b.image(),
         img2: b.image(),
         // prettier-ignore
         blend: b.selectManyStrings([
            'clear', 'source', 'over', 'in', 'out', 'atop', 'dest', 'dest-over', 'dest-in',
            'dest-out', 'dest-atop', 'xor', 'add', 'saturate', 'multiply', 'screen',
            'overlay', 'darken', 'lighten', 'colour-dodge', 'color-dodge', 'colour-burn',
            'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion',
        ]),
      }),
   run: async (_, { img1, img2, blend }) => {
      for (const val of blend) {
         await img1.processWithSharp((i) =>
            i.composite([
               { input: img2.absPath, blend: val },
               { input: { text: { text: val, font: 'Arial', dpi: 800 } }, gravity: 'north' },
            ]),
         )
      }
   },
})
