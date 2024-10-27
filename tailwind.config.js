/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{ts,tsx}', './library/**/*.{ts,tsx}'],
    theme: { extend: {} },
    plugins: [],
    safelist: [
        ...Array(12)
            .fill()
            .flatMap((_, ix) => [`col-span-${ix + 1}`, `row-span-${ix + 1}`, `grid-cols-${ix + 1}`, `grid-rows-${ix + 1}`])
            .flatMap((rule) => [rule, `md:${rule}`, `lg:${rule}`]),
    ],
}
