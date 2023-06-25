import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { Button, Tooltip, Whisper } from 'rsuite'
import type { GraphL } from 'src/models/Graph'
import { StepL } from 'src/models/Step'
import { Maybe } from 'src/utils/types'
import { ActionUI } from '../widgets/ActionUI'
import { GraphSummaryUI } from './GraphSummaryUI'
import { StepTabBtnUI } from './StepTabBtnUI'
import { StepOutputUI } from './StepOutputUI'
import { DraftL } from 'src/models/Draft'

export const GraphUI = observer(function GraphUI_(p: { graph: GraphL; depth: number }) {
    const graph = p.graph
    const focusedStep: Maybe<StepL> = graph.focusedStep.item
    const focusedDraft: Maybe<DraftL> = graph.focusedDraft.item
    return (
        <Fragment>
            <div className='flex items-baseline wrap'>
                {/* depth */}
                {/* <div className='mr-1'>#{p.depth}</div> */}

                {/* existing branches */}
                {graph.childSteps.map((step) => (
                    <StepTabBtnUI key={step.id} step={step} />
                ))}
                {/* create branch button */}
                <Whisper speaker={<Tooltip>Create Draft</Tooltip>}>
                    <Button appearance='subtle' onClick={() => graph.createDraft(focusedDraft?.data).focus()}>
                        <I.AddOutline />
                    </Button>
                </Whisper>
            </div>

            <div className='flex gap-2 items-baseline'>
                {/* action form */}
                <div>
                    <div className='flex'>
                        {/*  */}
                        {focusedDraft ? <ActionUI draft={focusedDraft} /> : null}

                        {/* {focusedStep ? <ActionUI step={focusedStep} /> : null} */}
                    </div>
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
