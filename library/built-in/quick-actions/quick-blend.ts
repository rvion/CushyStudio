app({
    metadata: {
        name: 'blend-modes',
        description: 'my app description',
    },
    ui: (form) => ({
        img1: form.image({}),
        img2: form.image({}),
        // prettier-ignore
        blend: form.selectManyV2([
            'clear', 'source', 'over', 'in', 'out', 'atop', 'dest', 'dest-over', 'dest-in',
            'dest-out', 'dest-atop', 'xor', 'add', 'saturate', 'multiply', 'screen',
            'overlay', 'darken', 'lighten', 'colour-dodge', 'color-dodge', 'colour-burn',
            'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion',
        ]),
    }),
    run: async (_run, { img1, img2, blend }) => {
        for (const val of blend) {
            await img1.processWithSharp((i) =>
                i
                    .composite([
                        { input: img2.absPath, blend: val.id },
                        { input: { text: { text: val.id, font: 'Arial', dpi: 800 } }, gravity: 'north' },
                    ])
                    .rotate(45),
            )
        }
    },
})
