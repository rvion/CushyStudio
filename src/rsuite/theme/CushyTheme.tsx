import type { THEME } from './THEME'

import { observer } from 'mobx-react-lite'

import { run_Box } from '../box/prefab_Box'
import { getLCHFromString } from '../kolor/getLCHFromString'
import { run_Kolor } from '../kolor/prefab_Kolor'
import { defaultDarkTheme, ThemeCtx } from './ThemeCtx'

export const CushyTheme = observer(() => {
    const T = cushy.theme.value
    const theme: THEME = {
        ...defaultDarkTheme,
        text: run_Kolor(T.text),
        labelText: T.textLabel ? run_Kolor(T.textLabel) : run_Kolor(T.text),
        base: getLCHFromString(T.base),
        primary: run_Box(T.primary),
    }

    return (
        <ThemeCtx.Provider value={theme}>
            <h1>CushyTheme</h1>
        </ThemeCtx.Provider>
    )
})
