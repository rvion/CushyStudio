import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import * as React from 'react'

import { useUnifiedCanvas } from './UnifiedCanvasCtx'

export const GridTilingUI = observer(function GridTilingUI_(p: {}) {
    const infos = useUnifiedCanvas().infos
    const scale = infos.scale * 1024

    return (
        <div
            key={nanoid()}
            style={{
                position: 'absolute',
                zIndex: 0,
                inset: 0,
                // width: '100%',
                // height: '100%',
                flex: 1,
                // an tiled image that repeats both horizontally and vertically forever
                // backgroundImage: 'url(/public/illustrations/gridtile.png)',
                backgroundImage: 'url(/public/illustrations/image_home_transp.webp)',
                backgroundSize: `${scale}px ${scale}px`,
                backgroundRepeat: 'repeat',
                // disable smart upscale
                imageRendering: 'pixelated',
                // offset the image to match the pointer
                backgroundPositionX: infos.canvasX,
                backgroundPositionY: infos.canvasY,
            }}
        ></div>
    )
})

// const mkTiledImage = () => {
//     const canvas = document.createElement('canvas')
//     const ctx = canvas.getContext('2d')
//     if (ctx == null) throw new Error('ctx is null')
//     const scale = 1024
//     canvas.width = scale
//     canvas.height = scale
//     ctx.fillStyle = 'red'
//     ctx.setP
//     return canvas.toDataURL()
// }
