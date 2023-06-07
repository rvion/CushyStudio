import type { GraphL } from 'src/models/Graph'
import { observer } from 'mobx-react-lite'
import { Panel } from 'rsuite'
import { NodeRefUI } from '../NodeRefUI'
import { CustomNodeFlow } from '../graph/Graph2UI'

export const GraphSummaryUI = observer(function GraphSummaryUI_(p: { graph: GraphL }) {
    const graph = p.graph
    return (
        <>
            <Panel className='graph-container self-start w-48'>
                {graph.size === 0 && <div>Empty Graph</div>}
                {/* <CustomNodeFlow /> */}
                <div>GRAPH DISABLED</div>
            </Panel>
            <div>
                {graph.nodes.map((n, ix) => (
                    <div key={n.uid} className='flex'>
                        <NodeRefUI label={ix.toString()} node={n} />
                        {n.$schema.nameInCushy}
                    </div>
                ))}
            </div>
        </>
    )
})
