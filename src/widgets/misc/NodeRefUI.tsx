import type { ComfyNode } from '../../core/ComfyNode'

import { observer } from 'mobx-react-lite'

import { comfyColors } from '../../core/Colors'

export const NodeRefUI = observer(function NodeRefUI_(p: {
    //
    label?: string
    size?: number
    node: ComfyNode<any>
}) {
    // const node = p.graph.nodesIndex.get(p.nodeUID)
    // if (node == null) return <>❌ error</>
    const { node } = p
    const size = p.size ?? 1.5
    const category = node?.$schema.category
    const color = comfyColors[category] ?? '#354546'
    return (
        <div
            style={{
                flexShrink: 0,
                fontSize: `1rem`,
                backgroundColor: color,
                lineHeight: `${size}em`,
                width: `${size}rem`,
                height: `${size}rem`,
            }}
            className='nodeRef'
        >
            {p.label}
            {/* {node.uid} */}
            {/* .join(', ') */}
        </div>
    )
})
