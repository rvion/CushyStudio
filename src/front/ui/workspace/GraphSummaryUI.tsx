import type { GraphL } from 'src/models/Graph'

import { observer } from 'mobx-react-lite'
import { Panel } from 'rsuite'
import { NodeRefUI } from '../NodeRefUI'
import { ButtonDownloadFilesUI } from './ButtonDownloadFilesUI'
import { ButtonOpenInComfyUI } from './ButtonOpenInComfyUI'

export const GraphSummaryUI = observer(function GraphSummaryUI_(p: { graph: GraphL }) {
    const graph = p.graph
    return (
        <Panel>
            <div className='w-64 max-h-64 overflow-auto'>
                {graph.size === 0 && <div>Empty Graph</div>}
                {graph.nodes.map((n, ix) => (
                    <div key={n.uid} className='flex'>
                        {n.statusEmoji}
                        {/* {n.status ?? '❓'} */}
                        <NodeRefUI label={ix.toString()} node={n} />
                        {n.$schema.nameInCushy}
                    </div>
                ))}
            </div>
            <ButtonDownloadFilesUI graph={graph} />
            <ButtonOpenInComfyUI graph={graph} />
        </Panel>
    )
})
