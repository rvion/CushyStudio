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
import { StepListUI } from './StepUI'
import { VerticalGalleryUI } from '../galleries/VerticalGalleryUI'
import { ScrollablePaneUI } from '../scrollableArea'
import { ToolPickerUI } from './ToolPickerUI'

export const GraphUI = observer(function GraphUI_(p: { graph: GraphL; depth: number }) {
    const graph = p.graph
    const focusedStep: Maybe<StepL> = graph.focusedStep.item
    const focusedDraft: Maybe<DraftL> = graph.focusedDraft.item
    const uiSt = useLocalObservable(() => ({ sizes: [100, 500, 100, 500, 100] }))

    return (
        <SplitPane
            sashRender={() => <div className='bg-gray-200'></div>}
            onChange={(ev) => (uiSt.sizes = ev)}
            sizes={uiSt.sizes}
            split='vertical'
            style={{ height: '100%' }}
        >
            {/* TOOL PICKER */}
            <Pane minSize='100px' className='col' style={{ minWidth: '100px', overflow: 'auto' }}>
                <b className='bg-red-950 text-center'>WORKFLOWS</b>
                <ToolPickerUI />
            </Pane>
            {/* 2.  */}
            <Pane minSize='100px' className='col'>
                <b className='bg-green-950 text-center'>ACTIONS</b>
                <div className='flex flex-wrap items-center gap-1'>
                    <Whisper speaker={<Tooltip>Draft Action</Tooltip>}>
                        <Button appearance='subtle' onClick={() => graph.createDraft(focusedDraft?.data).focus()}>
                            <I.AddOutline />
                        </Button>
                    </Whisper>
                    {graph.drafts.map((draft) => (
                        <Button
                            size='xs'
                            appearance='ghost'
                            key={draft.id}
                            active={focusedDraft?.id === draft.id}
                            onClick={() => graph.update({ focusedDraftID: draft.id })}
                        >
                            {draft.data.title}
                            {/* {draft.tool.item.name} */}
                        </Button>
                    ))}
                </div>
                <ScrollablePaneUI className='flex-grow'>
                    {/* DRAFT PICKER */}
                    {/* DRAFT */}
                    {focusedDraft ? <DraftUI draft={focusedDraft} /> : null}
                </ScrollablePaneUI>
            </Pane>
            <Pane minSize='100px' className='col'>
                <b className='bg-blue-950 text-center'>GALLERY</b>
                <VerticalGalleryUI />
            </Pane>
            <Pane minSize='100px' className='col'>
                <b className='bg-yellow-900 text-center'>HISTORY</b>
                <StepListUI />
            </Pane>
            {/* STEP PICKER */}
            {/* <Pane minSize='100px' style={{ overflow: 'auto' }}>
                <h5>HISTORY</h5>
                <Nav appearance='tabs' vertical reversed style={{ position: 'sticky', top: 0 }}>
                    {graph.childSteps.map((step) => (
                        <StepTabBtnUI key={step.id} step={step} />
                    ))}
                </Nav>
            </Pane> */}
        </SplitPane>
        // {/* <ScrollablePaneUI style={{ width: '10rem' }}>
        //     <ComfyNodeExplorerUI />
        // </ScrollablePaneUI> */}
        // </div>
    )
})
