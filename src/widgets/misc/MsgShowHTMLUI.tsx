import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useMemo } from 'react'

// @ts-ignore
import { createPortal } from 'react-dom'
import { renderMinimap } from 'src/widgets/minimap/Minimap'
import { ComfyWorkflowL } from 'src/models/Graph'

export const GraphPreviewUI = observer(function MsgShowHTMLUI_(p: { graph: ComfyWorkflowL }) {
    const graph = p.graph
    const elMap = document.querySelector('#map')
    const cyto = graph.json_cyto

    // 1. trigger cyto update (🔶 this is asynchronous)
    // useMemo(() => graph.updateCyto(), [graph])

    // 2. once cyto is done
    useLayoutEffect(() => {
        if (graph == null) return // ❌ console.log('❌ no graph yet')
        if (elMap == null) return // ❌ console.log('❌ no elMap yet')
        if (cyto == null) return // ❌ console.log('❌ no cyto yet')
        renderMinimap(document.querySelector('#map')!, {
            viewport: domNode,
            styles: {
                // 'header,footer,section,article': 'rgba(0,0,0,0.08)',
                // 'h1,a': 'rgba(0,0,0,0.10)',
                // 'h2,h3,h4': 'rgba(0,0,0,0.08)',
                'div.node': 'rgba(176, 80, 80, 0.8)',
            },
            back: 'rgba(0,0,0,0.02)',
            view: 'rgba(0,0,0,0.05)',
            drag: 'rgba(0,0,0,0.10)',
            // interval: 2000,
        })
    }, [graph, elMap, cyto])

    const domNode = document.getElementById('hovered-graph')
    if (domNode == null) return null
    if (cyto.elements.nodes == null) return null

    const fullGraph = (
        <>
            {cyto.elements.nodes.map((n) => {
                return (
                    <div
                        className='node'
                        key={n.data.id}
                        style={{
                            position: 'absolute',
                            top: n.position.y,
                            left: n.position.x,
                            width: n.data.width,
                            height: n.data.height,
                            background: '#aaa',
                        }}
                    ></div>
                )
            })}
        </>
    )
    return (
        <div>
            <canvas
                onMouseEnter={() => (domNode.style.opacity = '0.8')}
                onMouseLeave={() => (domNode.style.opacity = '0')}
                id='map'
                style={{ width: '200px', height: '200px', zIndex: 1000 }}
            ></canvas>
            {createPortal(fullGraph, domNode)}
        </div>
    )
})
