import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { Divider, Panel } from 'rsuite'
import { useSt } from '../core-front/stContext'
import { MessageFromExtensionToWebview, renderMessageFromExtensionAsEmoji } from '../core-types/MessageFromExtensionToWebview'
import { PaintUI } from '../imageEditor/PaintUI'
import { Execution_askBooleanUI } from './Execution_askBooleanUI'
import { Execution_askStringUI } from './Execution_askStringUI'
import { FlowGeneratedImagesUI } from './FlowGeneratedImagesUI'
import { MsgShowHTMLUI } from './MsgShowHTMLUI'
import { ShowUpdatingNodeUI } from './ShowUpdatingNodeUI'
import { TypescriptHighlightedCodeUI } from './TypescriptHighlightedCodeUI'
import { ShowFlowEndUI } from './ShowFlowEndUI'

export const FlowLogUI = observer(function FlowLogUI_(p: {}) {
    const st = useSt()
    const flexDirection = st.flowDirection === 'down' ? 'column' : 'column-reverse'
    return (
        <>
            <div style={{ display: 'flex', gap: '.5rem', flexDirection: flexDirection, padding: '1rem' }}>
                {st.received.map((msg) => {
                    // if (msg.type === 'progress') return null
                    const details = renderMsgUI(msg)
                    return (
                        <Fragment key={msg.uid}>
                            {st.showAllMessageReceived && (
                                <div style={{ display: 'flex' }} id={msg.uid.toString()}>
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
                            {details ? <div className='transition-height'>{details}</div> : null}
                        </Fragment>
                    )
                })}
            </div>
        </>
    )
})

export const renderMsgUI = (msg: MessageFromExtensionToWebview) => {
    if (msg.type === 'show-html') return <MsgShowHTMLUI msg={msg} />
    if (msg.type === 'flow-code') return <TypescriptHighlightedCodeUI code={msg.code} />
    if (msg.type === 'flow-start') return <Divider />
    if (msg.type === 'flow-end') return <ShowFlowEndUI msg={msg} />
    if (msg.type === 'executing') return <ShowUpdatingNodeUI msg={msg} />
    if (msg.type === 'ask-string') return <Execution_askStringUI step={msg} />
    if (msg.type === 'ask-boolean') return <Execution_askBooleanUI step={msg} />
    if (msg.type === 'print') return <Panel shaded>{msg.message}</Panel>
    if (msg.type === 'ask-paint') return <PaintUI step={msg} />
    if (msg.type === 'images') return <FlowGeneratedImagesUI msg={msg} />
    return null
}
