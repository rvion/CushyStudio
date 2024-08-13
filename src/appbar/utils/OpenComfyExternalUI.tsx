import { observer } from 'mobx-react-lite'

import { openExternal } from '../../app/layout/openExternal'
import { Button } from '../../csuite/button/Button'
import { useSt } from '../../state/stateContext'

export const OpenComfyExternalUI = observer(function OpenComfyExternalUI_(p: {}) {
    const st = useSt()
    return (
        <Button
            size='sm'
            look='subtle'
            className='self-start'
            icon='mdiOpenInNew'
            onClick={() => openExternal(st.getServerHostHTTP())}
        >
            {/* ComfyUI Web */}
        </Button>
    )
})
