import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Button, Panel } from 'rsuite'
import { useSt } from '../core-front/stContext'
import { renderMessageFromExtensionAsEmoji } from '../core-types/MessageFromExtensionToWebview'
import { PaintUI } from '../imageEditor/PaintUI'
import { Execution_askBooleanUI } from './Execution_askBooleanUI'
import { Execution_askStringUI } from './Execution_askStringUI'

export const FlowLogUI = observer(function FlowLogUI_(p: {}) {
    const st = useSt()
    return (
        <>
            <div>
                flows:
                {st.knownWorkflows.map((i) => (
                    <Button
                        onClick={() => {
                            st.sendMessageToExtension({ type: 'run-flow', flowID: i.id })
                        }}
                        startIcon={<I.PlayOutline />}
                        key={i.id}
                    >
                        {i.name}
                    </Button>
                ))}
            </div>
            <div
                style={{
                    display: 'flex',
                    border: '1px solid red',
                    flexDirection:
                        st.flowDirection === 'down' //
                            ? 'column'
                            : 'column-reverse',
                }}
            >
                {st.received.map((msg) => (
                    <div key={msg.uid} style={{ borderBottom: '1px solid lightgray' }}>
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
                        {msg.type === 'show-html' && (
                            <div
                                ref={(e) => {
                                    if (e) {
                                        ;(window as any).mermaid.run({ querySelector: 'pre.mermaid' })
                                        // e.innerHTML = msg.content
                                    }
                                }}
                                dangerouslySetInnerHTML={{ __html: msg.content }}
                            />
                        )}
                        {msg.type === 'ask-string' && <Execution_askStringUI step={msg} />}
                        {msg.type === 'ask-boolean' && <Execution_askBooleanUI step={msg} />}
                        {msg.type === 'print' && <Panel>{msg.message}</Panel>}
                        {msg.type === 'ask-paint' && <PaintUI step={msg} />}
                        {msg.type === 'ask-paint' && <div>{msg.uri}</div>}
                        {msg.type === 'images' && msg.uris.length && (
                            <div>
                                {msg.uris.map((imgUri) => (
                                    <div key={imgUri}>
                                        <img src={imgUri} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    )
})
