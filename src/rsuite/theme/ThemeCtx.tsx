import { createContext } from 'react'

import { THEME } from './THEME'

export const defaultDarkTheme: THEME = {
    base: { lightness: 0.1, chroma: 0.05, hue: 0 },
    text: { contrast: 1, chromaBlend: 0, hueShift: 0 },
    labelText: { contrast: 0.9, hueShift: 0, chromaBlend: 1 },
    primary: { base: { chroma: 0.2 }, border: { contrast: 0.1 } },
    // ---------------------
    /* 🔴 */ default: {},
    /* 🔴 */ ghost: {},
    /* 🔴 */ secondary: {},
    /* 🔴 */ strong: {},
    /* 🔴 */ subtle: {},
    /* 🔴 */ shiftDirection: 'pos',
    // primary,
}

export const ThemeCtx = createContext<THEME>(defaultDarkTheme)
