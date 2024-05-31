import type { THEME } from './THEME'
import type { ReactNode } from 'react'

import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'

import { BoxUI } from '../box/BoxUI'
import { run_Box } from '../box/prefab_Box'
import { getLCHFromString } from '../kolor/getLCHFromString'
import { run_Kolor } from '../kolor/prefab_Kolor'
import { defaultDarkTheme, ThemeCtx } from './ThemeCtx'

/* 🔴 WIP; mostly unused; since I went with a different approach */
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
            // base: this.base,
            // text: this.text,
            // labelText: this.labelText,
            // primary: this.primary,
        }
    }
}

const cushyThemeProvider = new CushyThemeProvider()

export const CushyTheme = observer((p: { children: ReactNode }) => {
    return (
        <ThemeCtx.Provider value={cushyThemeProvider}>
            <BoxUI //
                // @ts-expect-error 🔴
                style={{ '--KLR': cushy.theme.root.value.base }}
                base={cushy.theme.value.base}
                text={cushy.themeText /* chromaBlend: 99, hueShift: 0 */}
                tw='h-full'
                expand
            >
                {p.children}
            </BoxUI>
        </ThemeCtx.Provider>
    )
})
