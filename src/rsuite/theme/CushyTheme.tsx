import type { THEME } from './Theme2'

import { makeAutoObservable, observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { type ReactNode, useMemo } from 'react'

import { Frame } from '../frame/Frame'
import { run_Kolor } from '../kolor/prefab_Kolor'
import { NumberVar } from './CSSVar'
import { defaultDarkTheme, ThemeCtx } from './ThemeCtx'

/* 🔴 WIP; mostly unused; since I went with a different approach */
export class CushyThemeProvider {
    constructor() {
        makeAutoObservable(this)
    }

    get value(): THEME {
        return {
            ...defaultDarkTheme,
            inputBorder: new NumberVar('input-border', () => cushy.theme.value.border ?? 20),
            get text() {
                return run_Kolor(cushy.theme.value.text)
            },
            get labelText() {
                const raw = cushy.theme.value.textLabel
                if (raw == null) return undefined
                return run_Kolor(raw)
            },
            // inputBorder: new NumberVar(
            //     'input-border',
            //     (() => {
            //         const x = observable({ value: 0 })
            //         let y = 0
            //         setInterval(() => {
            //             // y++
            //             x.value += 10
            //             if (x.value > 100) x.value = 0
            //         }, 100)
            //         return () => x.value
            //     })(),
            // ),
        }
    }
}

export const CushyTheme = observer((p: { children: ReactNode }) => {
    const theme = useMemo(() => new CushyThemeProvider(), [cushy])
    return (
        <ThemeCtx.Provider value={theme}>
            <Frame //
                style={{
                    // @ts-expect-error 🔴
                    '--KLR': cushy.theme.root.value.base,
                    '--input-border': theme.value.inputBorder.value / 100,
                }}
                base={cushy.theme.value.base}
                text={cushy.themeText /* chromaBlend: 99, hueShift: 0 */}
                tw='h-full'
                expand
            >
                {p.children}
            </Frame>
        </ThemeCtx.Provider>
    )
})
