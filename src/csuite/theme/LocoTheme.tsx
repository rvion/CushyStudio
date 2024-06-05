import type { THEME } from './Theme2'
import type { ReactNode } from 'react'

import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'

import { Frame } from '../frame/Frame'
import { defaultDarkTheme, ThemeCtx } from './ThemeCtx'

/* 🔴 WIP; mostly unused; since I went with a different approach */
export class LocoThemeProvider {
    constructor() {
        makeAutoObservable(this)
    }

    get value(): THEME {
        return { ...defaultDarkTheme }
    }
}

const locoThemeProvider = new LocoThemeProvider()

export const CushyTheme = observer((p: { children: ReactNode }) => {
    return (
        <ThemeCtx.Provider value={locoThemeProvider}>
            <Frame //
                style={{
                    // @ts-expect-error
                    '--KLR': cushy.theme.root.value.base,
                    '--KLRH': cushy.theme.root.value.base,
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
