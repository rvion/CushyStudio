import type { FrontState } from 'src/front/FrontState'

import { MessageFromExtensionToWebview } from '../../types/MessageFromExtensionToWebview'
import { FormUI } from '../FormUI'
import { FlowGeneratedImagesUI } from '../FlowGeneratedImagesUI'
import { MsgShowHTMLUI } from '../MsgShowHTMLUI'
import { ShowFlowEndUI } from './ShowFlowEndUI'
import { ShowUpdatingNodeUI } from '../ShowUpdatingNodeUI'
import { TypescriptHighlightedCodeUI } from '../TypescriptHighlightedCodeUI'
import { Panel } from 'rsuite'

export const renderMsgUI = (
    st: FrontState,
    msg: MessageFromExtensionToWebview,
): {
    //
    ui: JSX.Element
    group?: string
    wrap?: boolean
} | null => {
    if (msg.type === 'show-html') return { ui: <MsgShowHTMLUI key={msg.uid} msg={msg} /> }
    if (msg.type === 'action-code') return { ui: <TypescriptHighlightedCodeUI key={msg.uid} code={msg.code} /> }
    if (msg.type === 'executing') return { ui: <ShowUpdatingNodeUI key={msg.uid} msg={msg} />, wrap: true }
    if (msg.type === 'ask')
        return {
            ui: <FormUI submit={(value) => st.answerInfo(value)} key={msg.uid} step={msg} />,
        }
    if (msg.type === 'print')
        return {
            ui: (
                <Panel collapsible defaultExpanded key={msg.uid} shaded>
                    <div>
                        💬
                        {msg.message}
                    </div>
                </Panel>
            ),
        }
    if (msg.type === 'images') return { ui: <FlowGeneratedImagesUI key={msg.uid} msg={msg} />, wrap: true }
    if (msg.type === 'action-start')
        return {
            ui: (
                <FormUI
                    //
                    submit={() => {}}
                    locked
                    step={{
                        type: 'ask',
                        flowID: msg.flowID,
                        form: st.knownActions.get(msg.actionID)!.form, // 🔴
                    }}
                />
            ),
        }
    if (msg.type === 'action-end') return { ui: <ShowFlowEndUI key={msg.uid} msg={msg} /> }
    return null
}
