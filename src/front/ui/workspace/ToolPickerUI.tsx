import { observer } from 'mobx-react-lite'
import { IconButton, InputGroup, Message, Popover, SelectPicker, Whisper } from 'rsuite'
import { useProject } from '../../../front/ProjectCtx'
import { useSt } from '../../FrontStateCtx'
import { TypescriptHighlightedCodeUI } from '../TypescriptHighlightedCodeUI'
import { Fragment } from 'react'

export const ToolPickerUI = observer(function ToolPickerUI_(p: {
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
                                background: pj.activeTool.id === tool.id ? '#2a2a2a' : 'transparent',
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
                                <div className='[background:#280606] flex gap-1'>
                                    <span className='material-symbols-outlined'>person_outline</span>
                                    {grup}
                                </div>
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
        </div>
    )
})
