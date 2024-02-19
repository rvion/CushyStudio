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

const lightGlobals = {
    '--text-shadow-color': 'rgb(255, 255, 255, 0.1)',
    '--text-shadow-color-inv' : 'rgb(0, 0, 0, 0.2)'
}

const darkGlobals = {
    '--text-shadow-color': 'rgb(0, 0, 0, 0.2)',
    '--text-shadow-color-inv' : 'rgb(255, 255, 255, 0.1)'
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
                    ...lightGlobals,
                },
            },
            {
                light2: {
                    ...require('daisyui/src/theming/themes')['emerald'],
                    primary: '#5aa474',
                    'primary-content': 'white',
                    ...notReallyRound,
                    ...lightGlobals,
                },
            },
            // 'dark',
            {
                dracula: {
                    ...require('daisyui/src/theming/themes')['dracula'],
                    primary: '#9FA8DA',
                    // ...notReallyRound,
                },
            },
            {
                dark: {
                    ...require('daisyui/src/theming/themes')['dim'],
                    // primary: 'oklch(65.69% 0.196 275.75)',
                    primary: '#9FA8DA',
                    secondary: 'oklch(74.8% 0.26 342.55)',
                    // accent: 'oklch(74.51% 0.167 183.61)',
                    // secondary: '#8ebc5f', // 'oklch(0.49 0.16 246.51)',
                    // accent: 'oklch(74.51% 0.167 183.61)',
                    'base-100': '#2A303C',
                    'base-200': '#20252E',
                    'base-300': '#191c23',
                    'base-content': '#B2CCD6',
                    ...notReallyRound,
                    ...darkGlobals,
                },
            },
            {
                dark2: {
                    ...require('daisyui/src/theming/themes')['dim'],
                    ...notReallyRound,
                    ...darkGlobals,
                },
            },
            {
                dark3: {
                    ...require('daisyui/src/theming/themes')['dark'],
                    primary: '#9FA8DA',
                    ...notReallyRound,
                    ...darkGlobals,
                },
            },
            // 'wireframe',
            {
                wireframe: {
                    ...require('daisyui/src/theming/themes')['wireframe'],
                    ...notReallyRound,
                    ...lightGlobals,
                },
            },
            {
                cupcake: {
                    ...require('daisyui/src/theming/themes')['cupcake'],
                    ...notReallyRound,
                    ...lightGlobals,
                },
            },
            'aqua',
            {
                valentine: {
                    ...require('daisyui/src/theming/themes')['valentine'],
                    ...notReallyRound,
                    ...lightGlobals,
                },
            },
            'sunset',
            'luxury',
            'forest',
            'business',
        ],
    },
}
