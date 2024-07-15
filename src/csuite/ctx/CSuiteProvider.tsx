import type { CSuiteConfig } from './CSuiteConfig'

import { observer } from 'mobx-react-lite'
import { type CSSProperties, type ReactNode } from 'react'

import { Frame } from '../frame/Frame'
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
    const config = p.config
    return (
        <CSuiteCtx.Provider value={config}>
            <Frame //
                className={p.className}
                tw='w-full h-full flex-1'
                base={config.base}
                text={config.text}
                style={{
                    // @ts-expect-error 🔴
                    '--KLR': config.baseStr,
                    // '--KLRH': config.baseStr,
                    // '--input-border': getNum(config.inputBorder) / 100,
                    '--DIR': config.shiftDirection,
                    '--roundness': '5px',
                    '--widget-height': `${config.widgetHeight}rem`,
                    '--input-height': `${config.inputHeight}rem`,
                    '--input-icon-height': `${config.inputHeight / 1.8}rem`,
                }}
            >
                {p.children}
            </Frame>
        </CSuiteCtx.Provider>
    )
})
