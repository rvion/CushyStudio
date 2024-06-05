import { observer } from 'mobx-react-lite'

import { Frame } from '../../csuite/frame/Frame'
import { DebugControlsUI } from '../../operators/DebugControlsUI'

export const FooterBarUI = observer(function FooterBarUI_(p: {}) {
    return (
        <Frame
            //
            base={cushy.theme.value.appbar ?? { contrast: 0.3 }}
            tw='flex items-center px-1'
            style={{ height: '24px' }}
        >
            <DebugControlsUI />
        </Frame>
    )
})
