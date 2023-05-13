import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Button, Message, Panel } from 'rsuite'
import { useSt } from '../../front/FrontStateCtx'
import { MessageFromExtensionToWebview } from '../../types/MessageFromExtensionToWebview'
import { useFlow } from '../../front/FrontFlowCtx'

export const ShowFlowEndUI = observer(function ShowFlowEndUI_(p: {
    msg: MessageFromExtensionToWebview & { type: 'action-end' }
}) {
    const msg = p.msg
    const flow = useFlow()
    const st = useSt()
    return (
        <Panel shaded>
            <Message
                showIcon
                type={msg.status === 'failure' ? 'error' : 'success'}
                header={
                    <div>
                        {/* {msg.status} */}
                        <Button
                            startIcon={<I.PlayOutline />}
                            // appearance='primary'
                            size='sm'
                            onClick={() => {
                                st.sendMessageToExtension({
                                    type: 'run-action',
                                    flowID: flow.id,
                                    actionID: msg.actionID,
                                })
                            }}
                        >
                            Run Again
                            {/* ({msg.flowRunID}) */}
                        </Button>
                    </div>
                }
            ></Message>
        </Panel>
    )
})
