import type { BoxUIProps } from '../box/BoxUIProps'

import { observer } from 'mobx-react-lite'

import { Frame } from '../frame/Frame'

export const FrameSubtle = observer(function BoxSubtle_({ children, ...rest }: BoxUIProps) {
    return (
        <Frame {...rest} text={{ contrast: 0.3, chromaBlend: 1, hueShift: 0 }}>
            {children}
        </Frame>
    )
})
