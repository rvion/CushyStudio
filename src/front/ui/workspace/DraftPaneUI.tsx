import type { DraftL } from 'src/models/Draft'
import { observer } from 'mobx-react-lite'
import { Button, Loader } from 'rsuite'
import { DraftUI } from '../widgets/DraftUI'
import { useProject } from '../../../front/ProjectCtx'

export const PafUI = observer(function PafUI_(p: {}) {
    const pj = useProject()
    const paf = pj.activeFile
    if (paf == null) return null
    return (
        <div>
            <div>file: {paf.relPath}</div>
        </div>
    )
})

export const DraftPaneUI = observer(function DraftPaneUI_(p: {}) {
    const pj = useProject()
    const graph = pj.rootGraph.item
    const tool = pj.activeTool.item
    const focusedDraft: Maybe<DraftL> = tool?.focusedDraft.item
    const paf = pj.activeFile
    return (
        <>
            <PafUI />
            <div>tool: {tool?.name}</div>
            <div className='flex flex-wrap items-center'>
                {tool
                    ? tool.drafts.map((draft) => (
                          <Button
                              style={{
                                  borderBottomLeftRadius: 0,
                                  borderBottomRightRadius: 0,
                                  borderBottom: 'none',
                              }}
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
                <Button
                    disabled={tool == null}
                    //
                    appearance='ghost'
                    size='xs'
                    color='green'
                    startIcon={<span className='material-symbols-outlined'>add</span>}
                    // code to duplicate the draft
                    style={{
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        borderBottom: 'none',
                    }}
                    onClick={() => {
                        if (tool == null) return
                        const draft = pj.db.drafts.create({
                            toolID: tool.id,
                            graphID: pj.rootGraph.id,
                            title: 'Untitled',
                            params: {},
                            // params: deepCopyNaive(fromDraft?.params ?? {}),
                        })
                        tool.update({ focusedDraftID: draft.id })
                    }}
                >
                    {/* <I.AddOutline /> */}
                    New Draft
                </Button>
            </div>
            {/* <ScrollablePaneUI className='flex-grow'> */}
            {/* DRAFT PICKER */}
            {/* DRAFT */}
            <div className='flex-grow col mx-2'>
                {/*  */}
                {focusedDraft ? <DraftUI draft={focusedDraft} /> : <>no draft selected</>}
            </div>
            {/* </ScrollablePaneUI> */}
        </>
    )
})
