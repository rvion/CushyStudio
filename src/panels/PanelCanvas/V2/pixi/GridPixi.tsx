import { Graphics } from '@pixi/react'
import { observer } from 'mobx-react-lite'

export const GridPixi = observer(function PixiGridUI_(p: {
    //
    x: number
    y: number
    height: number
    width: number
}) {
    const cellW = p.width / 10
    const cellH = p.height / 10
    return (
        <Graphics
            anchor={0.5}
            draw={(g) => {
                // draw a white and black grid
                g.lineStyle(0, 0x0, 0)
                for (let x = 0; x < 10; x++) {
                    for (let y = 0; y < 10; y++) {
                        g.beginFill((x + y) % 2 ? 0x656565 : 0x333333)
                        g.drawRect(
                            //
                            p.x + x * cellW,
                            p.y + y * cellH,
                            cellW,
                            cellH,
                        )
                        g.endFill()
                    }
                }
            }}
        />
    )
})
