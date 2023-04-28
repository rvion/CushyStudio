import { observer } from 'mobx-react-lite'
import { Panel } from 'rsuite'
import { useSt } from '../core-front/stContext'
import { MessageFromExtensionToWebview, renderMessageFromExtensionAsEmoji } from '../core-types/MessageFromExtensionToWebview'
import { PaintUI } from '../imageEditor/PaintUI'
import { Execution_askBooleanUI } from './Execution_askBooleanUI'
import { Execution_askStringUI } from './Execution_askStringUI'
import { ComfyNodeUI } from './NodeListUI'

export const FlowLogUI = observer(function FlowLogUI_(p: {}) {
    const st = useSt()
    return (
        <>
            <div
                style={{
                    display: 'flex',
                    padding: '1rem',
                    flexDirection:
                        st.flowDirection === 'down' //
                            ? 'column'
                            : 'column-reverse',
                }}
            >
                {st.received.map((msg) => {
                    // if (msg.type === 'progress') return null
                    return (
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
                            {msg.type === 'executing' && <FooBarUI msg={msg} />}
                            {msg.type === 'ask-string' && <Execution_askStringUI step={msg} />}
                            {msg.type === 'ask-boolean' && <Execution_askBooleanUI step={msg} />}
                            {msg.type === 'print' && <Panel>{msg.message}</Panel>}
                            {msg.type === 'ask-paint' && <PaintUI step={msg} />}
                            {msg.type === 'ask-paint' && <div>{msg.uri}</div>}
                            {msg.type === 'images' && msg.uris.length && (
                                <div style={{ textAlign: 'center' }}>
                                    {msg.uris.map((imgUri) => (
                                        <div key={imgUri}>
                                            <img style={{ margin: '.1rem 0' }} src={imgUri} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </>
    )
})

export const FooBarUI = observer(function FooBarUI_(p: { msg: MessageFromExtensionToWebview }) {
    const st = useSt()
    // ensure it's an executing
    const msg = p.msg
    if (msg.type !== 'executing') return <>not an executing</>

    // get graph
    const graph = st.XXXX.get(p.msg.uid)
    if (graph == null) return <>No graph</>

    // get node
    const nodeID = msg.data.node
    const node = graph.nodesIndex.get(msg.data.node)
    if (node == null) return <>no node</>

    // show the node
    return (
        <div>
            <ComfyNodeUI node={node} />
        </div>
    )
})
