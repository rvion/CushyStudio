import type { ComfyNode, NodePort } from '../../comfyui/livegraph/ComfyNode'
import type { ComfyWorkflowL } from '../../models/ComfyWorkflow'

import { observer } from 'mobx-react-lite'
import { Fragment, useEffect, useRef, useState } from 'react'

import { SpacerUI } from '../../csuite/components/SpacerUI'
import { Frame } from '../../csuite/frame/Frame'
import { hashStringToNumber } from '../../csuite/hashUtils/hash'
import { InputStringUI } from '../../csuite/input-string/InputStringUI'
import { LegacyProgressLineUI } from '../../csuite/inputs/LegacyProgressLineUI'
import { bang } from '../../csuite/utils/bang'
import { useEffectAction } from '../../csuite/utils/useEffectAction'
import { useMemoAction } from '../../csuite/utils/useMemoAction'
import { randomColorHSLNice } from '../../panels/PanelCanvas/utils/randomColor'
import { NodeSlotSize } from './NodeSlotSize'

let dragging = false
type ViewRect = { x: number; y: number; width: number; height: number }
type CachedNodeData = {
   node: ComfyNode<any, {}>
   /* Stored as an svg formatted path, recalculate if the node is "dirty", which should happen if the node is transformed. */
   spline: string
   color: string
}
const splineCache: Map<string, CachedNodeData> = new Map<string, CachedNodeData>()

const aabb = (
   a: { x: number; y: number; x2: number; y2: number },
   b: { x: number; y: number; x2: number; y2: number },
): boolean => {
   return a.x < b.x2 && a.x2 > b.x && a.y < b.y2 && a.y2 > b.y
}

const overdrawPadding = 10

export const DrawNodeGraphUI = observer(function DrawNodeGraphUI_(p: {
   //
   spline?: number
   workflow: ComfyWorkflowL
   offset?: { x: number; y: number }
}) {
   const active = null
   const wflow = p.workflow
   const INportsById = new Map<string, NodePort>()
   const OUTportsById = new Map<string, NodePort>()
   for (const node of wflow.nodes) {
      for (const port of node.incomingPorts) INportsById.set(port.id, port)
      for (const port of node.outgoingPorts) OUTportsById.set(port.id, port)
   }
   const ref = useRef<HTMLDivElement>(null)

   //    const update = (): void => void wflow.RUNLAYOUT(cushy.autolayoutOpts)
   //    useEffect(update, [JSON.stringify(cushy.autolayoutOpts), wflow.id])
   const theme = cushy.preferences.theme.value

   useEffect(() => {
      if (ref.current == null) return

      if (p.offset) {
         // console.log(`[🤠] `, { left: p.offset.x, top: p.offset.y })
         ref.current.scrollTo({
            left: p.offset.x,
            top: p.offset.y,
            behavior: 'instant',
         })
         return
      }

      ref.current.scrollTo({
         left: wflow.currentExecutingNode?.x,
         top: wflow.currentExecutingNode?.y,
         behavior: 'smooth',
      })
   }, [
      wflow.currentExecutingNode?.uid,
      p.offset?.x,
      p.offset?.y,
      ref.current?.clientWidth,
      ref.current?.clientHeight,
   ])

   const [viewRect, setViewRect] = useState<ViewRect>({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
   })
   const updateViewport = (): void => {
      if (ref.current) {
         setViewRect({
            x: ref.current.clientLeft,
            y: ref.current.clientTop,
            width: ref.current?.clientWidth,
            height: ref.current?.clientHeight,
         })
      }
      wflow.nodes.map((node) => {
         node.tagDirty(true)
      })
   }
   useEffect(() => {
      if (!ref.current) {
         return
      }

      const observer = new ResizeObserver((entries) => {
         updateViewport()
      })

      observer.observe(ref.current)

      return (): void => observer.disconnect()
   }, [])

   return (
      <>
         <div>
            <span>{viewRect.width}</span>
            <UY.Misc.Button
               hover
               onClick={() => {
                  wflow.nodes.map((node) => {
                     node.selected = false
                  })
               }}
            >
               WOW
            </UY.Misc.Button>
         </div>

         <Frame
            base={{ contrast: -0.15 }}
            tw='relative h-full w-full flex-1 select-none overflow-clip text-sm'
            ref={ref}
         >
            <svg //
               // key={ix}
               tw='h-full w-full'
               style={{ position: 'absolute', top: 0, left: 0, zIndex: 99 }}
               //    width={wflow.width ?? '100%'}
               //    height={wflow.height ?? '100%'}
            >
               {wflow.nodes.map((node) => {
                  return node._incomingEdges().map((e, ix) => {
                     const start = OUTportsById.get(`${e.from}#${e.fromSlotIx}`)!
                     const end = INportsById.get(`${node.uid}<-${e.from}#${e.fromSlotIx}`)!

                     // Cull splines that aren't visible
                     if (
                        ref &&
                        ref.current &&
                        !aabb(
                           {
                              x: start.x > end.x ? end.x : start.x,
                              y: start.y > end.y ? end.y : start.y,
                              x2: start.x > end.x ? start.x : end.x,
                              y2: start.y > end.y ? start.y : end.y,
                           },
                           {
                              x: viewRect.x - overdrawPadding,
                              y: viewRect.y - overdrawPadding,
                              x2: viewRect.x + viewRect.width + overdrawPadding * 2,
                              y2: viewRect.y + viewRect.height + overdrawPadding * 2,
                           },
                        )
                     ) {
                        return
                     }

                     const cachedSpline = splineCache.get(node.uid)
                     // TODO(bird_d/preferences/interface): Spline handle distance
                     const handlePadding = 25
                     let splineString = null
                     let splineColor = null
                     const isOneSelected =
                        (start.fromNode && start.fromNode.selected) ||
                        (start.toNode && start.toNode.selected) ||
                        (end.fromNode && end.fromNode.selected) ||
                        (end.toNode && end.toNode.selected)

                     if (
                        !cachedSpline ||
                        (start.fromNode && (start.fromNode.isDirty || start.fromNode.isDirty)) ||
                        (end.toNode && (end.toNode.isDirty || end.toNode.selected))
                     ) {
                        // Reverse handle direction when start is greater than the end so we can clearly see the noodles in more scenarios
                        const dx2 =
                           (start.x > end.x
                              ? start.x - end.x + handlePadding
                              : end.x - start.x + handlePadding) / (p.spline ?? 2.5)
                        splineString = `M ${start.x} ${start.y} C`
                        splineString += ` ${start.x + dx2} ${start.y}`
                        splineString += ` ${end.x - dx2} ${end.y}`
                        splineString += ` ${end.x} ${end.y}`
                        splineColor = colorFn(start.type)
                        // splineColor = `oklch(0.5 0.25 ${node.x})`

                        splineCache.set(start.id, {
                           node: node,
                           spline: splineString,
                           color: splineColor,
                        })

                        if (start.fromNode && start.toNode && end.fromNode && end.toNode) {
                           start.fromNode.tagDirty(false)
                           start.toNode.tagDirty(false)
                           end.fromNode.tagDirty(false)
                           end.toNode.tagDirty(false)
                        }
                     } else {
                        splineString = cachedSpline.spline
                        splineColor = cachedSpline.color
                     }
                     const path = splineString //path2WithCubicBezier
                     const stroke = isOneSelected ? 'white' : splineColor
                     // TODO(bird_d/preferences/interface): Graph stroke width option
                     return <path d={path} stroke={stroke} strokeWidth='2' fill='none' />
                  })
               })}
            </svg>
            <Frame /* Shadow container, so blur is applied once */
               tw='relative h-full w-full flex-1 select-none !bg-transparent'
               dropShadow={{ x: 0, y: 3, color: 'black', blur: 5, opacity: 0.5 }}
               style={{ zIndex: 100 }}
            >
               {wflow.nodes.map((node) => {
                  return <NodeUI workflow={wflow} node={node} viewRect={viewRect} />
               })}
            </Frame>
         </Frame>
      </>
   )
})

const getChroma = (type: string): number => {
   return hashStringToNumber(type) % 360
}

const colorFn = randomColorHSLNice // randomNiceColor

export const NodeUI = observer(function NodeUI_(p: {
   workflow: ComfyWorkflowL
   node: ComfyNode<any, {}>
   viewRect: ViewRect
}) {
   const node = p.node
   const wflow = p.workflow
   const viewRect = p.viewRect

   if (node == null) return
   const pgr = node.progressReport

   // XXX(bird_d): Should be removed when frame is faster/proper react handling
   node.visible = aabb(
      { x: node.x, y: node.y, x2: node.x + node.width, y2: node.y + node.height },
      {
         x: viewRect.x - overdrawPadding,
         y: viewRect.y - overdrawPadding,
         x2: viewRect.x + viewRect.width + overdrawPadding * 2,
         y2: viewRect.y + viewRect.height + overdrawPadding * 2,
      },
   )

   const theme = cushy.preferences.theme.value

   return (
      <Fragment key={node.uid}>
         {/* PORTS IN  */}
         {node.visible &&
            node.incomingPorts?.map((p) => {
               const color = colorFn(p.type)
               return (
                  <Frame
                     tw='absolute !border-2'
                     key={p.id}
                     border={{ contrast: -1 }}
                     roundness={'100%'}
                     style={{
                        // borderRadius: '50%',
                        zIndex: 995,
                        top: p.y - NodeSlotSize / 2,
                        left: p.x - NodeSlotSize / 2,
                        background: color,
                        width: `${NodeSlotSize}px`,
                        height: `${NodeSlotSize}px`,
                     }}
                  />
               )
            })}

         {/* PORTS OUT */}
         {node.visible &&
            node.outgoingPorts?.map((p) => {
               const color = colorFn(p.type)
               return (
                  <Frame
                     tw='absolute !border-2'
                     key={p.id}
                     border={{ contrast: -1 }}
                     roundness={'100%'}
                     style={{
                        zIndex: 995,
                        top: p.y - NodeSlotSize / 2,
                        left: p.x - NodeSlotSize / 2,
                        background: color,
                        width: `${NodeSlotSize}px`,
                        height: `${NodeSlotSize}px`,
                     }}
                  />
               )
            })}

         {node.visible && node.$schema.pythonModule != 'nodes' && (
            <Frame
               tw='absolute z-[99] -translate-y-[1.8rem] truncate !rounded-b-none p-1 text-xs'
               base={{ contrast: -0.2 }}
               border={{ contrast: -0.2 }}
               roundness={theme.global.roundness}
               tooltip={node.$schema.pythonModule}
               style={{
                  top: bang(node.y),
                  left: bang(node.x),
                  maxWidth: bang(node.width),
                  height: bang(node.height) + cushy.preferences.interface.value.widgetHeight * 10,
               }}
            >
               {node.$schema.pythonModule.split('.').pop()}
               {/* {node.$schema.pythonModule} */}
            </Frame>
         )}

         {/* ACTUAL NODE */}
         {node.visible && (
            <Frame
               base={{ contrast: 0.05, chromaBlend: 0.2 }}
               tw='node flex flex-col overflow-clip '
               //  hover
               border={{ contrast: node.selected ? 1 : -0.2 }}
               key={node.uid}
               roundness={theme.global.roundness}
               //    dropShadow={{ x: 0, y: 3, color: 'black', blur: 5, opacity: 0.5 }}
               onMouseDown={(ev) => {
                  if (ev.button == 0) {
                     //    node.x += 20
                     if (ev.shiftKey) {
                        node.selected = false
                        return
                     }
                     node.selected = true
                     const moveNode = (ev: MouseEvent): void => {
                        wflow.nodes.map((node) => {
                           if (dragging && node.selected) {
                              //
                              node.x += ev.movementX
                              node.y += ev.movementY
                           }
                        })
                     }

                     const stopMoveNode = (ev: MouseEvent): void => {
                        document.removeEventListener('mousemove', moveNode, false)
                        document.removeEventListener('mouseup', stopMoveNode, false)
                     }
                     document.addEventListener('mousemove', moveNode, false)
                     document.addEventListener('mouseup', stopMoveNode, false)
                     dragging = true
                  }
               }}
               style={{
                  zIndex: 991,
                  fontWeight: '20px',
                  lineHeight: '20px',
                  position: 'absolute',
                  top: bang(node.y),
                  left: bang(node.x),
                  width: bang(node.width),
                  height: bang(node.height) + cushy.preferences.interface.value.widgetHeight * 10,
               }}
            >
               {/* <LegacyProgressLineUI
          tw='absolute -top-0 !p-0'
          status={pgr?.isDone ? 'success' : 'active'}
          percent={pgr?.percent}
       /> */}

               <Frame
                  // base={6}
                  style={{ height: '20px' }}
                  tw='flex overflow-ellipsis whitespace-nowrap px-1'
                  base={{ contrast: -0.1, hue: 0 }}
               >
                  <span>{node.$schema.nameInComfy}</span>
                  <SpacerUI />
                  <span>[{node.uid}]</span>
               </Frame>
               <div tw='text-sm'>
                  <Frame
                     tw='flex flex-1 justify-between px-2' /* style={{ borderBottom: '1px solid gray' }} */
                  >
                     <div>
                        {node._incomingEdges().map((ie) => (
                           <div tw='overflow-hidden truncate' style={{ height: '20px' }} key={ie.inputName}>
                              {ie.inputName} {/* {'<-'} [{ie.from}] */}
                           </div>
                        ))}
                     </div>
                     <div tw='overflow-hidden'>
                        {node.$outputs.map((ie) => (
                           <div tw='truncate' style={{ height: '20px' }} key={ie.slotIx}>
                              {(ie.type as string).toLowerCase()}
                           </div>
                        ))}
                     </div>
                  </Frame>
                  {node._primitives().map((ie, ix) => {
                     const input = node.$schema.inputs[ix]
                     if (input) {
                        switch (input.typeName) {
                           case 'STRING':
                              if (typeof ie.value != 'string') {
                                 return
                              }
                              return input.isPrimitive ? (
                                 <InputStringUI
                                    getValue={() => ie.value}
                                    setValue={(val) => {
                                       ie.value = val
                                    }}
                                 />
                              ) : (
                                 <span>NOT PRIMITIVE</span>
                              )
                        }
                     }
                     return (
                        <Frame //
                           key={ie.inputName}
                           style={{ height: '20px' }}
                           tw='overflow-hidden overflow-ellipsis whitespace-nowrap px-2'
                        >
                           <div tw='flex'>
                              <div>{ie.inputName}:</div>
                              <div tw='ml-auto truncate'>{JSON.stringify(ie.value)}</div>
                           </div>
                        </Frame>
                     )
                  })}
               </div>
            </Frame>
         )}
      </Fragment>
   )
})
