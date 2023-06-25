import type { StepL } from 'src/models/Step'

import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { ButtonGroup, IconButton, Panel, Tooltip, Whisper } from 'rsuite'
import { ToolPickerUI, ActionSuggestionUI } from '../workspace/ToolPickerUI'
import { DebugUI } from './DebugUI'
import { WidgetUI } from './WidgetUI'
import { DraftL } from 'src/models/Draft'
import { draftContext } from '../useDraft'

export const ActionPlaceholderUI = observer(function ActionPlaceholderUI_(p: {}) {
    return (
        <Panel>
            <div className='flex gap-2' style={{ width: '30rem' }}>
                Executing...
            </div>
        </Panel>
    )
})
/** this is the root interraction widget
 * if a workflow need user-supplied infos, it will send an 'ask' request with a list
 * of things it needs to know.
 */
export const ActionUI = observer(function StepUI_(p: { draft: DraftL }) {
    // ensure action have a tool
    const draft = p.draft
    const tool = draft.tool.item
    // if (tool == null) return <ActionPickerUI action={action} />

    // prepare basic infos
    const formDefinition = tool?.data.form ?? {}
    const locked = draft.data.params != null

    return (
        <draftContext.Provider value={draft} key={draft.id}>
            <Panel className='relative mb-3' shaded>
                <div className='flex justify-between'>
                    <ToolPickerUI draft={draft} />
                    <ButtonGroup>
                        <IconButton
                            size='sm'
                            className='self-start'
                            color='green'
                            appearance='primary'
                            icon={<I.PlayOutline />}
                            onClick={() => draft.start()}
                        />
                        <IconButton
                            size='sm'
                            className='self-start'
                            color='blue'
                            appearance='primary'
                            icon={<I.PageNext />}
                            onClick={() => draft.start()}
                        />
                    </ButtonGroup>
                </div>
                {/* {step.id} */}
                <div className='flex gap-2' style={{ width: '30rem' }}>
                    <ActionSuggestionUI draft={draft} />
                    {/* widgets ------------------------------- */}
                    <form
                        onSubmit={(ev) => {
                            console.log('SUBMIT')
                            ev.preventDefault()
                            ev.stopPropagation()
                            draft.start()
                        }}
                    >
                        {Object.entries(formDefinition).map(([rootKey, req], ix) => {
                            const pathInfo = draft.getPathInfo([rootKey])
                            return (
                                <div
                                    // style={{ background: ix % 2 === 0 ? '#313131' : undefined }}
                                    className='row gap-2 items-baseline'
                                    key={rootKey}
                                >
                                    <div className='w-20 shrink-0 text-right'>
                                        <Whisper speaker={<Tooltip>{pathInfo}</Tooltip>}>
                                            <div>{rootKey}</div>
                                        </Whisper>
                                    </div>
                                    <WidgetUI key={pathInfo} path={[rootKey]} req={req} focus={ix === 0} />
                                </div>
                            )
                        })}
                    </form>

                    {locked ? null : (
                        <pre className='border-2 border-dashed border-orange-200 p-2'>
                            action output = {JSON.stringify(draft.data.params, null, 4)}
                        </pre>
                    )}

                    {/* debug -------------------------------*/}
                    <div className='flex absolute bottom-0 right-0'>
                        <DebugUI title='⬇'>
                            the form definition is
                            <pre>{JSON.stringify(formDefinition, null, 4)}</pre>
                        </DebugUI>
                        <DebugUI title={'⬆'}>
                            the value about to be sent back to the workflow is
                            <pre>{JSON.stringify(draft.data.params, null, 4)}</pre>
                        </DebugUI>
                    </div>
                </div>
            </Panel>
        </draftContext.Provider>
    )
})
