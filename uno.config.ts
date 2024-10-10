import { defineConfig, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
    content: {
        filesystem: ['src/**/*.{jsx,tsx}', 'library/**/*.{jsx,tsx}'],
        pipeline: {
            include: [
                // the default
                // /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
                // include js/ts files
                'src/**/*.{jsx,tsx}',
                'library/**/*.{jsx,tsx}',
            ],
            // exclude files
            // exclude: []
        },
    },
    // ...UnoCSS options
    presets: [presetUno()],

    // 💬 2024-10-08 rvion:
    // | this is needed to add back the @apply directive in css
    // | https://unocss.dev/transformers/directives#at-apply
    transformers: [transformerDirectives()],
})
