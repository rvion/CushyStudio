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
    run: async (run, ui) => {
        const img1 = ui.img1
        const img2 = ui.img2
        for (const val of ui.blend) {
            const res = await run.Sharp.sharp(img1.absPath) //
                // .rotate()
                .composite([
                    {
                        input: img2.absPath,
                        blend: val.id,
                    },
                ])
                .toBuffer()
            await run.Sharp.toMediaImage(res)
        }
    },
})
