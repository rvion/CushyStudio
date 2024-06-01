import { observer } from 'mobx-react-lite'

import { DebugControlsUI } from '../../operators/DebugControlsUI'
import { Frame } from '../../rsuite/frame/Frame'

export const FooterBarUI = observer(function FooterBarUI_(p: {}) {
    return (
        <Frame tw='flex items-center px-1' base={10} style={{ height: '24px' }}>
            <DebugControlsUI />
        </Frame>
    )
})
