import type { BoxUIProps } from './BoxUIProps'

import { observer } from 'mobx-react-lite'

import { Frame } from '../frame/Frame'

export const BoxBase = observer(function BoxTitleUI_({ children, ...rest }: BoxUIProps) {
    return (
        <Frame {...rest} base={{ contrast: 0.05 }}>
            {children}
        </Frame>
    )
})

export const BoxTitle = observer(function BoxTitleUI_({ children, ...rest }: BoxUIProps) {
    return (
        <Frame {...rest} text={{ contrast: 1, chromaBlend: 100, hueShift: 0 }}>
            {children}
        </Frame>
    )
})

export const BoxSubtle = observer(function BoxSubtle_({ children, ...rest }: BoxUIProps) {
    return (
        <Frame {...rest} text={{ contrast: 0.4, chromaBlend: 1, hueShift: 0 }}>
            {children}
        </Frame>
    )
})
