import { observer } from 'mobx-react-lite'

import { BoxUI } from './Box'
import { BoxUIProps } from './BoxUIProps'

export const BoxBase = observer(function BoxTitleUI_({ children, ...rest }: BoxUIProps) {
    return (
        <BoxUI {...rest} base={{ contrast: 0.05 }}>
            {children}
        </BoxUI>
    )
})

export const BoxTitle = observer(function BoxTitleUI_({ children, ...rest }: BoxUIProps) {
    return (
        <BoxUI {...rest} text={{ contrast: 1, chromaBlend: 100, hueShift: 0 }}>
            {children}
        </BoxUI>
    )
})

export const BoxSubtle = observer(function BoxSubtle_({ children, ...rest }: BoxUIProps) {
    return (
        <BoxUI {...rest} text={{ contrast: 0.4, chromaBlend: 1, hueShift: 0 }}>
            {children}
        </BoxUI>
    )
})
