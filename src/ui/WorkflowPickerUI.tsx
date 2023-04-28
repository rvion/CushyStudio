import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { IconButton, SelectPicker } from 'rsuite'
import { useSt } from '../core-front/stContext'
import { Fragment } from 'react'

export const WorkflowPickerUI = observer(function WorkflowPickerUI_() {
    const st = useSt()
    return (
        <Fragment>
            <SelectPicker
                labelKey='name'
                valueKey='id'
                value={st.selectedWorkflowID}
                onChange={(v) => {
                    st.selectedWorkflowID = v
                }}
                data={st.knownWorkflows}
                style={{ width: 224 }}
            />
            <IconButton
                //
                appearance='primary'
                color='green'
                disabled={st.selectedWorkflowID == null}
                onClick={() => {
                    if (st.selectedWorkflowID == null) return
                    st.sendMessageToExtension({ type: 'run-flow', flowID: st.selectedWorkflowID })
                }}
                icon={<I.PlayOutline />}
            />
        </Fragment>
    )
})
