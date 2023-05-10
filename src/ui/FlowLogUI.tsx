import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { useSt } from '../front/stContext'
import { MessageFromExtensionToWebview } from '../types/MessageFromExtensionToWebview'
import { AskInfoUI } from './AskInfoUI'
import { FlowGeneratedImagesUI } from './FlowGeneratedImagesUI'
import { MsgShowHTMLUI } from './MsgShowHTMLUI'
import { ShowFlowEndUI } from './ShowFlowEndUI'
import { ShowUpdatingNodeUI } from './ShowUpdatingNodeUI'
import { TypescriptHighlightedCodeUI } from './TypescriptHighlightedCodeUI'
import { Panel } from 'rsuite'

export const FlowLogUI = observer(function FlowLogUI_(p: {}) {
    const st = useSt()
    return (
        <div className='flex flex-col gap-4 p-4'>
            {st.groupItemsToShow.map((group, groupIx) => {
                // if (group.le)
                return (
                    <div key={groupIx} className='relative [width:100%]' style={{ overflowX: 'auto' }}>
                        {/* <div>
                            {group[0]?.type} x {group.length}
                        </div> */}
                        <div className='flex row gap-2'>
                            {group.map((msg) => {
                                const details = renderMsgUI(msg)
                                return (
                                    <Fragment key={msg.uid}>
                                        {details}
                                        {/* {details ? <div className='transition-height'>{details}</div> : null} */}
                                    </Fragment>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
})

export const renderMsgUI = (msg: MessageFromExtensionToWebview) => {
    if (msg.type === 'show-html') return <MsgShowHTMLUI key={msg.uid} msg={msg} />
    if (msg.type === 'flow-code') return <TypescriptHighlightedCodeUI key={msg.uid} code={msg.code} />
    if (msg.type === 'flow-start') return null // <Divider key={msg.uid} />
    if (msg.type === 'executing') return <ShowUpdatingNodeUI key={msg.uid} msg={msg} />
    if (msg.type === 'ask') return <AskInfoUI key={msg.uid} step={msg} />
    if (msg.type === 'print')
        return (
            <Panel collapsible defaultExpanded key={msg.uid} shaded>
                <div>
                    💬
                    {msg.message}
                </div>
            </Panel>
        )
    // if (msg.type === 'images') return <FlowGeneratedImagesUI key={msg.uid} msg={msg} />
    if (msg.type === 'flow-end') return <ShowFlowEndUI key={msg.uid} msg={msg} />
    return null
}
