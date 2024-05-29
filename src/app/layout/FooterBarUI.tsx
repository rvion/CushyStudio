import { observer } from 'mobx-react-lite'

import { DebugControlsUI } from '../../operators/DebugControlsUI'
import { BoxUI } from '../../rsuite/box/BoxUI'

export const FooterBarUI = observer(function FooterBarUI_(p: {}) {
    return (
        <BoxUI tw='flex items-center px-1' base={10} style={{ height: '24px' }}>
            <DebugControlsUI />
        </BoxUI>
    )
})
