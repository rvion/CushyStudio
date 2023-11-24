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
                    // primary: 'oklch(65.69% 0.196 275.75)',
                    // secondary: 'oklch(74.8% 0.26 342.55)',
                    // accent: 'oklch(74.51% 0.167 183.61)',
                    // primary: '#087ad1',
                    // secondary: '#8B60DF',
                    // accent: '#86F159',
                    // secondary: 'teal',
                    // neutral: '#3d4451',
                    // 'base-100': '#ffffff',
                },
            },
            // 'dark',
            {
                dark: {
                    ...require('daisyui/src/theming/themes')['dim'],
                    primary: 'oklch(65.69% 0.196 275.75)',
                    secondary: 'oklch(0.49 0.16 246.51)',
                    accent: 'oklch(74.51% 0.167 183.61)',
                    'base-100': '#2A303C',
                    'base-200': '#20252E',
                    'base-300': '#191c23',
                    'base-content': '#B2CCD6',
                    ...notReallyRound,
                    // 'base-100': '#302f2f',
                    // 'base-200': '#2b2c2d',
                    // 'base-300': '#15191e',
                    // accent: '#86F159',
                    // secondary: 'teal',
                    // neutral: '#3d4451',
                    // 'base-100': '#ffffff',
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
