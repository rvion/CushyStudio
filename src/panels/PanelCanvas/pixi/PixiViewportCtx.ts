// import type { PixiViewportProps } from './PixiViewport3'
// import type { Viewport } from 'pixi-viewport'

// import { makeAutoObservable } from 'mobx'
// import React from 'react'

// export const ViewportCtx = React.createContext<ViewportWrapper | null>(null)

// export const useViewport = (): ViewportWrapper => {
//     const res = React.useContext(ViewportCtx)
//     if (res == null) throw new Error('useViewport: no value')
//     return res
// }

// export class ViewportWrapper {
//     x: number = 0
//     y: number = 0
//     width: number = 100
//     height: number = 100
//     scaleX: number = 1
//     scaleY: number = 1

//     setupEvents = (): void => {
//         this.viewport
//             .drag({
//                 mouseButtons: 'right',
//             })
//             // .pinch()
//             .wheel()
//             // .decelerate()
//             .clampZoom({
//                 minScale: this.props.minScale,
//                 maxScale: this.props.maxScale,
//                 maxHeight: this.props.maxHeight,
//                 maxWidth: this.props.maxWidth,
//                 minHeight: this.props.minHeight,
//                 minWidth: this.props.minWidth,
//             })
//     }

//     constructor(
//         //
//         public viewport: Viewport,
//         public props: PixiViewportProps,
//     ) {
//         this.setupEvents()
//         this.updateVars(viewport)
//         makeAutoObservable(this, { viewport: false })

//         // Listen for x/y position changes
//         viewport.on('moved', (data: { viewport: Viewport }) => {
//             console.log(`Viewport moved: x=${data.viewport.x}, y=${data.viewport.y}, width=${data.viewport.width}`)
//             this.updateVars(data.viewport)
//         })

//         // Listen for scale changes
//         viewport.on('zoomed', (data: { viewport: Viewport }) => {
//             console.log(`Viewport zoomed: scale=${data.viewport.scale.x}, y-scale=${data.viewport.scale.y}`)
//             this.updateVars(data.viewport)
//         })

//         // listen for mouse movement
//         viewport.on('mouse-move', (data: { viewport: Viewport }) => {
//             console.log(`Viewport mouse-move: x=${data.viewport.screenWorldWidth}, y=${data.viewport.screenWorldHeight}`)
//             this.updateVars(data.viewport)
//         })

//         // Listen for any change (move, zoom, pinch, etc.)
//         // viewport.on('updated', (data) => {
//         //     console.log('Viewport updated', data)
//         // })
//     }

//     updateVars(vp: Viewport): void {
//         this.x = vp.x
//         this.y = vp.y
//         this.width = vp.width
//         this.height = vp.height
//         this.scaleX = vp.scale.x
//         this.scaleY = vp.scale.y
//     }
// }
