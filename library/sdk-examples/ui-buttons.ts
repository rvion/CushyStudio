app({
    metadata: {
        name: 'ui-buttons',
        description: 'sdk demo for buttons',
    },
    ui: (ui) => ({
        button1: ui.button({ onClick: () => void cushy.showConfettiAndBringFun() }),
        button2: ui.button({ onClick: cushy.showConfettiAndBringFun }),
    }),
    run: async (run, ui) => {},
})
