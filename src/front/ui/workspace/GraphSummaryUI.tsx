import type { GraphL } from 'src/models/Graph'
import { observer } from 'mobx-react-lite'
import { Panel } from 'rsuite'
import { NodeRefUI } from '../NodeRefUI'
// import { CustomNodeFlow } from '../graph/Graph2UI'

export const GraphSummaryUI = observer(function GraphSummaryUI_(p: { graph: GraphL }) {
    const graph = p.graph
    return (
        <Panel className='w-64 max-h-64'>
            <div>
                {graph.size === 0 && <div>Empty Graph</div>}
                {graph.nodes.map((n, ix) => (
                    <div key={n.uid} className='flex'>
                        <NodeRefUI label={ix.toString()} node={n} />
                        {n.$schema.nameInCushy}
                    </div>
                ))}
            </div>
        </Panel>
    )
})
