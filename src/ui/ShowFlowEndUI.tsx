import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Button, Message, Panel } from 'rsuite'
import { useSt } from '../core-front/stContext'
import { MessageFromExtensionToWebview } from '../core-types/MessageFromExtensionToWebview'

export const ShowFlowEndUI = observer(function ShowFlowEndUI_(p: { msg: MessageFromExtensionToWebview & { type: 'flow-end' } }) {
    const msg = p.msg
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
                            color='green'
                            startIcon={<I.PlayOutline />}
                            appearance='primary'
                            autoFocus
                            onClick={() => {
                                st.sendMessageToExtension({ type: 'run-flow', flowID: msg.flowID })
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
