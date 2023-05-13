import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Button, IconButton, SelectPicker } from 'rsuite'
import { useSt } from '../front/FrontStateCtx'

export const ActionPickerUI = observer(function WorkflowPickerUI_() {
    const st = useSt()
    return (
        <div>
            <div>
                {/* ({st.ActionOptionForSelectInput.length} actions) */}
                <SelectPicker
                    // labelKey='name'
                    // valueKey='id'
                    value={st.selectedWorkflowID}
                    onChange={(v) => (st.selectedWorkflowID = v)}
                    data={st.ActionOptionForSelectInput}
                    style={{ width: 224 }}
                />
                <IconButton
                    //
                    appearance='primary'
                    color='green'
                    disabled={st.selectedWorkflowID == null}
                    icon={<I.PlayOutline />}
                    onClick={() => {
                        if (st.selectedWorkflowID == null) return
                        st.sendMessageToExtension({ type: 'run-action', flowID: st.selectedWorkflowID })
                    }}
                />
            </div>
            <div className='flex flex-wrap gap-2'>
                {st.ActionOptionForSelectInput.map((a) => {
                    return (
                        <Button
                            size='sm'
                            appearance='ghost'
                            onClick={() => {
                                st.selectedWorkflowID = a.value
                                st.sendMessageToExtension({ type: 'run-action', flowID: st.selectedWorkflowID })
                            }}
                        >
                            <div>{a.label}</div>
                        </Button>
                    )
                })}
            </div>
        </div>
    )
})
