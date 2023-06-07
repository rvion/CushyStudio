import { useCallback, useEffect, useState } from 'react'
import ReactFlow, { Connection, Controls, Position, addEdge, useEdgesState, useNodesState } from 'reactflow'
import 'reactflow/dist/style.css'

import { XUI } from './Node1'

// import './index.css'

const initBgColor = '#1A192B'

const connectionLineStyle = { stroke: '#fff' }
const snapGrid: [number, number] = [20, 20]
const nodeTypes = {
    selectorNode: XUI,
}

const defaultViewport = { x: 0, y: 0, zoom: 1.5 }

export const CustomNodeFlow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const [bgColor, setBgColor] = useState(initBgColor)

    useEffect(() => {
        const onChange = (event: any) => {
            setNodes((nds) =>
                nds.map((node) => {
                    if (node.id !== '2') return node
                    const color = event.target.value
                    setBgColor(color)
                    return { ...node, data: { ...node.data, color } }
                }),
            )
        }

        setNodes([
            {
                id: '1',
                type: 'input',
                data: { label: 'An input node' },
                position: { x: 0, y: 50 },
                sourcePosition: Position.Right,
            },
            {
                id: '2',
                type: 'selectorNode',
                data: { onChange: onChange, color: initBgColor },
                style: { border: '1px solid #777', padding: 10 },
                position: { x: 300, y: 50 },
            },
            {
                id: '3',
                type: 'output',
                data: { label: 'Output A' },
                position: { x: 650, y: 25 },
                targetPosition: Position.Left,
            },
            {
                id: '4',
                type: 'output',
                data: { label: 'Output B' },
                position: { x: 650, y: 100 },
                targetPosition: Position.Left,
            },
        ])

        setEdges([
            { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#fff' } },
            { id: 'e2a-3', source: '2', target: '3', sourceHandle: 'a', animated: true, style: { stroke: '#fff' } },
            { id: 'e2b-4', source: '2', target: '4', sourceHandle: 'b', animated: true, style: { stroke: '#fff' } },
        ])
    }, [])

    const onConnect = useCallback(
        (params: Connection) =>
            setEdges((eds) =>
                addEdge(
                    {
                        ...params,
                        animated: true,
                        style: { stroke: '#fff' },
                    },
                    eds,
                ),
            ),
        [],
    )
    return (
        <div style={{ background: bgColor, width: '200px', height: '200px' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                style={{ background: bgColor }}
                nodeTypes={nodeTypes}
                connectionLineStyle={connectionLineStyle}
                snapToGrid={true}
                snapGrid={snapGrid}
                defaultViewport={defaultViewport}
                fitView
                attributionPosition='bottom-left'
            >
                {/* <MiniMap
                    nodeStrokeColor={(n) => {
                        if (n.type === 'input') return '#0041d0'
                        if (n.type === 'selectorNode') return bgColor
                        if (n.type === 'output') return '#ff0072'
                    }}
                    nodeColor={(n) => {
                        if (n.type === 'selectorNode') return bgColor
                        return '#fff'
                    }}
                /> */}
                <Controls />
            </ReactFlow>
        </div>
    )
}
