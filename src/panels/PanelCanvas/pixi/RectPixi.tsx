import type { SimpleRect } from '../../../csuite/fields/core-prefabs/RectSchema'

import { observer } from 'mobx-react-lite'

export const RectPixi = observer(function RectPixi(p: SimpleRect) {
   return (
      <pixiGraphics
         draw={(g) => {
            g.clear()
            g.rect(p.x, p.y, p.width, p.height)
            g.stroke({ width: 8, color: 'red' })
            // g.setStrokeStyle({ color: 'blue', width: 8 })
            // g.setFillStyle({ color: 'red', alpha: 0.5 })
            // g.rect(-100, -100, 100, 100)
         }}
         zIndex={999}
      />
   )
})
