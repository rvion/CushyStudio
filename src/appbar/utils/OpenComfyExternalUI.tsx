import { observer } from 'mobx-react-lite'

import { openExternal } from '../../app/layout/openExternal'
import { Button } from '../../csuite/button/Button'

export const OpenComfyExternalUI = observer(function OpenComfyExternalUI_(p: {}) {
   return (
      <Button
         size='sm'
         look='subtle'
         className='self-start'
         icon={IKONS.mdiOpenInNew}
         onClick={() => openExternal(cushy.getServerHostHTTP())}
      >
         {/* ComfyUI Web */}
      </Button>
   )
})
