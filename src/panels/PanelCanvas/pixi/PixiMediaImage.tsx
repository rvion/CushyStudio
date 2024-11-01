import type { SimpleShape$ } from '../../../csuite/fields/core-prefabs/ShapeSchema'
import type { MediaImageL } from '../../../models/MediaImage'
import type { UnifiedCanvas } from '../states/UnifiedCanvas'
import type { Layer$ } from '../stateV2/Layer$'

import { extend, useAsset } from '@pixi/react'
// import { Sprite, Text } from '@pixi/react/lib/components'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { type Container, type FederatedEventHandler, type FederatedPointerEvent, Sprite } from 'pixi.js'
import { useMemo } from 'react'

import { useUnifiedCanvas } from '../states/UnifiedCanvasCtx'

type InteractionData = FederatedPointerEvent
interface Draggable extends Container {
   data?: InteractionData | null
   dragging: boolean
}

interface PixiEvent {
   currentTarget: Draggable
   data: InteractionData
}

let currentlyDragged: {
   self: XXX
   startXInImage: number
   startYInImage: number
   startXInWorld: number
   startYInWorld: number
} | null = null

class XXX {
   constructor(
      public i: MediaImageL,
      public placement: SimpleShape$['$Field'],
      public uc: UnifiedCanvas,
   ) {
      makeAutoObservable(this)
   }
   get xInWorld(): number {
      return this.placement.X.value
   }

   /** y position relative the the whole view origin */
   get yInWorld(): number {
      return this.placement.Y.value
   }

   onDragStart: FederatedEventHandler<FederatedPointerEvent> = (event: FederatedPointerEvent): void => {
      if (event.button !== 0) return
      // console.log(`[💩] button is`, event.button, event.buttons)
      // eslint-disable-next-line consistent-this
      currentlyDragged = {
         self: this,
         startXInWorld: this.xInWorld,
         startYInWorld: this.yInWorld,
         startXInImage: this.uc.cursor.xInWorld - this.xInWorld,
         startYInImage: this.uc.cursor.yInWorld - this.yInWorld,
      }
      // console.log(`[💩] startXInWorld: `, this.xInWorld)
      // console.log(`[💩] startYInWorld: `, this.yInWorld)
      // console.log(`[💩] startXInImage: `, this.uc.cursor.xInWorld - this.xInWorld)
      // console.log(`[💩] startYInImage: `, this.uc.cursor.yInWorld - this.yInWorld)

      // const sprite = event.currentTarget as Draggable
      // // console.log(`[🤠] sprite`, sprite)
      // sprite.alpha = 0.5
      // sprite.data = event.data
      // sprite.dragging = true
   }

   onDragEnd: FederatedEventHandler<FederatedPointerEvent> = (event: FederatedPointerEvent): void => {
      if (currentlyDragged == null) return
      if (currentlyDragged.self !== this) return
      currentlyDragged = null
      // const sprite = event.currentTarget as Draggable
      // sprite.alpha = 1
      // sprite.dragging = false
      // sprite.data = null
   }

   onDragMove: FederatedEventHandler<FederatedPointerEvent> = (event: FederatedPointerEvent): void => {
      if (currentlyDragged == null) return
      if (currentlyDragged.self !== this) return

      const sprite = event.currentTarget as Draggable
      const nextXInWorld = this.uc.cursor.xInWorld - currentlyDragged.startXInImage
      const nextYInWorld = this.uc.cursor.yInWorld - currentlyDragged.startYInImage

      // Respect snap to grid global nullable value
      const snapToGrid = this.uc.snapToGrid ? this.uc.snapSize : null
      const snappedX = snapToGrid ? Math.round(nextXInWorld / snapToGrid) * snapToGrid : nextXInWorld
      const snappedY = snapToGrid ? Math.round(nextYInWorld / snapToGrid) * snapToGrid : nextYInWorld

      this.placement.runInValueTransaction(() => {
         this.placement.X.value = snappedX
         this.placement.Y.value = snappedY
      })
   }
}

type DraggableSpriteProps = {
   placement: SimpleShape$['$Field']
   mediaImage: MediaImageL
   layer?: Layer$['$Field']
   onClick?: () => void
   alpha?: number
}

extend({ Sprite })

export const PixiMediaImage = observer(function DraggableSpriteUI_(p: DraggableSpriteProps) {
   const mediaImage = p.mediaImage
   const uc = useUnifiedCanvas()
   const xxx = useMemo(() => new XXX(p.mediaImage, p.placement, uc), [mediaImage])
   // const res = useAssets([mediaImage.relPath], { maxRetries: 3 })
   // const res0 = res.assets[0]
   // console.log(`[🔴] `, res0)
   // return null
   const asset = useAsset(mediaImage.relPath)
   if (asset == null) return null
   return (
      <>
         <pixiSprite //
            interactive
            width={p.placement.Width.value || mediaImage.width}
            height={p.placement.Height.value || mediaImage.height}
            alpha={p.alpha}
            key={mediaImage.id}
            onClick={p.onClick}
            // anchor={0.5}
            onPointerDown={xxx.onDragStart}
            onPointerUp={xxx.onDragEnd}
            onPointerUpOutside={xxx.onDragEnd}
            onPointerMove={xxx.onDragMove}
            x={xxx.placement.X.value}
            y={xxx.placement.Y.value}
            texture={asset}
         />

         {/* <pixiText //
            text={xxx.placement.X.value.toString()}
            x={xxx.placement.X.value}
            y={xxx.placement.Y.value - 100}
         />
         <pixiText //
            text={uc.viewportInfos.x.toString()}
            x={xxx.placement.X.value}
            y={xxx.placement.Y.value - 50}
         /> */}
      </>
   )
})
