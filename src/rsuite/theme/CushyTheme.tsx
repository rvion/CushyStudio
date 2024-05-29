import type { THEME } from './THEME'

import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { memo, type ReactNode } from 'react'

import { run_Box } from '../box/prefab_Box'
import { getLCHFromString } from '../kolor/getLCHFromString'
import { run_Kolor } from '../kolor/prefab_Kolor'
import { defaultDarkTheme, ThemeCtx } from './ThemeCtx'

export class CushyThemeProvider {
    constructor() {
        makeAutoObservable(this)
    }

    get value(): THEME {
        const T = cushy.theme.value
        return {
            ...defaultDarkTheme,
            base: getLCHFromString(T.base),
            text: run_Kolor(T.text),
            labelText: T.textLabel ? run_Kolor(T.textLabel) : run_Kolor(T.text),
            primary: run_Box(T.primary),
        }
    }
}

const cushyThemeProvider = new CushyThemeProvider()

export const CushyTheme = memo((p: { children: ReactNode }) => {
    return (
        <ThemeCtx.Provider //
            value={cushyThemeProvider}
        >
            {p.children}
        </ThemeCtx.Provider>
    )
})
