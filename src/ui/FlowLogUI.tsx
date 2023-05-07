import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { Panel } from 'rsuite'
import { useSt } from '../core-front/stContext'
import { MessageFromExtensionToWebview, renderMessageFromExtensionAsEmoji } from '../core-types/MessageFromExtensionToWebview'
import { PaintUI } from '../imageEditor/PaintUI'
import { Execution_askBooleanUI } from './Execution_askBooleanUI'
import { Execution_askStringUI } from './Execution_askStringUI'
import { FlowGeneratedImagesUI } from './FlowGeneratedImagesUI'
import { MsgShowHTMLUI } from './MsgShowHTMLUI'
import { ShowFlowEndUI } from './ShowFlowEndUI'
import { ShowUpdatingNodeUI } from './ShowUpdatingNodeUI'
import { TypescriptHighlightedCodeUI } from './TypescriptHighlightedCodeUI'
import { Execution_askUI } from './Execution_ask'

export const FlowLogUI = observer(function FlowLogUI_(p: {}) {
    const st = useSt()
    return (
        <div
            className='flex flex-col gap-1 p-2'
            style={
                {
                    // scrollSnapAlign: 'end',
                    // flexDirection: 'column-reverse',
                }
            }
        >
            {st.itemsToShow.map((msg) => {
                const details = renderMsgUI(msg)
                return (
                    <Fragment key={msg.uid}>
                        {st.showAllMessageReceived && (
                            <div className='w-full flex' id={msg.uid.toString()}>
                                <div style={{ width: '1rem' }}>{renderMessageFromExtensionAsEmoji(msg)}</div>
                                <div style={{ width: '5rem' }}>{msg.type}</div>
                                <div
                                    style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        width: '600px',
                                        color: 'gray',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {/*  */}
                                    {JSON.stringify(msg)}
                                </div>
                            </div>
                        )}
                        {details}
                        {/* {details ? <div className='transition-height'>{details}</div> : null} */}
                    </Fragment>
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
    if (msg.type === 'ask-string') return <Execution_askStringUI key={msg.uid} step={msg} />
    if (msg.type === 'ask') return <Execution_askUI key={msg.uid} step={msg} />
    if (msg.type === 'ask-boolean') return <Execution_askBooleanUI key={msg.uid} step={msg} />
    if (msg.type === 'print')
        return (
            <Panel collapsible defaultExpanded key={msg.uid} shaded>
                {msg.message}
            </Panel>
        )
    if (msg.type === 'ask-paint') return <PaintUI key={msg.uid} step={msg} />
    if (msg.type === 'images') return <FlowGeneratedImagesUI key={msg.uid} msg={msg} />
    if (msg.type === 'flow-end') return <ShowFlowEndUI key={msg.uid} msg={msg} />
    return null
}
