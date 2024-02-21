import type { Widget } from 'src/controls/Widget'
import type { Widget_listExt } from './WidgetListExt'
import type { BoardPosition } from './WidgetListExtTypes'

import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { MessageErrorUI } from 'src/panels/MessageUI'
import type { Unmounted } from 'src/controls/Prop'
// import { Layer, Rect, Stage, Transformer } from 'react-konva'

export const WidgetListExt_RegionalUI = observer(function WidgetListExt_RegionalUI_<T extends Widget>(p: {
    widget: Widget_listExt<Unmounted>
}) {
    const widget = p.widget

    const entries = widget.entries
    return (
        <>
            <MessageErrorUI>Sorry; Widget Area where you can drag stuff is commented-out for now</MessageErrorUI>
        </>
    )
    // return (
    //     <Stage
    //         //
    //         width={widget.serial.width}
    //         height={widget.serial.height}
    //         onContextMenu={(e) => {
    //             e.evt.preventDefault()
    //             console.log('context menu')
    //             // get image from stage
    //             const dataURL = e.target.toDataURL()
    //             console.log(dataURL)
    //         }}
    //     >
    //         <Layer>
    //             {/* <Text text='Try to drag a star' /> */}
    //             {entries.map(({ position, widget }) => (
    //                 <RectangleUI
    //                     key={`rect-${widget.id}`}
    //                     onChange={(p) => Object.assign(position, p)}
    //                     isSelected={position.isSelected}
    //                     shape={position}
    //                 />
    //             ))}
    //         </Layer>
    //     </Stage>
    // )
})

export const RectangleUI = observer(function RectangleUI_(p: {
    //
    shape: BoardPosition
    isSelected?: boolean
    onChange: (p: Partial<BoardPosition>) => void
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

    return null
    // return (
    //     <React.Fragment>
    //         <Rect
    //             onClick={() => {
    //                 p.shape.isSelected = !p.shape.isSelected
    //             }}
    //             ref={shapeRef}
    //             fill={`${p.shape.fill}ee`}
    //             x={p.shape.x}
    //             y={p.shape.y}
    //             width={p.shape.width}
    //             height={p.shape.height}
    //             scaleX={p.shape.scaleX}
    //             scaleY={p.shape.scaleY}
    //             rotation={p.shape.rotation}
    //             draggable
    //             onDragEnd={(e) => {
    //                 p.onChange({
    //                     x: e.target.x(),
    //                     y: e.target.y(),
    //                 })
    //             }}
    //             onTransformEnd={(e) => {
    //                 const node = shapeRef.current
    //                 const scaleX = node.scaleX()
    //                 const scaleY = node.scaleY()
    //                 p.onChange({
    //                     x: node.x(),
    //                     y: node.y(),
    //                     scaleX: scaleX,
    //                     scaleY: scaleY,
    //                     rotation: node.rotation(),
    //                 })
    //             }}
    //         />
    //         {p.isSelected && (
    //             <Transformer
    //                 ref={trRef}
    //                 flipEnabled={false}
    //                 boundBoxFunc={(oldBox, newBox) => {
    //                     // limit resize
    //                     if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
    //                         return oldBox
    //                     }
    //                     return newBox
    //                 }}
    //             />
    //         )}
    //     </React.Fragment>
    // )
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
