import type { Viewport } from 'pixi-viewport'

import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'

import { useUnifiedCanvas } from '../../states/UnifiedCanvasCtx'
import { PixiViewport } from './PixiViewport'

export const PixiUCViewport = observer(function PixiUCViewport_(p: { children: React.ReactNode[] }) {
    const uc1 = useUnifiedCanvas()
    return (
        <PixiViewport // zoom/pan/pinch/scroll area
            worldWidth={10000}
            worldWeight={10000}
            onSetup={(viewport) => {
                uc1.viewportInstance = viewport
                viewport.on('moved', (data: { viewport: Viewport }) => {
                    // console.log( `Viewport moved: x=${data.viewport.x}, y=${data.viewport.y}, width=${data.viewport.width}`, ) // prettier-ignore
                    uc1.updateViewportInfos(data.viewport)
                })
                // Listen for scale changes
                viewport.on('zoomed', (data: { viewport: Viewport }) => {
                    uc1.updateViewportInfos(data.viewport)
                })
                viewport.on('mousemove', (e) => {
                    runInAction(() => {
                        uc1.cursor.xInScreen = e.screenX
                        uc1.cursor.yInScreen = e.screenY
                        const worldPos = viewport.toWorld(e.screenX, e.screenY)
                        uc1.cursor.xInWorld = worldPos.x
                        uc1.cursor.yInWorld = worldPos.y
                    })
                })
                viewport //
                    .drag({ mouseButtons: 'right' })
                    .wheel()
                    .clampZoom({ minScale: 0.1, maxScale: 20 })
                // .pinch()
                // .decelerate()
            }}
        >
            {p.children}
        </PixiViewport>
    )
})
