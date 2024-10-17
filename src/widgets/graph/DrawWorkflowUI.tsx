import type { NodePort } from '../../core/ComfyNode'
import type { ComfyWorkflowL } from '../../models/ComfyWorkflow'

import { observer } from 'mobx-react-lite'
import { Fragment, useEffect, useRef } from 'react'

import { Frame } from '../../csuite/frame/Frame'
import { hashStringToNumber } from '../../csuite/hashUtils/hash'
import { ProgressLine } from '../../csuite/inputs/shims'
import { bang } from '../../csuite/utils/bang'
import { randomColorHSLNice } from '../../panels/PanelCanvas/utils/randomColor'
import { NodeSlotSize } from './NodeSlotSize'

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
    const update = (): void => void wflow.RUNLAYOUT(cushy.autolayoutOpts)
    useEffect(update, [JSON.stringify(cushy.autolayoutOpts), wflow.id])

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
                                    tw='absolute transition-all'
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
                                    tw='absolute transition-all'
                                    key={p.id}
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
                        <Frame
                            base={{ contrast: 0.03, hue: getChroma(node.$schema.nameInComfy), chroma: 0.07 }}
                            className='node rounded-sm transition-all'
                            hover
                            border={20}
                            key={node.uid}
                            style={{
                                zIndex: 991,
                                fontWeight: '20px',
                                lineHeight: '20px',
                                position: 'absolute',
                                top: bang(node.y),
                                left: bang(node.x),
                                width: bang(node.width),
                                height: bang(node.height) + 2,
                            }}
                        >
                            <ProgressLine
                                tw='absolute -top-2 !p-0'
                                status={pgr?.isDone ? 'success' : 'active'}
                                percent={pgr?.percent}
                            />

                            <Frame
                                base={6}
                                style={{ height: '20px' }}
                                tw='overflow-hidden font-bold whitespace-nowrap overflow-ellipsis'
                            >
                                {node.$schema.nameInComfy} [{node.uid}]
                            </Frame>
                            <div tw='text-sm'>
                                <Frame tw='flex justify-between px-2' /* style={{ borderBottom: '1px solid gray' }} */>
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
                                </Frame>
                                {node._primitives().map((ie, ix) => (
                                    <Frame //
                                        // base={ix % 2 === 0 ? 3 : 6}
                                        // base={3}
                                        hover
                                        key={ie.inputName}
                                        style={{ height: '20px' }}
                                        tw='overflow-hidden whitespace-nowrap overflow-ellipsis px-2'
                                    >
                                        <div tw='flex'>
                                            <div>{ie.inputName}:</div>
                                            <div tw='ml-auto'>{JSON.stringify(ie.value)}</div>
                                        </div>
                                    </Frame>
                                ))}
                            </div>
                        </Frame>
                    </Fragment>
                )
            })}
        </div>
    )
})

const getChroma = (type: string): number => {
    return hashStringToNumber(type) % 360
}
