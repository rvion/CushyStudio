import type { SimpleShape$ } from '../../../../csuite/fields/core-prefabs/ShapeSchema'
import type { Field_image } from '../../../../csuite/fields/image/FieldImage'
import type { UnifiedImage } from '../../states/UnifiedImage'
import type { DisplayObject, FederatedPointerEvent } from 'pixi.js'

import { Sprite, Text } from '@pixi/react'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

type InteractionData = FederatedPointerEvent
interface Draggable extends DisplayObject {
    data?: InteractionData | null
    dragging: boolean
}

interface PixiEvent {
    currentTarget: Draggable
    data: InteractionData
}

class XXX {
    constructor(
        //
        public i: Field_image,
        public placement: SimpleShape$['$Field'],
    ) {
        makeAutoObservable(this)
    }
    onDragStart = (event: PixiEvent): void => {
        const sprite = event.currentTarget as Draggable
        // console.log(`[🤠] sprite`, sprite)
        sprite.alpha = 0.5
        sprite.data = event.data
        sprite.dragging = true
    }

    onDragEnd = (event: PixiEvent): void => {
        const sprite = event.currentTarget as Draggable
        sprite.alpha = 1
        sprite.dragging = false
        sprite.data = null
    }

    onDragMove = (event: PixiEvent): void => {
        const sprite = event.currentTarget as Draggable
        if (sprite.dragging) {
            // console.log(`[🤠] sprite.data`, sprite.data)
            const newPosition = sprite.data!.getLocalPosition(sprite.parent)
            sprite.x = newPosition.x
            sprite.y = newPosition.y
            this.placement.runInValueTransaction(() => {
                this.placement.X.value = newPosition.x
                this.placement.Y.value = newPosition.y
            })
        }
    }
}

type DraggableSpriteProps = {
    placement: SimpleShape$['$Field']
    image: Field_image
}

export const DragableSpritePixi = observer(function DraggableSpriteUI_(p: DraggableSpriteProps) {
    const i = p.image
    const xxx = useMemo(() => new XXX(p.image, p.placement), [i])
    return (
        <>
            <Sprite //
                interactive
                width={100}
                height={100}
                key={i.value.id}
                anchor={0.5}
                // onDragStart={onDragStart}
                pointerdown={xxx.onDragStart}
                pointerup={xxx.onDragEnd}
                pointerupoutside={xxx.onDragEnd}
                pointermove={xxx.onDragMove}
                image={i.value.urlForSize(320)}
                x={xxx.placement.X.value}
                y={xxx.placement.Y.value}
            />
            <Text text={xxx.placement.X.value.toString()} x={50} y={50} />
        </>
    )
})
