import type { BaseSchema } from '../../model/BaseSchema'
import type { SListExt } from './WidgetListExt'
import type { SimpleShape } from './WidgetListExtTypes'
import type { Shape } from 'konva/lib/Shape'

import { observer, useLocalObservable } from 'mobx-react-lite'
import * as React from 'react'
import { Layer, Rect, Stage, Transformer } from 'react-konva'

import { InputNumberUI } from '../../input-number/InputNumberUI'

export const WidgetListExt_RegionalUI = observer(function WidgetListExt_RegionalUI_<T extends BaseSchema>(p: {
    field: SListExt<any>['$Field']
}) {
    const RG = p.field
    const entries = RG.fields.items.subFields.map((i) => i.fields)
    const uist = useLocalObservable(() => ({ scale: 1 }))
    return (
        <>
            <InputNumberUI
                mode='float'
                min={0}
                max={1}
                value={uist.scale}
                onValueChange={(v) => {
                    uist.scale = v
                }}
            />
            <div
                style={{
                    transform: `scale(${uist.scale})`,
                    width: RG.fields.area.width * uist.scale,
                    height: RG.fields.area.height * uist.scale,
                    transformOrigin: 'top left',
                    display: 'block',
                }}
            >
                <Stage
                    //
                    width={RG.fields.area.width}
                    height={RG.fields.area.height}
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
                        {entries.map(({ shape, value }) => (
                            <RectangleUI
                                key={`rect-${value.id}`}
                                onChange={(p) => {
                                    Object.assign(shape, p)
                                    value.applyValueUpdateEffects()
                                }}
                                isSelected={shape.value.isSelected}
                                shape={shape.value}
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>
        </>
    )
})

export const RectangleUI = observer(function RectangleUI_(p: {
    //
    shape: SimpleShape
    isSelected?: boolean
    onChange: (p: Partial<SimpleShape>) => void
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
                    const node = shapeRef.current as Shape
                    const scaleX = node.scaleX()
                    const scaleY = node.scaleY()
                    node.scaleX(1)
                    node.scaleY(1)
                    const width = Math.max(5, node.width() * scaleX)
                    const height = Math.max(5, node.height() * scaleY)
                    node.width(width)
                    node.height(height)
                    p.onChange({
                        x: node.x(),
                        y: node.y(),
                        width: width,
                        height: height,
                        scaleX: 1,
                        scaleY: 1,
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

//   {/* {shapes.map((star) => (
//         <Star
//             key={`star-${star.item.id}`}
//             id={star.item.id}
//             x={star.x}
//             y={star.y}
//             scaleX={star.isDragging ? 1.2 : 1}
//             scaleY={star.isDragging ? 1.2 : 1}
//             rotation={star.rotation}
//             numPoints={5}
//             innerRadius={20}
//             outerRadius={40}
//             fill='#89b717'
//             opacity={0.8}
//             draggable
//             shadowColor='black'
//             shadowBlur={10}
//             shadowOpacity={0.6}
//             shadowOffsetX={star.isDragging ? 10 : 5}
//             shadowOffsetY={star.isDragging ? 10 : 5}
//             onDragStart={(e) => (star.isDragging = true)}
//             onDragEnd={(e) => {
//                 star.isDragging = false
//                 star.x = e.target.x()
//                 star.y = e.target.y()
//             }}
//         />
//     ))} */}
