import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { Layer, Rect, Stage, Transformer } from 'react-konva'
import type { ItemExt, Widget, Widget_listExt } from '../Widget'

export const WidgetRegionalUI = observer(function WidgetRegionalUI_<T extends Widget>(p: { req: Widget_listExt<T> }) {
    const req = p.req

    const shapes = req.state.items
    return (
        <Stage
            //
            width={req.state.width}
            height={req.state.height}
            onContextMenu={(e) => {
                e.evt.preventDefault()
                console.log('context menu')
                // get image from stage
                const dataURL = e.target.toDataURL()
                console.log(dataURL)
            }}
        >
            <Layer>
                {/* <Text text='Try to drag a star' /> */}
                {shapes.map((shape) => (
                    <RectangleUI
                        key={`rect-${shape.item.id}`}
                        onChange={(p) => Object.assign(shape, p)}
                        isSelected={shape.isSelected}
                        shape={shape}
                    />
                ))}
                {/* {shapes.map((star) => (
                    <Star
                        key={`star-${star.item.id}`}
                        id={star.item.id}
                        x={star.x}
                        y={star.y}
                        scaleX={star.isDragging ? 1.2 : 1}
                        scaleY={star.isDragging ? 1.2 : 1}
                        rotation={star.rotation}
                        numPoints={5}
                        innerRadius={20}
                        outerRadius={40}
                        fill='#89b717'
                        opacity={0.8}
                        draggable
                        shadowColor='black'
                        shadowBlur={10}
                        shadowOpacity={0.6}
                        shadowOffsetX={star.isDragging ? 10 : 5}
                        shadowOffsetY={star.isDragging ? 10 : 5}
                        onDragStart={(e) => (star.isDragging = true)}
                        onDragEnd={(e) => {
                            star.isDragging = false
                            star.x = e.target.x()
                            star.y = e.target.y()
                        }}
                    />
                ))} */}
            </Layer>
        </Stage>
    )
})

export const RectangleUI = observer(function RectangleUI_(p: {
    //
    shape: ItemExt
    isSelected?: boolean
    onChange: (p: Partial<ItemExt>) => void
}) {
    const shapeRef = React.useRef<any>()
    const trRef = React.useRef<any>()
    React.useEffect(() => {
        if (p.isSelected) {
            // we need to attach transformer manually
            trRef.current.nodes([shapeRef.current])
            trRef.current.getLayer().batchDraw()
        }
    }, [p.isSelected])

    return (
        <React.Fragment>
            <Rect
                onClick={() => {
                    p.shape.isSelected = !p.shape.isSelected
                }}
                ref={shapeRef}
                fill={`${p.shape.fill}ee`}
                x={p.shape.x}
                y={p.shape.y}
                width={p.shape.width}
                height={p.shape.height}
                scaleX={p.shape.scaleX}
                scaleY={p.shape.scaleY}
                rotation={p.shape.rotation}
                draggable
                onDragEnd={(e) => {
                    p.onChange({
                        x: e.target.x(),
                        y: e.target.y(),
                    })
                }}
                onTransformEnd={(e) => {
                    const node = shapeRef.current
                    const scaleX = node.scaleX()
                    const scaleY = node.scaleY()
                    p.onChange({
                        x: node.x(),
                        y: node.y(),
                        scaleX: scaleX,
                        scaleY: scaleY,
                        rotation: node.rotation(),
                    })
                }}
            />
            {p.isSelected && (
                <Transformer
                    ref={trRef}
                    flipEnabled={false}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                            return oldBox
                        }
                        return newBox
                    }}
                />
            )}
        </React.Fragment>
    )
})
