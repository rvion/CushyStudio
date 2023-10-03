import { observer } from 'mobx-react-lite'
import { IconButton, InputGroup, Message, Popover, SelectPicker, Whisper } from 'rsuite'
import { useProject } from '../../ProjectCtx'
import { useSt } from '../../FrontStateCtx'
import { TypescriptHighlightedCodeUI } from '../TypescriptHighlightedCodeUI'
import { Fragment, useState } from 'react'
import { TargetBox } from '../../../importers/TargetBox'
import { PanelImport } from '../../../importers/ImportWidget'
import { ComfyPromptJSON } from 'src/types/ComfyPrompt'

export const ActionPickerUI = observer(function ToolPickerUI_(p: {
    //
    // draft: DraftL
}) {
    const st = useSt()
    const pj = useProject()
    const db = st.db
    // const draft = p.draft
    const tools = st.toolsSorted
    let grup = ''
    return (
        <div className='flex flex-col flex-grow'>
            {/*  */}
            <InputGroup size='xs'>
                <InputGroup.Addon className='bg-black'>
                    <span className='material-symbols-outlined'>search</span>
                </InputGroup.Addon>
                <SelectPicker
                    //
                    className='grow'
                    data={tools}
                    size='xs'
                    labelKey='name'
                    valueKey='id'
                    value={pj.data.activeToolID}
                    onChange={(v) => {
                        if (v == null) return
                        // draft.update({ toolID: v })
                    }}
                />
            </InputGroup>
            <div className=''>
                {db.tools.map((tool) => {
                    const codeTS = tool.data.codeTS
                    const action = (
                        <div
                            className='pl-3 hover:bg-gray-700 cursor-pointer text-ellipsis overflow-hidden'
                            key={tool.id}
                            style={{
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                background: pj.activeTool.id === tool.id ? '#343e8d' : 'transparent',
                                fontWeight: pj.activeTool.id === tool.id ? 'bold' : 'normal',
                            }}
                            // active={focusedDraft?.tool.id === tool.id}
                            onClick={() => {
                                pj.update({ activeToolID: tool.id })
                                if (tool.focusedDraft.item == null) {
                                    tool.createDraft(pj).focus()
                                }
                                // const correspondingDraft = db.drafts.find((d) => d.tool.id === tool.id)
                                // if (correspondingDraft == null) return // 🔴
                                // graph.update({ focusedDraftID: correspondingDraft.id })
                            }}
                        >
                            {codeTS && (
                                <Whisper
                                    enterable
                                    placement='autoHorizontalStart'
                                    speaker={
                                        <Popover>
                                            <TypescriptHighlightedCodeUI code={codeTS} />
                                        </Popover>
                                    }
                                >
                                    <IconButton
                                        size='xs'
                                        icon={<span className='material-symbols-outlined text-gray-600'>code</span>}
                                        appearance='subtle'
                                    />
                                </Whisper>
                            )}
                            {tool.name}
                        </div>
                    )
                    if (tool.data.owner != grup) {
                        grup = tool.data.owner
                        return (
                            <Fragment key={tool.id}>
                                <b className='flex gap-1' style={{ borderTop: '1px solid #444444' }}>
                                    <span className='material-symbols-outlined'>person_outline</span>
                                    {grup}
                                </b>
                                {action}
                            </Fragment>
                        )
                    }
                    return action
                })}
            </div>
            <Message showIcon className='m-2' type='info'>
                Add yours now !
            </Message>
            {/* <IconButton startIcon={<span className='material-symbols-outlined'>cloud_download</span>} size='lg' className='m-1'>
                Import
            </IconButton> */}
            <FooBarUI />
            <PanelImport />
        </div>
    )
})

export const FooBarUI = observer(function FooBarUI_(p: {}) {
    const [a, set] = useState<Maybe<string>>(() => null)
    const st = useSt()
    return (
        <div>
            <input
                type='text'
                defaultValue={''}
                onChange={(e) => {
                    const val = e.target.value
                    const json = JSON.parse(val) as ComfyPromptJSON
                    const code = st.importer.convertFlowToCode(json, { title: 'test', author: 'test', preserveId: false })
                    set(code)
                }}
            />
            {a && <TypescriptHighlightedCodeUI code={a} />}
        </div>
    )
})
