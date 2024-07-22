import { observer } from 'mobx-react-lite'

import { DebugControlsUI } from '../../csuite/debug/DebugControlsUI'
import { Frame } from '../../csuite/frame/Frame'
import { tooltipStuff } from '../../csuite/frame/tooltip'

export const FooterBarUI = observer(function FooterBarUI_(p: {}) {
    return (
        <Frame
            //
            base={cushy.theme.value.appbar ?? { contrast: 0.3 }}
            tw='flex items-center px-1 h-input'
            style={{ height: '24px' }}
        >
            <DebugControlsUI />
            <div tw='flex-1' />
            {tooltipStuff.deepest && <div>{tooltipStuff.deepest.text}</div>}
        </Frame>
    )
})
