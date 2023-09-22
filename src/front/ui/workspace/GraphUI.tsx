import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { Button, Nav, Tooltip, Whisper } from 'rsuite'
import type { DraftL } from 'src/models/Draft'
import type { GraphL } from 'src/models/Graph'
import { StepL } from 'src/models/Step'
import { Maybe } from 'src/utils/types'
import { DraftUI } from '../widgets/DraftUI'
import { GraphSummaryUI } from './GraphSummaryUI'
import { StepOutputUI } from './StepOutputUI'
import { StepTabBtnUI } from './StepTabBtnUI'

export const GraphUI = observer(function GraphUI_(p: { graph: GraphL; depth: number }) {
    const graph = p.graph
    const focusedStep: Maybe<StepL> = graph.focusedStep.item
    const focusedDraft: Maybe<DraftL> = graph.focusedDraft.item
    return (
        <Fragment>
            <div className='flex gap-2 items-start'>
                {/* Drafts -------------------------------------------- action form */}
                <div>
                    <Nav appearance='tabs'>
                        {graph.drafts.map((draft) => (
                            // <StepTabBtnUI key={step.id} step={step} />
                            <Nav.Item
                                key={draft.id}
                                active={focusedDraft?.id === draft.id}
                                onClick={() => graph.update({ focusedDraftID: draft.id })}
                            >
                                {draft.tool.item.name}
                            </Nav.Item>
                        ))}
                        <Whisper speaker={<Tooltip>Draft Action</Tooltip>}>
                            <Button appearance='subtle' onClick={() => graph.createDraft(focusedDraft?.data).focus()}>
                                <I.AddOutline />
                            </Button>
                        </Whisper>
                    </Nav>
                    <div className='flex gap-2'>
                        {/* {<GraphSummaryUI graph={graph} />} */}
                        {focusedDraft ? <DraftUI draft={focusedDraft} /> : null}
                        {/* {focusedStep ? <ActionUI draft={focusedStep} /> : null} */}
                        {/* {focusedDraft ? <GraphSummaryUI graph={focusedDraft.graph.item} /> : null} */}
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
                    <div className='flex'>
                        {/* step summary: */}
                        {<GraphSummaryUI graph={focusedStep.outputGraph.item} />}
                        {/* <div>
                            <pre>{JSON.stringify(focusedStep.data.outputs, null, 3)}</pre>
                        </div> */}
                        <div className='flex flex-col'>
                            {focusedStep.data.outputs?.map((output, ix) => (
                                <StepOutputUI key={ix} step={focusedStep} output={output} />
                            ))}
                        </div>
                        {/* <Panel className='graph-container self-start w-48'>
                            <CustomNodeFlow />
                        </Panel> */}
                    </div>
                )}
            </div>

            {/* child */}
            {/* {focusedStep &&
                (focusedStep.data.status === Status.Success ? (
                    <GraphUI //
                        key={focusedStep.id}
                        graph={focusedStep.outputGraph.item}
                        depth={p.depth + 1}
                    />
                ) : (
                    <div className=''>
                        {focusedStep.data.outputs?.map((output, ix) => (
                            <StepOutputUI key={ix} step={focusedStep} output={output} />
                        ))}
                    </div>
                ))} */}
        </Fragment>
    )
})
