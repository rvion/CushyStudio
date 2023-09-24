import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { IconButton, Panel } from 'rsuite'
import { DraftL } from 'src/models/Draft'
import { draftContext } from '../useDraft'
import { ToolPickerUI } from '../workspace/ToolPickerUI'
import { ToolSuggestionUI } from '../workspace/ToolSuggestionUI'
import { DebugUI } from './DebugUI'
import { WidgetWithLabelUI } from './WidgetUI'

/** this is the root interraction widget
 * if a workflow need user-supplied infos, it will send an 'ask' request with a list
 * of things it needs to know.
 */
export const DraftUI = observer(function StepUI_(p: { draft: DraftL }) {
    // ensure action have a tool
    const draft = p.draft
    const tool = draft.tool.item

    // prepare basic infos
    const formDefinition = tool?.data.form ?? {}
    const locked = draft.data.params != null

    return (
        <draftContext.Provider value={draft} key={draft.id}>
            <Panel className='col-form' shaded>
                <div className='flex flex-wrap'>
                    <IconButton
                        size='sm'
                        className='self-start'
                        color='green'
                        appearance='primary'
                        icon={<I.PlayOutline />}
                        onClick={() => draft.start()}
                    />
                    <ToolPickerUI draft={draft} />
                </div>
                <div className='flex gap-2'>
                    <ToolSuggestionUI draft={draft} />
                    {/* widgets ------------------------------- */}
                    <form
                        onKeyUp={(ev) => {
                            // submit on meta+enter
                            if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey)) {
                                console.log('SUBMIT')
                                ev.preventDefault()
                                ev.stopPropagation()
                                draft.start()
                            }
                        }}
                        onSubmit={(ev) => {
                            console.log('SUBMIT')
                            ev.preventDefault()
                            ev.stopPropagation()
                            draft.start()
                        }}
                    >
                        {Object.entries(formDefinition).map(([rootKey, req], ix) => {
                            // const pathInfo = draft.getPathInfo([rootKey])
                            return (
                                <WidgetWithLabelUI
                                    path={[rootKey]}
                                    key={rootKey}
                                    rootKey={rootKey}
                                    req={req}
                                    ix={ix}
                                    draft={draft}
                                />
                            )
                        })}
                    </form>

                    {locked ? null : (
                        <pre className='border-2 border-dashed border-orange-200 p-2'>
                            action output = {JSON.stringify(draft.data.params, null, 4)}
                        </pre>
                    )}

                    {/* debug -------------------------------*/}
                    <div className=''>
                        <DebugUI title='⬇'>
                            the form definition is
                            <pre className='w-80 h-80 overflow-auto'>{JSON.stringify(formDefinition, null, 4)}</pre>
                        </DebugUI>
                        <DebugUI title={'⬆'}>
                            the value about to be sent back to the workflow is
                            <pre className='w-80 h-80 overflow-auto'>{JSON.stringify(draft.data.params, null, 4)}</pre>
                        </DebugUI>
                        <DebugUI title='👀'>
                            the final answer is
                            <pre className='w-80 h-80 overflow-auto'>{JSON.stringify(draft.finalJSON, null, 4)}</pre>
                        </DebugUI>
                    </div>
                </div>
            </Panel>
        </draftContext.Provider>
    )
})

// export const ActionPlaceholderUI = observer(function ActionPlaceholderUI_(p: {}) {
//     return (
//         <Panel>
//             <div className='flex gap-2' style={{ width: '30rem' }}>
//                 Executing...
//             </div>
//         </Panel>
//     )
// })
