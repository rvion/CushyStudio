/** @type {import('tailwindcss').Config} */

const notReallyRound = {
    '--rounded-box': '0.25rem',
    '--rounded-btn': '.125rem',
    '--rounded-badge': '.25rem',
    '--tab-radius': '0.25rem',
    '--animation-btn': '0',
    '--animation-input': '0',
    '--btn-focus-scale': '1',
}

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
        logs: false,
        themes: [
            // 'light',
            {
                light: {
                    ...require('daisyui/src/theming/themes')['corporate'],
                    'primary-content': 'white',
                    ...notReallyRound,
                },
            },
            {
                light2: {
                    ...require('daisyui/src/theming/themes')['emerald'],
                    primary: '#5aa474',
                    'primary-content': 'white',
                    ...notReallyRound,
                },
            },
            // 'dark',
            {
                dark: {
                    ...require('daisyui/src/theming/themes')['dim'],
                    // primary: 'oklch(65.69% 0.196 275.75)',
                    secondary: '#8ebc5f', // 'oklch(0.49 0.16 246.51)',
                    // accent: 'oklch(74.51% 0.167 183.61)',
                    'base-100': '#2A303C',
                    'base-200': '#20252E',
                    'base-300': '#191c23',
                    'base-content': '#B2CCD6',
                    ...notReallyRound,
                },
            },
            {
                dark2: {
                    ...require('daisyui/src/theming/themes')['dim'],
                    ...notReallyRound,
                },
            },
            {
                dark3: {
                    ...require('daisyui/src/theming/themes')['dark'],
                    primary: '#9FA8DA',
                    ...notReallyRound,
                },
            },
            // 'wireframe',
            {
                wireframe: {
                    ...require('daisyui/src/theming/themes')['wireframe'],
                    ...notReallyRound,
                },
            },
            {
                cupcake: {
                    ...require('daisyui/src/theming/themes')['cupcake'],
                    ...notReallyRound,
                },
            },
            'aqua',
            {
                valentine: {
                    ...require('daisyui/src/theming/themes')['valentine'],
                    ...notReallyRound,
                },
            },
            'sunset',
            'luxury',
            'forest',
            'business',
        ],
    },
}
