import type { THEME } from './Theme2'

import { createContext } from 'react'

import { NumberVar } from './CSSVar'

export const defaultDarkTheme: THEME = {
    // NEW
    inputBorder: new NumberVar('input-border', 10 /* % */),

    // LEGACY
    /* 🔴 */ base: { lightness: 0.1, chroma: 0.05, hue: 0 },
    /* 🔴 */ text: { contrast: 1, chroma: 0.1 },
    /* 🔴 */ labelText: { contrast: 0.6, hueShift: 0, chroma: 0.1 },
    /* 🔴 */ primary: { base: { chroma: 0.2 }, border: { contrast: 0.1 } },
    /* 🔴 */ shiftDirection: 1,
}

// 🔶 the reason to wrap things in value is to make sure we can provide a stable "Box" (pointer)
// mobx will allow us to update the THEME without the context to change forcing all widgets to
// re-render
export const ThemeCtx = createContext<{
    value: THEME
}>({ value: defaultDarkTheme })
