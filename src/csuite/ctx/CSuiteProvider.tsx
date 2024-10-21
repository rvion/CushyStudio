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
                tw='h-full w-full flex-1'
                base={config.base}
                text={config.text}
                style={{
                    // @ts-expect-error 🔴
                    '--KLR': config.baseStr,
                    '--DIR': config.shiftDirection,
                    '--roundness': '5px',
                    // sizes
                    '--widget-height': `${config.widgetHeight}rem`,
                    '--input-height': `${config.inputHeight}rem`,
                    '--inside-height': `${config.insideHeight}rem`, // TEMP
                    // legacy ? change to inside ?
                    '--input-icon-height': `${config.inputHeight / 1.8}rem`,
                }}
            >
                {p.children}
            </Frame>
        </CSuiteCtx.Provider>
    )
})
