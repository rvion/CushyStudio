import type { DraftL } from 'src/models/Draft'
import type { GraphL } from 'src/models/Graph'
import type { StepL } from 'src/models/Step'

import * as I from '@rsuite/icons'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { Button, Tooltip, Whisper } from 'rsuite'
import { DraftUI } from '../widgets/DraftUI'

import { Pane } from 'split-pane-react'
import SplitPane from 'split-pane-react/esm/SplitPane'
import { VerticalGalleryUI } from '../galleries/VerticalGalleryUI'
import { StepListUI } from './StepUI'
import { ToolPickerUI } from './ToolPickerUI'

export const GraphUI = observer(function GraphUI_(p: { graph: GraphL; depth: number }) {
    const graph = p.graph
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
            <Pane minSize='100px' className='col' style={{ minWidth: '100px', overflow: 'auto', background: '120202' }}>
                <b className='bg-red-950 text-center'>ACTION</b>
                <ToolPickerUI />
            </Pane>
            {/* 2.  */}
            <Pane minSize='100px' className='col' style={{ background: '#011402' }}>
                <b className='bg-green-950 text-center'>FLOWS</b>
                <div className='flex flex-wrap items-center gap-1 m-1'>
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
                {/* <ScrollablePaneUI className='flex-grow'> */}
                {/* DRAFT PICKER */}
                {/* DRAFT */}
                <div className='flex-grow col m-2'>{focusedDraft ? <DraftUI draft={focusedDraft} /> : null}</div>
                {/* </ScrollablePaneUI> */}
            </Pane>
            <Pane minSize='100px' className='col' style={{ overflow: 'auto' }}>
                <b className='bg-blue-950 text-center'>GALLERY</b>
                <VerticalGalleryUI />
            </Pane>
            <Pane minSize='100px' className='col'>
                <b className='bg-yellow-900 text-center'>RUNS</b>
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
