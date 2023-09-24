import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Button, Nav, Tooltip, Whisper } from 'rsuite'
import type { DraftL } from 'src/models/Draft'
import type { GraphL } from 'src/models/Graph'
import { StepL } from 'src/models/Step'
import { Maybe } from 'src/utils/types'
import { DraftUI } from '../widgets/DraftUI'
import { StepOutputUI } from './StepOutputUI'
import { StepTabBtnUI } from './StepTabBtnUI'

export const GraphUI = observer(function GraphUI_(p: { graph: GraphL; depth: number }) {
    const graph = p.graph
    const focusedStep: Maybe<StepL> = graph.focusedStep.item
    const focusedDraft: Maybe<DraftL> = graph.focusedDraft.item
    return (
        <div className='flex gap-2 flex-grow'>
            <div className='flex basis-0 '>
                {/* DRAFT PICKER */}
                <div>
                    <div className='smalltitle'>flows</div>
                    <Nav appearance='tabs' vertical>
                        {graph.drafts.map((draft) => (
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
                </div>

                {/* DRAFT */}
                {focusedDraft ? (
                    <div className='w-full'>
                        <DraftUI draft={focusedDraft} />
                    </div>
                ) : null}
            </div>

            <div className='flex flex-grow basis-0'>
                {/* STEP PICKER */}
                <div>
                    <div className='smalltitle'>executions</div>
                    <Nav appearance='tabs' vertical>
                        {graph.childSteps.map((step) => (
                            <StepTabBtnUI key={step.id} step={step} />
                        ))}
                    </Nav>
                </div>
                {/* STEP */}
                <div>
                    <div className='smalltitle'>outputs</div>

                    {focusedStep && (
                        <div className='flex col-output flex-grow p-2'>
                            <div className='flex flex-col gap-1'>
                                {focusedStep.data.outputs?.map((output, ix) => (
                                    <StepOutputUI key={ix} step={focusedStep} output={output} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
})
