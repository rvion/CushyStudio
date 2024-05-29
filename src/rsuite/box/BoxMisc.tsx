import { observer } from 'mobx-react-lite'

import { Box } from './Box'
import { BoxUIProps } from './BoxUIProps'

export const BoxBase = observer(function BoxTitleUI_({ children, ...rest }: BoxUIProps) {
    return (
        <Box {...rest} base={{ contrast: 0.05 }}>
            {children}
        </Box>
    )
})

export const BoxTitle = observer(function BoxTitleUI_({ children, ...rest }: BoxUIProps) {
    return (
        <Box {...rest} text={{ contrast: 1, chromaBlend: 100, hueShift: 0 }}>
            {children}
        </Box>
    )
})

export const BoxSubtle = observer(function BoxSubtle_({ children, ...rest }: BoxUIProps) {
    return (
        <Box {...rest} text={{ contrast: 0.4, chromaBlend: 1, hueShift: 0 }}>
            {children}
        </Box>
    )
})
