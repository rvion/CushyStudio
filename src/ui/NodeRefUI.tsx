import { useSt } from './ComfyIDEState'
import { observer } from 'mobx-react-lite'
import { comfyColors } from '../core/ComfyColors'
import { ComfyNodeUID } from '../core/ComfyNodeUID'

export const NodeRefUI = observer(function NodeRefUI_(p: { nodeUID: ComfyNodeUID }) {
    const st = useSt()
    const project = st.project
    if (project == null) return null
    const node = project.nodes.get(p.nodeUID)
    if (node == null) {
        return <>❌ error</>
    } else {
        const category = node?.$schema.category
        const color = comfyColors[category]
        return (
            <div style={{ backgroundColor: color }} className='nodeRef'>
                {p.nodeUID}
                {/* .join(', ') */}
            </div>
        )
    }
})
