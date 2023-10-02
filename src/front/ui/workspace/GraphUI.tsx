import type { DraftL } from 'src/models/Draft'
import type { GraphL } from 'src/models/Graph'

import { observer, useLocalObservable } from 'mobx-react-lite'
import { Button } from 'rsuite'
import { DraftUI } from '../widgets/DraftUI'

import { Pane } from 'split-pane-react'
import SplitPane from 'split-pane-react/esm/SplitPane'
import { useProject } from '../../../front/ProjectCtx'
import { SectionTitleUI } from './SectionTitle'
import { StepListUI } from './StepUI'
import { ActionPickerUI } from './ActionPickerUI'

export const GraphUI = observer(function GraphUI_(p: { graph: GraphL; depth: number }) {
    const graph = p.graph
    const pj = useProject()
    const tool = pj.activeTool.item
    // const focusedDraftOld: Maybe<DraftL> = graph.focusedDraft.item
    const focusedDraft: Maybe<DraftL> = tool?.focusedDraft.item
    const uiSt = useLocalObservable(() => ({ sizes: [100, 300, 150] }))

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
            performanceMode
            sashRender={() => <div className='bg-gray-200'></div>}
            onChange={(ev) => (uiSt.sizes = ev)}
            sizes={uiSt.sizes}
            split='vertical'
            style={{ height: '100%' }}
        >
            {/* 1. ACTION */}
            <Pane minSize='150px' className='col' style={{ overflow: 'auto', background: '120202' }}>
                <SectionTitleUI label='ACTION' className='bg-red-950' />
                <ActionPickerUI />
            </Pane>

            {/* 2. DRAFTS  */}
            <Pane minSize='100px' className='col' style={{ background: '#011402' }}>
                <SectionTitleUI label='DRAFTS' className='bg-green-950' />
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
                                  {draft.data.title || 'Untitled'}
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
            <Pane minSize='100px' className='col'>
                <SectionTitleUI label='RUNS' className='bg-yellow-900' />
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
