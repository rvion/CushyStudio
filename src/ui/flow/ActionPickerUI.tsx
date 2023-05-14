import type { ActionDefinitionID } from 'src/back/ActionDefinition'
import type { Maybe } from 'src/utils/types'
import type { ActionFormResult } from 'src/core/Requirement'

import * as I from '@rsuite/icons'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { Button, IconButton, Panel, SelectPicker } from 'rsuite'
import { useSt } from '../../front/FrontStateCtx'
import { useFlow } from '../../front/FrontFlowCtx'
import { ActionRef } from 'src/core/KnownWorkflow'
import { AskInfoUI } from '../AskInfoUI'

export const ActionPickerUI = observer(function ActionPickerUI_() {
    const st = useSt()
    const flow = useFlow()
    const uiSt = useLocalObservable(() => ({
        currentAction: null as Maybe<ActionRef>,
        currentActionDraft: null as Maybe<ActionFormResult<any>>,
    }))
    const act = uiSt.currentAction
    return (
        <div>
            {act && (
                <Panel>
                    <h4>{uiSt.currentAction?.name}</h4>
                    <AskInfoUI
                        submit={(data) => {
                            st.sendMessageToExtension({
                                type: 'run-action',
                                flowID: flow.id,
                                actionID: act.id,
                                data: data,
                            })
                        }}
                        step={{
                            type: 'ask',
                            flowID: flow.id,
                            request: act.form,
                        }}
                    />
                </Panel>
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
                    disabled={uiSt.currentAction == null}
                    icon={<I.PlayOutline />}
                    onClick={() => {
                        if (uiSt.currentAction == null) return
                        // st.sendMessageToExtension({
                        //     type: 'run-action',
                        //     flowID: flow.id,
                        //     actionID: uiSt.currentAction.id,
                        //     data: {}, // 🔴
                        // })
                    }}
                />
            </div>
            <div className='flex flex-wrap gap-2'>
                {/* ({uiSt.currentActionID}) */}
                {st.ActionOptionForSelectInput.map((actionRef) => {
                    return (
                        <Button
                            startIcon={<I.PlayOutline />}
                            key={actionRef.id}
                            size='sm'
                            appearance={uiSt.currentAction?.id === actionRef.id ? 'primary' : 'ghost'}
                            color={uiSt.currentAction?.id === actionRef.id ? 'green' : undefined}
                            onClick={() => {
                                if (uiSt.currentAction?.id != actionRef.id) {
                                    uiSt.currentAction = actionRef
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
        </div>
    )
})
