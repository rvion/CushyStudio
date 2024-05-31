import { createContext } from 'react'

import { THEME } from './THEME'

export const defaultDarkTheme: THEME = {
    base: { lightness: 0.1, chroma: 0.05, hue: 0 },
    text: { contrast: 1, chroma: 0.1 },
    labelText: { contrast: 0.9, hueShift: 0, chromaBlend: 1 },
    primary: { base: { chroma: 0.2 }, border: { contrast: 0.1 } },
    shiftDirection: 1,
    // // ---------------------
    // /* 🔴 */ default: {},
    // /* 🔴 */ ghost: {},
    // /* 🔴 */ secondary: {},
    // /* 🔴 */ strong: {},
    // /* 🔴 */ subtle: {},
    // primary,
}

// 🔶 the reason to wrap things in value is to make sure we can provide a stable "Box" (pointer)
// mobx will allow us to update the THEME without the context to change forcing all widgets to
// re-render
export const ThemeCtx = createContext<{ value: THEME }>({ value: defaultDarkTheme })
