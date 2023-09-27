import type { DraftL } from 'src/models/Draft'
import type { GraphL } from 'src/models/Graph'
import type { StepL } from 'src/models/Step'
import ResponsiveNav from '@rsuite/responsive-nav'

import * as I from '@rsuite/icons'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { Button, Nav, Tooltip, Whisper } from 'rsuite'
import { DraftUI } from '../widgets/DraftUI'
import { StepTabBtnUI } from './StepTabBtnUI'

import { Pane } from 'split-pane-react'
import SplitPane from 'split-pane-react/esm/SplitPane'
import 'split-pane-react/esm/themes/default.css'
import { StepListUI } from './StepUI'
import { VerticalGalleryUI } from '../galleries/VerticalGalleryUI'

export const GraphUI = observer(function GraphUI_(p: { graph: GraphL; depth: number }) {
    const graph = p.graph
    const focusedStep: Maybe<StepL> = graph.focusedStep.item
    const focusedDraft: Maybe<DraftL> = graph.focusedDraft.item
    const uiSt = useLocalObservable(() => ({ sizes: [50, 1, 50] }))

    return (
        <SplitPane
            sashRender={() => <div className='bg-gray-200'></div>}
            onChange={(ev) => (uiSt.sizes = ev)}
            sizes={uiSt.sizes}
            split='vertical'
            style={{ height: '100%' }}
        >
            <Pane minSize={'100px'}>
                <div className='flex overflow-auto'>
                    {/* TOOL PICKER */}
                    <Nav appearance='tabs' vertical>
                        {graph.db.tools.map((tool) => (
                            <Nav.Item
                                key={tool.id}
                                active={focusedDraft?.tool.id === tool.id}
                                onClick={() => {
                                    const correspondingDraft = graph.db.drafts.find((d) => d.tool.id === tool.id)
                                    if (correspondingDraft == null) return // 🔴
                                    graph.update({ focusedDraftID: correspondingDraft.id })
                                }}
                            >
                                {tool.name}
                            </Nav.Item>
                        ))}
                        <Whisper speaker={<Tooltip>Draft Action</Tooltip>}>
                            <Button appearance='subtle' onClick={() => graph.createDraft(focusedDraft?.data).focus()}>
                                <I.AddOutline />
                            </Button>
                        </Whisper>
                    </Nav>
                    {/* DRAFT PICKER */}
                    <div className='flex items-start flex-col flex-grow overflow-hidden'>
                        <div className='w-full'>
                            <ResponsiveNav appearance='tabs' removable>
                                {graph.drafts.map((draft) => (
                                    <ResponsiveNav.Item
                                        key={draft.id}
                                        active={focusedDraft?.id === draft.id}
                                        onClick={() => graph.update({ focusedDraftID: draft.id })}
                                    >
                                        {draft.tool.item.name}
                                    </ResponsiveNav.Item>
                                ))}
                            </ResponsiveNav>
                        </div>
                        <Whisper speaker={<Tooltip>Draft Action</Tooltip>}>
                            <Button appearance='subtle' onClick={() => graph.createDraft(focusedDraft?.data).focus()}>
                                <I.AddOutline />
                            </Button>
                        </Whisper>
                        {/* DRAFT */}
                        {focusedDraft ? (
                            <div className='w-full'>
                                <DraftUI draft={focusedDraft} />
                            </div>
                        ) : null}
                    </div>
                </div>
            </Pane>
            <Pane minSize={'100px'}>
                <VerticalGalleryUI />
            </Pane>
            <Pane minSize={'100px'}>
                <div className='flex'>
                    <StepListUI />
                    {/* STEP PICKER */}
                    <Nav appearance='tabs' vertical reversed>
                        {graph.childSteps.map((step) => (
                            <StepTabBtnUI key={step.id} step={step} />
                        ))}
                    </Nav>
                    {/* STEP */}
                </div>
            </Pane>
        </SplitPane>
        // {/* <ScrollablePaneUI style={{ width: '10rem' }}>
        //     <ComfyNodeExplorerUI />
        // </ScrollablePaneUI> */}
        // </div>
    )
})
