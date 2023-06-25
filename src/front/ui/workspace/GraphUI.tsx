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
import type { DraftL } from 'src/models/Draft'
import { Status } from '../../../back/Status'

export const GraphUI = observer(function GraphUI_(p: { graph: GraphL; depth: number }) {
    const graph = p.graph
    const focusedStep: Maybe<StepL> = graph.focusedStep.item
    const focusedDraft: Maybe<DraftL> = graph.focusedDraft.item
    return (
        <Fragment>
            <div className='flex gap-2 items-start'>
                {/* Starting point -------------------------------------------- */}

                {/* Drafts -------------------------------------------- action form */}
                <div>
                    <div>
                        {'-->'}
                        {/* drafts: */}
                        {/* create branch button */}
                        {/* {graph.drafts.items.length} */}
                        {graph.drafts.map((draft) => (
                            // <StepTabBtnUI key={step.id} step={step} />
                            <Button
                                active={focusedDraft?.id === draft.id}
                                onClick={() => graph.update({ focusedDraftID: draft.id })}
                                size='xs'
                                appearance='subtle'
                            >
                                {draft.tool.item.name}
                            </Button>
                        ))}
                        <Whisper speaker={<Tooltip>Draft Action</Tooltip>}>
                            <Button appearance='subtle' onClick={() => graph.createDraft(focusedDraft?.data).focus()}>
                                <I.AddOutline />
                            </Button>
                        </Whisper>
                    </div>
                    <div className='flex gap-2'>
                        {<GraphSummaryUI graph={graph} />}
                        {focusedDraft ? <ActionUI draft={focusedDraft} /> : null}
                        {/* {focusedStep ? <ActionUI step={focusedStep} /> : null} */}
                    </div>
                </div>
            </div>

            {/* child Steps -------------------------------------------- */}
            <div className='mt-2'>
                {/* depth */}
                {/* <div className='mr-1'>#{p.depth}</div> */}

                {/* existing branches */}
                <div className='flex wrap'>
                    {graph.childSteps.map((step) => (
                        <StepTabBtnUI key={step.id} step={step} />
                    ))}
                </div>

                {focusedStep && (
                    <div className=''>
                        {/* step summary: */}
                        {focusedStep.data.outputs?.map((output, ix) => (
                            <StepOutputUI key={ix} step={focusedStep} output={output} />
                        ))}
                    </div>
                )}
            </div>

            {/* <Divider /> */}
            {/* child */}
            {focusedStep &&
                (focusedStep.data.status === Status.Success ? (
                    <GraphUI //
                        key={focusedStep.id}
                        graph={focusedStep.outputGraph.item}
                        depth={p.depth + 1}
                    />
                ) : (
                    <div className=''>
                        {/* step summary: */}
                        {focusedStep.data.outputs?.map((output, ix) => (
                            <StepOutputUI key={ix} step={focusedStep} output={output} />
                        ))}
                    </div>
                ))}
        </Fragment>
    )
})
