import { observer } from 'mobx-react-lite'

import { Button } from '../../../rsuite/button/Button'
import { useSt } from '../../../state/stateContext'
import { openExternal } from '../../layout/openExternal'

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
