import type { CSuiteConfig } from './CSuiteConfig'

import { observer } from 'mobx-react-lite'
import { type CSSProperties, type ReactNode } from 'react'

import { Frame } from '../frame/Frame'
import { getNum } from '../tinyCSS/CSSVar'
import { CSuiteCtx } from './CSuiteCtx'

/**
 * minimalist wrapper around react context provider
 * that also inject CSS vars + set a few CSS properties to the root item
 * (color, ...)
 * */
export const CSuiteProvider = observer(function CSuiteProvider_(p: {
    //

    children: ReactNode
    config: CSuiteConfig
    className?: string
    style?: CSSProperties
}) {
    const conf = p.config
    return (
        <CSuiteCtx.Provider value={p.config}>
            <Frame //
                className={p.className}
                tw='w-full h-full flex-1'
                base={cushy.theme.value.base}
                text={cushy.themeText}
                style={{
                    // @ts-expect-error 🔴
                    '--KLR': conf.baseStr,
                    '--KLRH': conf.baseStr,
                    '--input-border': getNum(conf.inputBorder) / 100,
                    '--DIR': 1,
                }}
            >
                {p.children}
            </Frame>
        </CSuiteCtx.Provider>
    )
})
