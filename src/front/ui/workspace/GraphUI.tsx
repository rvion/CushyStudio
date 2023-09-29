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
import { useProject } from '../../../front/ProjectCtx'

export const GraphUI = observer(function GraphUI_(p: { graph: GraphL; depth: number }) {
    const graph = p.graph
    const pj = useProject()
    const tool = pj.activeTool.item
    // const focusedDraftOld: Maybe<DraftL> = graph.focusedDraft.item
    const focusedDraft: Maybe<DraftL> = tool?.focusedDraft.item
    const uiSt = useLocalObservable(() => ({ sizes: [100, 500, 100, 500, 100] }))

    const newDraftBtnUI = (
        <Button
            disabled={tool == null}
            //
            appearance='ghost'
            size='xs'
            color='green'
            // code to duplicate the draft
            onClick={() => {
                if (tool == null) return
                const draft = pj.db.drafts.create({
                    toolID: tool.id, //fromDraft?.toolID ?? this.st.toolsSorted[0].id,
                    graphID: pj.rootGraph.id,
                    title: 'Untitled',
                    params: {},
                    // params: deepCopyNaive(fromDraft?.params ?? {}),
                })
                tool.update({ focusedDraftID: draft.id })
            }}
            // onClick={() => graph.createDraft(focusedDraft?.data).focus()}
        >
            {/* <I.AddOutline /> */}
            New Draft
        </Button>
    )
    return (
        <SplitPane
            sashRender={() => <div className='bg-gray-200'></div>}
            onChange={(ev) => (uiSt.sizes = ev)}
            sizes={uiSt.sizes}
            split='vertical'
            style={{ height: '100%' }}
        >
            {/* 1. ACTION */}
            <Pane minSize='100px' className='col' style={{ minWidth: '100px', overflow: 'auto', background: '120202' }}>
                <b className='text-lg bg-red-950 text-center'>ACTION</b>
                <ToolPickerUI />
            </Pane>

            {/* 2. DRAFTS  */}
            <Pane minSize='100px' className='col' style={{ background: '#011402' }}>
                <b className='text-lg bg-green-950 text-center'>DRAFTS</b>
                <div className='flex flex-wrap items-center'>
                    {tool
                        ? tool.drafts.map((draft) => (
                              <Button
                                  size='xs'
                                  appearance={focusedDraft?.id === draft.id ? 'primary' : 'ghost'}
                                  color={focusedDraft?.id === draft.id ? 'violet' : undefined}
                                  key={draft.id}
                                  active={focusedDraft?.id === draft.id}
                                  onClick={() => {
                                      tool.update({ focusedDraftID: draft.id })
                                      graph.update({ focusedDraftID: draft.id })
                                  }}
                              >
                                  {draft.data.title}
                                  {/* {draft.tool.item.name} */}
                              </Button>
                          ))
                        : null}
                    {newDraftBtnUI}
                </div>
                {/* <ScrollablePaneUI className='flex-grow'> */}
                {/* DRAFT PICKER */}
                {/* DRAFT */}
                <div className='flex-grow col mx-2'>{focusedDraft ? <DraftUI draft={focusedDraft} /> : null}</div>
                {/* </ScrollablePaneUI> */}
            </Pane>
            <Pane minSize='100px' className='col' style={{ overflow: 'auto' }}>
                <b className='text-lg bg-blue-950 text-center'>GALLERY</b>
                <VerticalGalleryUI />
            </Pane>
            <Pane minSize='100px' className='col'>
                <b className='text-lg bg-yellow-900 text-center'>RUNS</b>
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
