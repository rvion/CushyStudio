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

    get F() { return cushy.theme.value } // prettier-ignore
    get base(){ return getLCHFromString(this.F.base) } // prettier-ignore
    get text() { return run_Kolor(this.F.text) } // prettier-ignore
    get labelText() { return this.F.textLabel ? run_Kolor(this.F.textLabel) : run_Kolor(this.F.text) } // prettier-ignore
    get primary() { return run_Box(this.F.primary) } // prettier-ignore

    get value(): THEME {
        return {
            ...defaultDarkTheme,
            base: this.base,
            text: this.text,
            labelText: this.labelText,
            primary: this.primary,
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
