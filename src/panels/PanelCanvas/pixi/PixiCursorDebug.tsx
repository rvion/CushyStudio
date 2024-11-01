import { observer } from 'mobx-react-lite'

import { useUnifiedCanvas } from '../states/UnifiedCanvasCtx'

export const PixiCursorDebugUI = observer(function PixiCursorDebugUI_(p: {}) {
   const uc1 = useUnifiedCanvas()
   return (
      <pixiText //
         text={'viewport = ' + JSON.stringify(uc1.viewportInfos, null, 3) + '\n cursor = ' + JSON.stringify(uc1.cursor, null, 3)} // prettier-ignore
         x={100}
         y={20}
         zIndex={999}
         style={{ fill: 'red', fontSize: 20 }}
      />
   )
})
