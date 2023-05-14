import { MessageFromExtensionToWebview } from '../../types/MessageFromExtensionToWebview'
import { FormUI } from '../FormUI'
import { observer } from 'mobx-react-lite'
import { useFlow } from '../../front/FrontFlowCtx'

export const ShowActionStartUI = observer(function ShowActionStartUI_(p: {
    msg: MessageFromExtensionToWebview & { type: 'action-start' }
}) {
    const flow = useFlow()
    const executionID = p.msg.executionID
    const actionFront = flow.actions.get(executionID)
    if (actionFront == null) return <div>actionFront==null</div>
    return (
        <div>
            {/* {JSON.stringify(actionFront.currentActionRef)} */}
            {actionFront.currentActionRef && (
                <FormUI
                    //
                    submit={() => {}}
                    formDef={actionFront.currentActionRef.form}
                    formState={actionFront.formState}
                />
            )}
        </div>
    )
})
