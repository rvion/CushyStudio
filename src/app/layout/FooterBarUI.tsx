import { observer } from 'mobx-react-lite'

import { DebugControlsUI } from '../../operators/DebugControlsUI'
import { Box } from '../../rsuite/box/Box'

export const FooterBarUI = observer(function FooterBarUI_(p: {}) {
    return (
        <Box tw='flex items-center px-1' base={10} style={{ height: '24px' }}>
            <DebugControlsUI />
        </Box>
    )
})
