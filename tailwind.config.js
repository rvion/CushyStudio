/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './library/**/*.{ts,js}'],
    theme: {
        extend: {},
    },
    plugins: [
        //
        require('tailwindcss-animate'),
        require('daisyui'),
    ],
    daisyui: {
        themes: ['light', 'dark', 'cupcake', 'aqua', 'valentine', 'wireframe'],
    },
}
