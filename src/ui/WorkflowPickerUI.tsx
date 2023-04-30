import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { IconButton, SelectPicker } from 'rsuite'
import { useSt } from '../core-front/stContext'

export const WorkflowPickerUI = observer(function WorkflowPickerUI_() {
    const st = useSt()
    return (
        <>
            <SelectPicker
                labelKey='name'
                valueKey='id'
                value={st.selectedWorkflowID}
                onChange={(v) => (st.selectedWorkflowID = v)}
                data={st.knownWorkflows}
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
                    st.sendMessageToExtension({ type: 'run-flow', flowID: st.selectedWorkflowID })
                }}
            />
        </>
    )
})
