import type { Graph } from '../../core/Graph'
import type { ComfyNodeUID } from '../../types/NodeUID'

import { observer } from 'mobx-react-lite'
import { comfyColors } from '../../core/Colors'

export const NodeRefUI = observer(function NodeRefUI_(p: { size?: number; nodeUID: ComfyNodeUID; graph: Graph }) {
    const node = p.graph.nodesIndex.get(p.nodeUID)
    if (node == null) return <>❌ error</>
    const size = p.size ?? 1.5
    const category = node?.$schema.category
    const color = comfyColors[category]
    return (
        <div
            style={{
                fontSize: `1rem`,
                backgroundColor: color,
                lineHeight: `${size}em`,
                width: `${size}rem`,
                height: `${size}rem`,
            }}
            className='nodeRef'
        >
            {p.nodeUID}
            {/* .join(', ') */}
        </div>
    )
})
