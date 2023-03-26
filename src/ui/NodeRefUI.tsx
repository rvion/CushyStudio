import type { ComfyNodeUID } from '../core/ComfyNodeUID'
import type { ComfyGraph } from '../core/ComfyGraph'

import { useWorkspace } from './WorkspaceContext'
import { observer } from 'mobx-react-lite'
import { comfyColors } from '../core/ComfyColors'

export const NodeRefUI = observer(function NodeRefUI_(p: { nodeUID: ComfyNodeUID }) {
    const st = useWorkspace()
    // 1. ensure project exists
    const project = st.focusedProject
    if (project == null) return null

    // 2. ensure graph exists
    const graph: ComfyGraph | undefined = project.currentRun?.graph
    if (graph == null) return <>no execution yet</>

    // 3. ensure node exists
    const node = graph.nodesIndex.get(p.nodeUID)
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
