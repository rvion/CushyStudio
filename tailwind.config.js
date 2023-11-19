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
                    // primary: '#087ad1',
                    // secondary: '#8B60DF',
                    // accent: '#ffe999',
                    // accent: '#86F159',
                    // secondary: 'teal',
                    // neutral: '#3d4451',
                    // 'base-100': '#ffffff',
                },
            },
            'cupcake',
            'aqua',
            'valentine',
            'sunset',
            'luxury',
            'forest',
            'business',
        ],
    },
}
