import type { ActionFront } from '../../front/ActionFront'

import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Button, IconButton, Panel } from 'rsuite'
import { useSt } from '../../front/FrontStateCtx'
import { FormUI } from '../widgets/FormUI'

export const ActionPickerUI = observer(function ActionPickerUI_(p: { actionFront: ActionFront }) {
    const st = useSt()
    const XX = p.actionFront
    return (
        <div>
            {/* {p.actionFront.formState == null ? '🟢null' : '1'} */}

            <div className='flex flex-wrap gap-2'>
                {/* ({uiSt.currentActionID}) */}
                {st.ActionOptionForSelectInput.map((actionRef) => {
                    return (
                        <Button
                            startIcon={<I.PlayOutline />}
                            key={actionRef.id}
                            size='sm'
                            appearance={XX.currentActionRef?.id === actionRef.id ? 'primary' : 'ghost'}
                            color={XX.currentActionRef?.id === actionRef.id ? 'green' : undefined}
                            onClick={() => {
                                if (XX.currentActionRef?.id != actionRef.id) {
                                    XX.focusAction(actionRef)
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
            {XX.currentActionRef && (
                <FormUI
                    //
                    title={XX.currentActionRef.name}
                    formDef={XX.currentActionRef.form}
                    submit={() => XX.start()}
                    formState={XX.formState}
                />
            )}

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
                    disabled={XX.currentActionRef == null}
                    icon={<I.PlayOutline />}
                    onClick={() => {
                        if (XX.currentActionRef == null) return
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
