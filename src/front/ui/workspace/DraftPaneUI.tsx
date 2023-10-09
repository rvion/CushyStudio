import { observer, useLocalObservable } from 'mobx-react-lite'
import { Button, Loader, Message, Nav, Popover, Toggle, Whisper } from 'rsuite'
import type { DraftL } from 'src/models/Draft'
import { useProject } from '../../../front/ProjectCtx'
import { JSONHighlightedCodeUI, TypescriptHighlightedCodeUI } from '../TypescriptHighlightedCodeUI'
import { DraftUI } from '../widgets/DraftUI'
import { TabUI } from '../layout/TabUI'
import { TooltipUI } from '../layout/TooltipUI'
import { ToolL } from 'src/models/Tool'
import { ToolAndCode } from 'src/back/PossibleActionFile'
import { Fragment } from 'react'
import { ComfyUIUI } from './ComfyUIUI'

export const PafUI = observer(function PafUI_(p: {}) {
    const pj = useProject()
    const paf = pj.activeFile
    // const uiSt = useLocalObservable(() => ({ activeTab: '2' }))
    if (paf == null) return null
    return (
        <>
            <div>{paf.loaded.done ? null : <Loader />}</div>
            <Toggle checked={paf.autoReload} onChange={(n) => paf.setAutoReload(n)} />
            <div>
                <Nav appearance='tabs' activeKey={paf.focus} onSelect={(k) => (paf.focus = k)}>
                    <Nav.Item disabled={paf.asAction == null} eventKey='action'>
                        Action
                    </Nav.Item>
                    <Nav.Item disabled={paf.asAutoAction == null} eventKey='autoaction'>
                        AutoAction
                    </Nav.Item>
                    <Nav.Item disabled={paf.png == null} eventKey='png'>
                        Png
                    </Nav.Item>
                    <Nav.Item disabled={paf.liteGraphJSON == null} eventKey='workflow'>
                        Workflow
                    </Nav.Item>
                    <Nav.Item disabled={paf.promptJSON == null} eventKey='prompt'>
                        Prompt
                    </Nav.Item>
                </Nav>
            </div>
            {paf.focus === 'action' ? (
                // AUTO-ACTION ----------------------------------------------------------
                paf.asAction == null ? (
                    <div>not available</div>
                ) : paf.asAction.success ? (
                    <>
                        <ActionUI tac={paf.asAction.value} />
                        {/* <pre>{paf.asAction.value.codeTS}</pre> */}
                    </>
                ) : (
                    <div>❌ Action</div>
                )
            ) : paf.focus === 'autoaction' ? (
                // ACTION ----------------------------------------------------------
                paf.asAutoAction == null ? (
                    <div>not available</div>
                ) : paf.asAutoAction.success ? (
                    <ActionUI tac={paf.asAutoAction.value} />
                ) : (
                    <div>❌ Action</div>
                )
            ) : paf.focus === 'png' ? (
                // PNG ----------------------------------------------------------
                paf.png == null ? (
                    <div>not available</div>
                ) : paf.png.success ? (
                    <img src={`file://${paf.png.value}`} alt='' />
                ) : (
                    <div>❌ png</div>
                )
            ) : paf.focus === 'workflow' ? (
                // PNG ----------------------------------------------------------
                paf.liteGraphJSON == null ? (
                    <div>not available</div>
                ) : paf.liteGraphJSON.success ? (
                    <ComfyUIUI action={{ type: 'comfy', json: paf.liteGraphJSON.value }} />
                ) : (
                    // <img src={`file://${paf.liteGraphJSON.value}`} alt='' />
                    <div>❌ png</div>
                )
            ) : paf.focus === 'prompt' ? (
                // PNG ----------------------------------------------------------
                paf.promptJSON == null ? (
                    <div>not available</div>
                ) : paf.promptJSON.success ? (
                    <JSONHighlightedCodeUI code={JSON.stringify(paf.promptJSON.value, null, 3)} />
                ) : (
                    <div>❌ promptJSON</div>
                )
            ) : null}
            {/* <TabUI>
                {paf.asAction == null
                    ? [<Button disabled>Action</Button>, <div></div>]
                    : paf.asAction.success
                    ? [<Button>🟢 Action</Button>, <ActionUI tac={paf.asAction.value} />]
                    : [<Button>❌ Action</Button>, <div>❌</div>]}

                {paf.asAutoAction == null
                    ? [<Button disabled>Action</Button>, <div></div>]
                    : paf.asAutoAction.success
                    ? [<Button>🟢 Action</Button>, <ActionUI tac={paf.asAutoAction.value} />]
                    : [<Button>❌ Action</Button>, <div>❌</div>]}
            </TabUI> */}
        </>
    )
})

export const ActionUI = observer(function ActionUI_(p: { tac: ToolAndCode }) {
    return (
        <div className='flex flex-col flex-grow'>
            {/* // <div>Tool</div> */}
            {p.tac.tools.success ? ( //
                <ToolUI tool={p.tac.tools.value[0]} />
            ) : (
                <Message type='error'>error</Message>
            )}
            {/* {p.tac.tools.success ? (
                p.tac.tools.value.map((tool, ix) => [<div>Tool {ix}</div>, <ToolUI tool={tool} />])
                ) : (
                    <Message type='error'>error</Message>
                )} */}
            {/* <div>Actions</div>
                <TypescriptHighlightedCodeUI code={p.tac.codeTS} /> */}
            {/* <TooltipUI>
                <div>Code TS</div>
                <TypescriptHighlightedCodeUI className='h-96 w-96 overflow-auto' code={p.tac.codeTS} />
            </TooltipUI>
            <TooltipUI>
                <div>Code JS</div>
                <TypescriptHighlightedCodeUI className='h-96 w-96 overflow-auto' code={p.tac.codeJS} />
            </TooltipUI> */}
        </div>
    )
})

export const DraftPaneUI = observer(function DraftPaneUI_(p: {}) {
    const pj = useProject()
    const graph = pj.rootGraph.item
    const tool = pj.activeTool.item
    const focusedDraft: Maybe<DraftL> = tool?.focusedDraft.item
    return (
        <>
            <PafUI />
            {/* {tool && <ToolUI tool={tool} />} */}
            {/* </ScrollablePaneUI> */}
        </>
    )
})

export const ToolUI = observer(function ToolUI_(p: { tool: ToolL }) {
    // const pj = useProject()
    const tool = p.tool
    const focusedDraft: Maybe<DraftL> = tool?.focusedDraft.item
    return (
        <div className='flex flex-col flex-grow'>
            {tool && <ToolDraftPickerUI tool={tool} />}
            <div className='flex-grow col mx-2'>
                {/*  */}
                {focusedDraft ? <DraftUI draft={focusedDraft} /> : <>no draft selected</>}
            </div>
        </div>
    )
})

export const ToolDraftPickerUI = observer(function ToolDraftPickerUI_(p: { tool: ToolL }) {
    const pj = useProject()
    const graph = pj.rootGraph.item
    const tool = p.tool
    const focusedDraft: Maybe<DraftL> = tool?.focusedDraft.item
    return (
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
    )
})
