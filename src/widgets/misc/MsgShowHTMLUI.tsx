// @ts-ignore
import { observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { MutableRefObject, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

import { ComfyWorkflowL } from 'src/models/ComfyWorkflow'
import { renderMinimap } from 'src/widgets/minimap/Minimap'

export const useObservableRef = <T extends any>() => useMemo(() => observable({ current: null } as MutableRefObject<T>), [])

export const GraphPreviewUI = observer(function GraphPreviewUI_(p: { graph: ComfyWorkflowL }) {
    const graph = p.graph
    const cyto = graph.json_cyto_small
    const canvasRef = useObservableRef<HTMLCanvasElement>()
    const elMap = canvasRef.current
    // 1. trigger cyto update (🔶 this is asynchronous)
    // useMemo(() => graph.updateCyto(), [graph])

    // 2. once cyto is done
    useEffect(() => {
        if (graph == null) return console.log('❌ no graph yet')
        if (elMap == null) return console.log('❌ no elMap yet')
        if (cyto == null) return console.log('❌ no cyto yet')
        renderMinimap(document.querySelector('#map')!, {
            viewport: domNode,
            styles: {
                // 'header,footer,section,article': 'rgba(0,0,0,0.08)',
                // 'h1,a': 'rgba(0,0,0,0.10)',
                // 'h2,h3,h4': 'rgba(0,0,0,0.08)',
                'div.node': 'rgba(176, 80, 80, 0.8)',
            },
            back: 'rgba(0,0,0,0.12)',
            view: 'rgba(0,0,0,0.25)',
            drag: 'rgba(0,0,0,0.30)',
            // interval: 2000,
        })
    }, [graph, canvasRef.current, cyto])

    const domNode = document.getElementById('hovered-graph')
    if (domNode == null) return '❌ domNode is null'
    if (cyto.elements.nodes == null) return `❌ cyto.elements.nodes is null`

    const fullGraph = (
        <>
            {/* {cyto.elements.nodes.length} */}
            {cyto.elements.nodes.map((n) => {
                const node = graph.getNode(n.data.originalID)
                if (node == null) return
                return (
                    <div
                        className='node virtualBorder bg-base-100'
                        key={n.data.id}
                        style={{
                            fontFamily: 'monospace',
                            fontWeight: '15px',
                            lineHeight: '15px',
                            position: 'absolute',
                            top: n.position.y,
                            left: n.position.x,
                            width: n.data.width,
                            height: n.data.height,
                            // padding: 10,
                            // overflow: 'hidden',
                            // background: '#aaa',
                        }}
                    >
                        <div tw='bg-primary text-primary-content overflow-hidden whitespace-nowrap overflow-ellipsis'>
                            {node.$schema.nameInComfy} [{n.data.id}]
                        </div>
                        {/* <div>{n.data.width}</div> */}
                        <div>
                            {node._incomingEdges().map((ie) => (
                                <div key={ie.inputName}>
                                    {ie.inputName} {'<-'} [{ie.from}]
                                </div>
                            ))}
                            {node._primitives().map((ie) => (
                                <div key={ie.inputName} tw='overflow-hidden whitespace-nowrap overflow-ellipsis'>
                                    ${ie.inputName} = {ie.value}
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
        </>
    )

    /* Temporary workaround for when the overlay gets stuck so people don't have to restart. */
    const listenForCancelKey = (ev: KeyboardEvent) => {
        if (ev.key == 'Escape') {
            domNode.style.opacity = '0'
            window.removeEventListener('keydown', listenForCancelKey, true)
        }
    }

    return (
        <div>
            <canvas
                ref={canvasRef}
                onMouseEnter={() => {
                    domNode.style.opacity = '1'
                    window.addEventListener('keydown', listenForCancelKey, true)
                }}
                onMouseLeave={() => {
                    domNode.style.opacity = '0'
                    window.removeEventListener('keydown', listenForCancelKey, true)
                }}
                style={{ width: '400px', height: '400px', zIndex: 1000 }}
                id='map'
            ></canvas>
            {createPortal(fullGraph, domNode)}
        </div>
    )
})
