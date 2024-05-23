import { observer } from 'mobx-react-lite'

import { DebugControlsUI } from '../../operators/DebugControlsUI'
import { Box } from '../../theme/colorEngine/Box'

export const FooterBarUI = observer(function FooterBarUI_(p: {}) {
    return (
        <Box base={0} style={{ height: '24px' }}>
            <DebugControlsUI />
        </Box>
    )
})
