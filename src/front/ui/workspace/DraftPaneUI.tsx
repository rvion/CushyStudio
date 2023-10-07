import type { PafLoadStatus } from 'src/back/CushyFile'
import type { DraftL } from 'src/models/Draft'
import { observer } from 'mobx-react-lite'
import { Button, Loader, Message, Popover, Whisper } from 'rsuite'
import { DraftUI } from '../widgets/DraftUI'
import { useProject } from '../../../front/ProjectCtx'
import { stringifyUnknown } from '../../../utils/stringifyUnknown'

export const PafUI = observer(function PafUI_(p: {}) {
    const pj = useProject()
    const paf = pj.activeFile
    if (paf == null) return null
    // const errors =
    return (
        <div className='flex flex-wrap gap-1'>
            {/* {paf.lo} */}
            <div className='rounded px-1' style={{ border: '1px solid white' }}>
                file: {paf.relPath}
            </div>
            <div>{paf.loaded.done ? null : <Loader />}</div>
            {[...paf.statusByStrategy.entries()].map(([strategy, status]) => (
                <Whisper
                    placement='bottom'
                    enterable
                    speaker={
                        <Popover>
                            {status.type === 'failure' ? (
                                <Message type='error' showIcon>
                                    {status.result.message}
                                    {stringifyUnknown(status.result.error)}
                                </Message>
                            ) : status.type === 'success' ? (
                                <Message type='success' showIcon>
                                    {status.result.tools.length} tools loaded
                                    {/* {stringifyUnknown(status.result.error)} */}
                                </Message>
                            ) : null}
                        </Popover>
                    }
                >
                    <div
                        className='rounded px-1 flex items-center gap-1'
                        key={strategy}
                        style={{ color: renderStatusColor(status), border: `1px solid ${renderStatusColor(status)}` }}
                    >
                        {strategy}: {renderStatus(status)}
                    </div>
                </Whisper>
            ))}
            {paf.loadResult?.paf?.tools.map((tool) => (
                <div className='rounded px-1 flex items-center gap-1' key={tool.id} style={{ border: `1px solid pink` }}>
                    {/* LOAD {strategy}: {renderStatus(status)} */}
                    <div>tool: {tool.name}</div>
                </div>
            ))}
        </div>
    )

    function renderStatusColor(pls: PafLoadStatus) {
        if (pls.type === 'failure') return 'red'
        if (pls.type === 'pending') return 'cyan'
        if (pls.type === 'success') return '#88f088'
    }

    function renderStatus(pls: PafLoadStatus) {
        if (pls.type === 'failure') return '❌'
        if (pls.type === 'pending') return <Loader />
        if (pls.type === 'success') return '✅'
    }
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
