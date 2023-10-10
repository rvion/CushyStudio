import { TEST } from './TEST'

action('2023-10-10-fancy-transparent-outline.json', {
    author: 'experiments',
    ui: (ui) => ({}),

    run: async (flow, p) => {
        TEST(flow)
        await flow.PROMPT()
    },
})
