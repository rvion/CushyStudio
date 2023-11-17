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
        themes: [
            //
            // 'light',
            {
                light: {
                    ...require('daisyui/src/theming/themes')['[data-theme=light]'],
                    primary: '#087ad1',
                    secondary: '#8B60DF',
                    accent: '#86F159',
                    // secondary: 'teal',
                    // neutral: '#3d4451',
                    // 'base-100': '#ffffff',
                },
            },
            // 'dark',
            {
                dark: {
                    ...require('daisyui/src/theming/themes')['[data-theme=dark]'],
                    primary: '#087ad1',
                    secondary: '#8B60DF',
                    accent: '#ffe999',
                    // accent: '#86F159',
                    // secondary: 'teal',
                    // neutral: '#3d4451',
                    // 'base-100': '#ffffff',
                },
            },
            // 'wireframe',
            {
                wireframe: {
                    ...require('daisyui/src/theming/themes')['[data-theme=wireframe]'],
                    primary: '#087ad1',
                    secondary: '#8B60DF',
                    accent: '#ffe999',
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
