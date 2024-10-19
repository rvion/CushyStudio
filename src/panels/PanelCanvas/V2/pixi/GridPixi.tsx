import { Graphics } from '@pixi/react'
import { observer } from 'mobx-react-lite'

export const GridPixi = observer(function PixiGridUI_(p: {
    //
    height: number
    width: number
}) {
    const cellW = p.width / 20
    const cellH = p.height / 20
    return (
        <Graphics
            anchor={0.5}
            draw={(g) => {
                // draw a white and black grid
                g.lineStyle(0, 0x0, 0)
                for (let x = -10; x < 10; x++) {
                    for (let y = -10; y < 10; y++) {
                        g.beginFill((x + y) % 2 ? 0x656565 : 0x333333)
                        g.drawRect(x * cellW, y * cellH, cellW, cellH)
                        g.endFill()
                    }
                }
            }}
        />
    )
})
