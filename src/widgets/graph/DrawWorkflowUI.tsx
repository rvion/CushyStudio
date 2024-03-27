import type { NodePort } from '../../core/ComfyNode'

import { observer } from 'mobx-react-lite'
import { Fragment, useEffect, useRef } from 'react'

import { NodeSlotSize } from './NodeSlotSize'
import { ComfyWorkflowL } from '../../models/ComfyWorkflow'
import { randomColorHSLNice, randomNiceColor } from '../../panels/Panel_Canvas/states/randomColor'
import { ProgressLine } from '../../rsuite/shims'
import { bang } from '../../utils/misc/bang'

export const DrawWorkflowUI = observer(function DrawWorkflowUI_(p: {
    //
    spline?: number
    workflow: ComfyWorkflowL
    offset?: { x: number; y: number }
}) {
    const wflow = p.workflow
    const INportsById = new Map<string, NodePort>()
    const OUTportsById = new Map<string, NodePort>()
    for (const node of wflow.nodes) {
        for (const port of node.incomingPorts) INportsById.set(port.id, port)
        for (const port of node.outgoingPorts) OUTportsById.set(port.id, port)
    }
    const ref = useRef<HTMLDivElement>(null)
    const colorFn = randomColorHSLNice // randomNiceColor
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
    }, [wflow.currentExecutingNode?.uid, p.offset?.x, p.offset?.y])

    return (
        <div tw='relative overflow-auto flex-1 h-full w-full' ref={ref}>
            {wflow.nodes.map((node) => {
                if (node == null) return
                const pgr = node.progressReport

                return (
                    <Fragment key={node.uid}>
                        {/* INCOMING EDGES */}
                        {node._incomingEdges().map((e, ix) => {
                            const start = OUTportsById.get(`${e.from}#${e.fromSlotIx}`)!
                            const end = INportsById.get(`${node.uid}<-${e.from}#${e.fromSlotIx}`)!
                            const dx2 = (end.x - start.x) / (p.spline ?? 1)
                            let pathBasic = `M ${start.x} ${start.y} C`
                            pathBasic += ` ${start.x + dx2} ${start.y}`
                            pathBasic += ` ${end.x - dx2} ${end.y}`
                            pathBasic += ` ${end.x} ${end.y}`
                            const path = pathBasic //path2WithCubicBezier
                            const color = colorFn(start.type)
                            const stroke = color
                            return (
                                <svg //
                                    key={ix}
                                    style={{ position: 'absolute', top: 0, left: 0, zIndex: 99 }}
                                    width={wflow.width ?? '100%'}
                                    height={wflow.height ?? '100%'}
                                >
                                    <path d={path} stroke={stroke} strokeWidth='4' fill='none' />
                                </svg>
                            )
                        })}

                        {/* PORTS IN  */}
                        {node.incomingPorts?.map((p) => {
                            const color = colorFn(p.type)
                            return (
                                <div
                                    tw='absolute'
                                    key={p.id}
                                    style={{
                                        // borderRadius: '50%',
                                        zIndex: 995,
                                        border: '1px solid gray',
                                        borderRadius: '50%',
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
                        {node.outgoingPorts?.map((p) => {
                            const color = colorFn(p.type)
                            return (
                                <div
                                    key={p.id}
                                    tw='absolute'
                                    style={{
                                        border: '1px solid gray',
                                        borderRadius: '50%',
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
                        {/* ACTUAL NODE */}
                        <div
                            className='node bg-base-200 rounded'
                            key={node.uid}
                            style={{
                                border: '1px solid #4c4c4c',
                                zIndex: 991,
                                fontWeight: '20px',
                                lineHeight: '20px',
                                position: 'absolute',
                                top: bang(node.y),
                                left: bang(node.x),
                                width: bang(node.width),
                                height: bang(node.height),
                            }}
                        >
                            <ProgressLine
                                tw='absolute -top-2 !p-0'
                                status={pgr?.isDone ? 'success' : 'active'}
                                percent={pgr?.percent}
                            />

                            <div
                                style={{ height: '20px' }}
                                tw='bg-primary/20 overflow-hidden whitespace-nowrap overflow-ellipsis'
                            >
                                {node.$schema.nameInComfy} [{node.uid}]
                            </div>
                            <div tw='text-sm px-2'>
                                <div tw='flex justify-between' /* style={{ borderBottom: '1px solid gray' }} */>
                                    <div>
                                        {node._incomingEdges().map((ie) => (
                                            <div tw='truncate overflow-hidden' style={{ height: '20px' }} key={ie.inputName}>
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
                                </div>
                                {node._primitives().map((ie) => (
                                    <div //
                                        key={ie.inputName}
                                        style={{ height: '20px' }}
                                        tw='overflow-hidden whitespace-nowrap overflow-ellipsis'
                                    >
                                        <div tw='flex'>
                                            <div>{ie.inputName}:</div>
                                            <div tw='ml-auto'>{JSON.stringify(ie.value)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Fragment>
                )
            })}
        </div>
    )
})
