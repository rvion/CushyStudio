import type { SimpleRect } from '../../../../csuite/fields/core-prefabs/RectSchema'

import { Graphics } from '@pixi/react'
import { observer } from 'mobx-react-lite'

export const RectPixi = observer(function RectPixi(p: SimpleRect) {
    return (
        <Graphics
            anchor={0.5}
            draw={(g) => {
                g.lineStyle(
                    // width
                    8,
                    // color
                    0xff0000,
                    // alpha
                    1,
                )
                g.drawRect(p.x, p.y, p.width, p.height)
            }}
        />
    )
})
