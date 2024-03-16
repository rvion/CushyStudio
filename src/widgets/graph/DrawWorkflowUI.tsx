import type { NodePort } from 'src/core/ComfyNode'

import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'

import { NodeSlotSize } from './NodeSlotSize'
import { ComfyWorkflowL } from 'src/models/ComfyWorkflow'
import { randomNiceColor } from 'src/panels/Panel_Canvas/states/randomColor'
import { ProgressLine } from 'src/rsuite/shims'
import { bang } from 'src/utils/misc/bang'

export const DrawWorkflowUI = observer(function DrawWorkflowUI_(p: {
    //
    spline?: number
    workflow: ComfyWorkflowL
}) {
    const wflow = p.workflow
    const INportsById = new Map<string, NodePort>()
    const OUTportsById = new Map<string, NodePort>()
    // let totalWidth = 0
    // let totalHeight = 0
    for (const node of wflow.nodes) {
        for (const port of node.incomingPorts) INportsById.set(port.id, port)
        for (const port of node.outgoingPorts) OUTportsById.set(port.id, port)
        // totalHeight = Math.max(totalHeight, node.y + node.height)
        // totalWidth = Math.max(totalWidth, node.x + node.width)
    }

    return (
        <Fragment>
            {wflow.nodes.map((node) => {
                if (node == null) return
                const pgr = node.progressReport

                return (
                    <Fragment>
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
                            const color = randomNiceColor(start.label)
                            const stroke = color
                            return (
                                <svg //
                                    style={{ position: 'absolute', top: 0, left: 0, zIndex: 99 }}
                                    width={wflow.width ?? '100%'}
                                    height={wflow.height ?? '100%'}
                                >
                                    <path d={path} stroke={stroke} stroke-width='3' fill='none' />
                                </svg>
                            )
                        })}

                        {/* PORTS IN  */}
                        {node.incomingPorts?.map((p) => {
                            const color = randomNiceColor(p.type)
                            return (
                                <div
                                    tw='absolute'
                                    key={p.id}
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
                        {node.outgoingPorts?.map((p) => {
                            const color = randomNiceColor(p.type)
                            return (
                                <div
                                    key={p.id}
                                    tw='absolute'
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
                        {/* ACTUAL NODE */}
                        <div
                            className='node bg-base-200 rounded-xl bd'
                            key={node.uid}
                            style={{
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
                            {/* PROGRESS */}
                            {/* {node.progressRatio} */}
                            {/* {node.status} */}
                            {/* {node.isExecuting ? (
                                <ProgressLine status={pgr.isDone ? 'success' : 'active'} percent={pgr.percent} />
                            ) : null} */}
                            <ProgressLine status={pgr?.isDone ? 'success' : 'active'} percent={pgr?.percent} />

                            <div
                                style={{ height: '20px' }}
                                tw='bg-primary text-primary-content overflow-hidden whitespace-nowrap overflow-ellipsis'
                            >
                                {node.$schema.nameInComfy} [{node.uid}]
                            </div>
                            {/* <div>{n.data.width}</div> */}
                            <div>
                                <div tw='flex gap-1 justify-between' /* style={{ borderBottom: '1px solid gray' }} */>
                                    <div>
                                        {node._incomingEdges().map((ie) => (
                                            <div style={{ height: '20px' }} key={ie.inputName}>
                                                {ie.inputName} {/* {'<-'} [{ie.from}] */}
                                            </div>
                                        ))}
                                    </div>
                                    <div
                                        style={{ height: '20px' }}
                                        /* style={{ borderLeft: '1px solid gray' }} */
                                    >
                                        {node.$outputs.map((ie) => (
                                            <div key={ie.slotIx}>{(ie.type as string).toLowerCase()}</div>
                                        ))}
                                    </div>
                                </div>
                                {node._primitives().map((ie) => (
                                    <div //
                                        key={ie.inputName}
                                        style={{ height: '20px', border: '1px solid #424242' }}
                                        tw='overflow-hidden whitespace-nowrap overflow-ellipsis bg-base-100 rounded-xl'
                                    >
                                        <div tw='flex'>
                                            <div>{ie.inputName}:</div>
                                            <div tw='ml-auto'>{ie.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Fragment>
                )
            })}
        </Fragment>
    )
})
