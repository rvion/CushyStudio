import { formContext } from '../FormCtx'

import { observer } from 'mobx-react-lite'
import { Button, Panel } from 'rsuite'
import { WidgetUI } from './WidgetUI'
import { ActionL } from 'src/models/Action'
import { DebugUI } from './DebugUI'
import { ActionPickerUI } from '../flow/ActionPickerUI'

/** this is the root interraction widget
 * if a workflow need user-supplied infos, it will send an 'ask' request with a list
 * of things it needs to know.
 */
export const ActionUI = observer(function StepUI_(p: { action: ActionL }) {
    // ensure action have a tool
    const action = p.action
    const tool = action.tool.item
    if (tool == null) return <ActionPickerUI action={action} />

    // prepare basic infos
    const formDefinition = tool.data.form ?? {}
    const title = tool.data.name
    const locked = action.data.params != null

    return (
        <formContext.Provider value={action}>
            <Panel header={title} shaded>
                <div className='flex gap-2'>
                    <ActionPickerUI action={action} />
                    {/* widgets ------------------------------- */}
                    <div>
                        {Object.entries(formDefinition).map(([k, v], ix) => (
                            <div
                                // style={{ background: ix % 2 === 0 ? '#313131' : undefined }}
                                className='row gap-2 items-baseline'
                                key={k}
                            >
                                <div className='w-20 shrink-0 text-right'>{k}</div>
                                <WidgetUI path={[k]} req={v} focus={ix === 0} />
                            </div>
                        ))}
                    </div>
                    {/* submit ------------------------------- */}
                    <Button size='lg' color='green' appearance='primary' onClick={() => action.submit()}>
                        OK
                    </Button>
                    {locked ? null : (
                        <pre className='border-2 border-dashed border-orange-200 p-2'>
                            action output = {JSON.stringify(action.data.params, null, 4)}
                        </pre>
                    )}

                    {/* debug -------------------------------*/}
                    <div className='flex flex-col'>
                        <DebugUI title='⬇'>
                            the form definition is
                            <pre>{JSON.stringify(formDefinition, null, 4)}</pre>
                        </DebugUI>
                        <DebugUI title={'⬆'}>
                            the value about to be sent back to the workflow is
                            <pre>{JSON.stringify(action.data.params, null, 4)}</pre>
                        </DebugUI>
                    </div>
                </div>
            </Panel>
        </formContext.Provider>
    )
})
