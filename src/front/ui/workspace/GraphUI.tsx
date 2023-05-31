import type { GraphL } from 'src/models/Graph'
import { observer } from 'mobx-react-lite'
import { Panel } from 'rsuite'

export const GraphUI = observer(function GraphUI_(p: { graph: GraphL }) {
    const graph = p.graph
    return (
        <Panel className='graph-container'>
            (id={graph.id.slice(0, 3)}--{graph.size})
            <ul>
                {graph.summary1.map((i, ix) => (
                    <li key={ix}>- {i}</li>
                ))}
            </ul>
        </Panel>
    )
})

export const EmptyGraphUI = observer(function EmptyGraphUI_(p: {}) {
    return <Panel className='graph-container'>Empty Graph</Panel>
})
