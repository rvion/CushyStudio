import type { CSuiteConfig } from './CSuiteConfig'

import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { Frame, type FrameProps } from '../frame/Frame'
import { CSuiteCtx } from './CSuiteCtx'
import { useCSuite } from './useCSuite'

type _Override = {
    CSUITE: CSuiteConfig
    STYLE: { [key: string]: any }
}

// 2024-07-28 rvion - TODO: rename to something like `FrameWithCSuiteOverride`
// to better convery what this component does.
export const FrameWithCSuiteOverride = observer(function CSuiteOverride_(p: { config: Partial<CSuiteConfig> } & FrameProps) {
    // 1. retrieve the current CSuiteConfig
    const prev: CSuiteConfig = useCSuite()

    const { config, style, ...frameProps } = p
    // 2. generate a new CSuiteConfig by merging the current one with the new one
    // using a Proxy for maximal efficiency
    const { CSUITE, STYLE } = useMemo((): _Override => {
        const CSUITE = new Proxy(p.config, {
            get: (target, prop): unknown =>
                prop in target //
                    ? (target as any)[prop]
                    : (prev as any)[prop],
        }) as CSuiteConfig

        // 3. since some things still rely on css variables, we need to make sure
        // we properly override them for children
        const STYLE: { [key: string]: any } = { ...p.style }
        if (p.config.base != null || p.config.baseStr != null) STYLE['--KLR'] = config.baseStr
        if (p.config.shiftDirection != null) STYLE['--DIR'] = config.shiftDirection

        if (p.config.widgetHeight != null) STYLE['--widget-height'] = `${config.widgetHeight}rem`
        if (p.config.insideHeight != null) STYLE['--inside-height'] = `${config.insideHeight}rem`
        if (p.config.inputHeight != null) {
            STYLE['--input-height'] = `${p.config.inputHeight}rem`
            STYLE['--input-icon-height'] = `${p.config.inputHeight / 1.8}rem`
        }

        return { CSUITE, STYLE }
    }, [p.config])

    return (
        <CSuiteCtx.Provider value={CSUITE}>
            <Frame {...frameProps} style={STYLE} />
        </CSuiteCtx.Provider>
    )
})
