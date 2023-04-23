import { observer } from 'mobx-react-lite'
import { renderMessageFromExtensionAsEmoji } from '../core-types/MessageFromExtensionToWebview'
import { Fragment, useEffect } from 'react'
import { Execution_askStringUI } from './Execution_askStringUI'
import { Execution_askBooleanUI } from './Execution_askBooleanUI'
import { PaintUI } from '../imageEditor/PaintUI'
import { Button, Nav, Panel } from 'rsuite'
import { PreviewListUI } from './PreviewListUI'
import { useSt } from '../core-front/stContext'

export const WebviewUI = observer(function WebviewUI_() {
    const st = useSt()
    useEffect(() => {
        const lastMsg = st.received[st.received.length - 1]
        if (lastMsg == null) return
        const el = document.getElementById(lastMsg.uid.toString())
        if (el) el.scrollIntoView()
        else console.log('❌no el', lastMsg.uid)
    }, [st.received.length])

    return (
        <div style={{ position: 'relative' }}>
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    background: '#ebebeb',
                    // background: 'linear-gradient(45deg, #181b47, #494577)',
                }}
            >
                <Nav>
                    <Nav.Item eventKey='home'>Home</Nav.Item>
                    <Nav.Item eventKey='news'>Gallery</Nav.Item>
                    <Nav.Item eventKey='news'>Import</Nav.Item>
                    <Nav.Item eventKey='about'>About</Nav.Item>
                </Nav>
                <PreviewListUI />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {st.received.map((msg) => (
                    <Fragment key={msg.uid}>
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
                    </Fragment>
                ))}
            </div>
            <div>
                <Button
                    onClick={() => {
                        st.sendMessageToExtension({ type: 'say-hello', message: 'Hey there partner! 🤠' })
                    }}
                >
                    test!
                </Button>
            </div>
        </div>
    )
})
