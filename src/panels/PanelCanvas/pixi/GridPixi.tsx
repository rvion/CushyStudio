import { extend } from '@pixi/react'
import { observer } from 'mobx-react-lite'
import { Graphics } from 'pixi.js'

extend({ Graphics })
export const GridPixi = observer(function PixiGridUI_(p: {
   x: number
   y: number
   height: number
   width: number
}) {
   const cellW = p.width / 10
   const cellH = p.height / 10
   return (
      <pixiGraphics
         draw={(g) => {
            for (let x = 0; x < 10; x++) {
               for (let y = 0; y < 10; y++) {
                  g.rect(
                     //
                     p.x + x * cellW,
                     p.y + y * cellH,
                     cellW,
                     cellH,
                  ).fill((x + y) % 2 ? 0x656565 : 0x333333)
               }
            }
         }}
      />
   )
})
