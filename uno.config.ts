import { defineConfig, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
    // ...UnoCSS options
    presets: [presetUno()],

    // 💬 2024-10-08 rvion:
    // | this is needed to add back the @apply directive in css
    // | https://unocss.dev/transformers/directives#at-apply
    transformers: [transformerDirectives()],
})
