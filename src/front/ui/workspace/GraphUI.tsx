import type { GraphL } from 'src/models/Graph'
import type { StepL } from 'src/models/Step'

import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { Panel } from 'rsuite'
import { ActionUI } from '../widgets/ActionUI'
import { StepUI } from './StepUI'

export const GraphSummaryUI = observer(function GraphSummaryUI_(p: { graph: GraphL }) {
    const graph = p.graph
    return (
        <Panel className='graph-container self-start'>
            {graph.size === 0 && <div>Empty Graph</div>}#{graph.id.slice(0, 3)}({graph.size})
            <ul>
                {graph.summary1.map((i, ix) => (
                    <li key={ix}>- {i}</li>
                ))}
            </ul>
        </Panel>
    )
})

export const GraphUI = observer(function GraphUI_(p: { graph: GraphL }) {
    const graph = p.graph
    const next = graph.nextStep.item

    return (
        <Fragment>
            {/* <GraphSummaryUI graph={graph} /> */}
            <div className='flex'>
                {/* <div>AA={graph.steps.items.length}</div> */}
                {/* {graph.next.item && 'NEXT'} */}
                <div>
                    {graph.actions.map((action) => (
                        <ActionUI key={action.id} action={action} />
                    ))}
                </div>
            </div>
            <div className='flex'>
                {graph.childSteps.map((step) => {
                    return (
                        <div key={step.id} className='flex'>
                            <div className='p-1 rounded-lg step-container' onClick={() => graph.update({ nextStepID: step.id })}>
                                {/* <Step2UI step={step} /> */}
                                <div>{step.tool.item?.data.name}</div>
                                {step.id === next?.id && <GraphSummaryUI graph={step.outputGraph.item} />}

                                {/* {step.id} */}
                            </div>
                        </div>
                    )
                })}
            </div>

            {next && <StepUI step={next} />}
            {/* focused step */}
        </Fragment>
    )
})

// export const Step2UI = observer(function Step2UI_(p: { step: StepL }) {
//     return (
//         <div>
//             <div>{p.step.tool.item?.data.name}</div>
//             <GraphSummaryUI graph={p.step.outputGraph.item} />
//         </div>
//     )
// })
