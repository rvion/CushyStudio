import type { THEME } from './THEME'
import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { run_Box } from '../box/prefab_Box'
import { getLCHFromString } from '../kolor/getLCHFromString'
import { run_Kolor } from '../kolor/prefab_Kolor'
import { defaultDarkTheme, ThemeCtx } from './ThemeCtx'

export const CushyTheme = observer((p: { children: ReactNode }) => {
    const T = cushy.theme.value
    const theme: THEME = {
        ...defaultDarkTheme,
        base: getLCHFromString(T.base),
        text: run_Kolor(T.text),
        labelText: T.textLabel ? run_Kolor(T.textLabel) : run_Kolor(T.text),
        primary: run_Box(T.primary),
    }

    return <ThemeCtx.Provider value={theme}>{p.children}</ThemeCtx.Provider>
})
