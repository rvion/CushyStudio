import type { Graph } from '../core-shared/Graph'
import type { ComfyNodeUID } from '../core-types/NodeUID'
import type { Maybe } from '../utils/types'

import { observer } from 'mobx-react-lite'
import { useSt } from '../core-front/stContext'
import { comfyColors } from '../core-shared/Colors'

export const NodeRefUI = observer(function NodeRefUI_(p: { nodeUID: ComfyNodeUID; graph: Graph }) {
    // const st = useSt()
    // 1. ensure project exists

    // 2. ensure graph exists
    // const graph: Maybe<Graph> = st.graph
    // if (graph == null) return <>no execution yet</>

    // 3. ensure node exists
    const node = p.graph.nodesIndex.get(p.nodeUID)
    if (node == null) return <>❌ error</>

    const category = node?.$schema.category
    const color = comfyColors[category]
    return (
        <div style={{ backgroundColor: color }} className='nodeRef'>
            {p.nodeUID}
            {/* .join(', ') */}
        </div>
    )
})
