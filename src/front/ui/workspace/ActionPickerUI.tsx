import { observer } from 'mobx-react-lite'
import { Fragment, useState } from 'react'
import { InputGroup, Message, SelectPicker } from 'rsuite'
import { ComfyPromptJSON } from 'src/types/ComfyPrompt'
import { useSt } from '../../FrontStateCtx'
import { useProject } from '../../ProjectCtx'
import { TypescriptHighlightedCodeUI } from '../TypescriptHighlightedCodeUI'

export const ActionPickerUI = observer(function ToolPickerUI_(p: {}) {
    const st = useSt()
    const pj = useProject()
    const db = st.db
    const tools = st.toolsSorted
    let grup = ''
    return (
        <div className='flex flex-col flex-grow'>
            {/*  */}
            <InputGroup>
                <InputGroup.Addon className='bg-black'>
                    <span className='material-symbols-outlined'>search</span>
                </InputGroup.Addon>
                <SelectPicker
                    className='grow'
                    data={tools}
                    labelKey='name'
                    valueKey='id'
                    value={pj.data.activeToolID}
                    onChange={(v) => {
                        if (v == null) return
                        const tool = db.tools.getOrThrow(v)
                        pj.focusTool(tool)
                    }}
                />
            </InputGroup>
            <div>
                {db.tools.map((tool) => {
                    const action = (
                        <div
                            className='p-1 hover:bg-gray-700 cursor-pointer text-ellipsis overflow-hidden'
                            key={tool.id}
                            onClick={() => pj.focusTool(tool)}
                            style={{
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                background: pj.activeTool.id === tool.id ? '#343e8d' : 'transparent',
                            }}
                        >
                            {tool.data.owner} / {tool.name}
                        </div>
                    )
                    if (tool.data.owner != grup) {
                        grup = tool.data.owner
                        return (
                            <Fragment key={tool.id}>
                                {/* <div
                                    //
                                    className='flex gap-1 mt-2'
                                    // style={{ borderTop: '1px solid #444444' }}
                                >
                                    <span className='material-symbols-outlined'>person_outline</span>
                                    {grup}
                                </div> */}
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
            {/* <FooBarUI /> */}
            {/* <PanelImport /> */}
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
