import type { DraftL } from 'src/models/Draft'
import type { GraphL } from 'src/models/Graph'
import type { StepL } from 'src/models/Step'

import * as I from '@rsuite/icons'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { Button, Nav, Tooltip, Whisper } from 'rsuite'
import { DraftUI } from '../widgets/DraftUI'
import { StepOutputUI } from './StepOutputUI'
import { StepTabBtnUI } from './StepTabBtnUI'

import 'split-pane-react/esm/themes/default.css'
import SplitPane from 'split-pane-react/esm/SplitPane'
import { Pane } from 'split-pane-react'

export const GraphUI = observer(function GraphUI_(p: { graph: GraphL; depth: number }) {
    const graph = p.graph
    const focusedStep: Maybe<StepL> = graph.focusedStep.item
    const focusedDraft: Maybe<DraftL> = graph.focusedDraft.item
    const uiSt = useLocalObservable(() => ({ sizes: [50, 50] }))

    return (
        <SplitPane
            sashRender={() => <div className='bg-gray-200'></div>}
            onChange={(ev) => (uiSt.sizes = ev)}
            sizes={uiSt.sizes}
            split='vertical'
            style={{ height: '100%' }}
        >
            <Pane minSize={'100px'} style={{ overflow: 'auto' }}>
                {/* DRAFT PICKER */}
                <div className='flex'>
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

                    {/* DRAFT */}
                    {focusedDraft ? (
                        <div className='w-full'>
                            <DraftUI draft={focusedDraft} />
                        </div>
                    ) : null}
                </div>
            </Pane>
            <Pane minSize={'100px'} style={{ overflow: 'auto' }}>
                <div className='flex'>
                    {/* STEP PICKER */}
                    <Nav appearance='tabs' vertical>
                        {graph.childSteps.map((step) => (
                            <StepTabBtnUI key={step.id} step={step} />
                        ))}
                    </Nav>
                    {/* STEP */}

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
            </Pane>
        </SplitPane>
        // {/* <ScrollablePaneUI style={{ width: '10rem' }}>
        //     <ComfyNodeExplorerUI />
        // </ScrollablePaneUI> */}
        // </div>
    )
})
