/** @type {import('tailwindcss').Config} */
export default {
    content: [
        //
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        './library/**/*.{ts,js}',
    ],
    theme: {
        extend: {},
    },
    plugins: [
        //
        require('tailwindcss-animate'),
        require('daisyui'),
    ],
    daisyui: {
        logs: false,
        themes: ['dark'],
    },
}
