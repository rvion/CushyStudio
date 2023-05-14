import type { ActionFront } from '../../front/ActionFront'

import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Button, IconButton, Panel } from 'rsuite'
import { useSt } from '../../front/FrontStateCtx'
import { FormUI } from '../FormUI'

export const ActionPickerUI = observer(function ActionPickerUI_(p: { actionFront: ActionFront }) {
    const st = useSt()
    const actionFront = p.actionFront
    const formState = actionFront.formState
    return (
        <div>
            {p.actionFront.formState == null ? '🟢null' : '1'}
            {formState && (
                <Panel>
                    <h4>{actionFront.currentActionRef?.name}</h4>
                    <FormUI submit={() => actionFront.start()} formState={formState} />
                </Panel>
            )}
            <div className='flex flex-wrap gap-2'>
                {/* ({uiSt.currentActionID}) */}
                {st.ActionOptionForSelectInput.map((actionRef) => {
                    return (
                        <Button
                            startIcon={<I.PlayOutline />}
                            key={actionRef.id}
                            size='sm'
                            appearance={actionFront.currentActionRef?.id === actionRef.id ? 'primary' : 'ghost'}
                            color={actionFront.currentActionRef?.id === actionRef.id ? 'green' : undefined}
                            onClick={() => {
                                if (actionFront.currentActionRef?.id != actionRef.id) {
                                    actionFront.focusAction(actionRef)
                                    return
                                }
                                // st.sendMessageToExtension({
                                //     type: 'run-action',
                                //     flowID: flow.id,
                                //     actionID: actionRef.id,
                                //     data: {}, // 🔴
                                // })
                            }}
                        >
                            <div>
                                {actionRef.name}
                                {/* ({actionRef.id}) */}
                            </div>
                        </Button>
                    )
                })}
            </div>
            <div>
                {/* ({st.ActionOptionForSelectInput.length} actions) */}
                {/* <SelectPicker
                    value={uiSt.currentAction.id}
                    labelKey='name'
                    valueKey='id'
                    // onChange={(v) => (uiSt.currentAction =)}
                    data={st.ActionOptionForSelectInput}
                    style={{ width: 224 }}
                /> */}
                <IconButton
                    //
                    appearance='primary'
                    color='green'
                    disabled={actionFront.currentActionRef == null}
                    icon={<I.PlayOutline />}
                    onClick={() => {
                        if (actionFront.currentActionRef == null) return
                        // st.sendMessageToExtension({
                        //     type: 'run-action',
                        //     flowID: flow.id,
                        //     actionID: uiSt.currentAction.id,
                        //     data: {}, // 🔴
                        // })
                    }}
                />
            </div>
        </div>
    )
})
