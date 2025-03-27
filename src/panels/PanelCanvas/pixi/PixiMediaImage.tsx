import type { SimpleShape$ } from '../../../csuite/fields/core-prefabs/ShapeSchema'
import type { MediaImageL } from '../../../models/MediaImage'
import type { UnifiedCanvas } from '../states/UnifiedCanvas'
import type { Layer$ } from '../stateV2/Layer$'

import { extend } from '@pixi/react'
// import { Sprite, Text } from '@pixi/react/lib/components'
import { makeAutoObservable } from 'mobx'

import {
   Assets,
   type Container,
   type FederatedEventHandler,
   type FederatedPointerEvent,
   Sprite,
   Texture,
   type TextureSource,
} from 'pixi.js'
import { useEffect, useMemo, useState } from 'react'

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
      public placement: SimpleShape$['ҨField'],
      public uc: UnifiedCanvas,
   ) {
      makeAutoObservable(this)
   }
   get xInWorld(): number {
      return this.placement.x.zValue
   }

   /** y position relative the the whole view origin */
   get yInWorld(): number {
      return this.placement.y.zValue
   }

   onDragStart: FederatedEventHandler<FederatedPointerEvent> = (event: FederatedPointerEvent): void => {
      if (event.button !== 0) return
      // console.log(`[💩] button is`, event.button, event.buttons)
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
      const snappedX = snapToGrid != null ? Math.round(nextXInWorld / snapToGrid) * snapToGrid : nextXInWorld
      const snappedY = snapToGrid != null ? Math.round(nextYInWorld / snapToGrid) * snapToGrid : nextYInWorld

      this.placement.zRunInTransaction(() => {
         this.placement.x.zValue = snappedX
         this.placement.y.zValue = snappedY
      })
   }
}

type DraggableSpriteProps = {
   placement: SimpleShape$['ҨField']
   mediaImage: MediaImageL
   layer?: Layer$['ҨField']
   onClick?: () => void
   alpha?: number
}

extend({ Sprite })

const useAsset = (relPath: string = 'https://pixijs.com/assets/bunny.png'): Texture<TextureSource<any>> => {
   const [texture, setTexture] = useState(Texture.EMPTY)
   useEffect(() => {
      void Assets.load(relPath).then((result) => void setTexture(result))
   })
   return texture
}

export const PixiMediaImage = obs(function DraggableSpriteUI_(p: DraggableSpriteProps) {
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
            width={p.placement.width.zValue || mediaImage.width}
            height={p.placement.height.zValue || mediaImage.height}
            alpha={p.alpha}
            key={mediaImage.id}
            onClick={p.onClick}
            // anchor={0.5}
            onPointerDown={xxx.onDragStart}
            onPointerUp={xxx.onDragEnd}
            onPointerUpOutside={xxx.onDragEnd}
            onPointerMove={xxx.onDragMove}
            x={xxx.placement.x.zValue}
            y={xxx.placement.y.zValue}
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
