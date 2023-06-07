import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { Button } from 'rsuite'
import type { GraphL } from 'src/models/Graph'
import { StepL } from 'src/models/Step'
import { Maybe } from 'src/utils/types'
import { ActionUI } from '../widgets/ActionUI'
import { GraphSummaryUI } from './GraphSummaryUI'
import { StepBtnUI } from './StepUI'
import { StepOutputUI } from './StepOutputUI'

export const GraphUI = observer(function GraphUI_(p: { graph: GraphL; depth: number }) {
    const graph = p.graph
    const focusedStep: Maybe<StepL> = graph.focusedStep.item
    return (
        <Fragment>
            <div className='flex items-baseline wrap'>
                {/* depth */}
                {/* <div className='mr-1'>#{p.depth}</div> */}

                {/* existing branches */}
                {graph.childSteps.map((step) => (
                    <StepBtnUI key={step.id} step={step} />
                ))}
                {/* create branch button */}
                <Button onClick={() => graph.createDraft(focusedStep).focus()}>
                    <I.AddOutline />
                </Button>
            </div>

            <div className='flex gap-2 items-baseline'>
                {/* action form */}
                <div>
                    {focusedStep ? <ActionUI step={focusedStep} /> : null}
                    {focusedStep &&
                        focusedStep.data.outputs?.map((output, ix) => (
                            <StepOutputUI key={ix} step={focusedStep} output={output} />
                        ))}
                </div>

                {/* input summary */}
                {focusedStep && <GraphSummaryUI graph={graph} />}
            </div>

            {/* <Divider /> */}
            {/* child */}
            {focusedStep && (
                <GraphUI //
                    key={focusedStep.id}
                    graph={focusedStep.outputGraph.item}
                    depth={p.depth + 1}
                />
            )}
        </Fragment>
    )
})
