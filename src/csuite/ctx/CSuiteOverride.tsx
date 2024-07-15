import type { CSuiteConfig } from './CSuiteConfig'
import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { Frame } from '../frame/Frame'
import { CSuiteCtx } from './CSuiteCtx'
import { useCSuite } from './useCSuite'

export const CSuiteOverride = observer(function CSuiteOverride_(p: {
    //
    className?: string
    config: Partial<CSuiteConfig>
    children?: ReactNode
}) {
    const prev = useCSuite()

    const config = useMemo(
        () =>
            new Proxy(p.config, {
                get: (target, prop) =>
                    prop in target //
                        ? (target as any)[prop]
                        : (prev as any)[prop],
            }),
        [p.config],
    ) as CSuiteConfig

    return (
        <CSuiteCtx.Provider value={config}>
            <Frame //
                className={p.className}
                // base={cushy.theme.value.base} // 🔴
                // text={cushy.themeText} // 🔴
                style={{
                    // @ts-expect-error 🔴
                    '--KLR': config.baseStr,
                    '--DIR': config.shiftDirection,
                    '--roundness': '5px',
                    '--input-height': `${config.inputHeight}rem`,
                    '--input-icon-height': `${config.inputHeight / 1.8}rem`,
                    // '--input-border': getNum(config.inputBorder) / 100,
                }}
            >
                {p.children}
            </Frame>
        </CSuiteCtx.Provider>
    )
})
