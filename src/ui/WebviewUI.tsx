import { vscode } from '../core-front/FrontState'
import { observer } from 'mobx-react-lite'
import { renderMessageFromExtensionAsEmoji } from '../core-types/MessageFromExtensionToWebview'
import { Fragment, useEffect } from 'react'
import { Execution_askStringUI } from './Execution_askStringUI'
import { Execution_askBooleanUI } from './Execution_askBooleanUI'
import { PaintUI } from '../imageEditor/PaintUI'
import { Nav, Tooltip, Whisper } from 'rsuite'

export const WebviewUI = observer(function WebviewUI_() {
    useEffect(() => {
        const lastMsg = vscode.received[vscode.received.length - 1]
        if (lastMsg == null) return
        const el = document.getElementById(lastMsg.uid.toString())
        if (el) el.scrollIntoView()
        else console.log('❌no el', lastMsg.uid)
    }, [vscode.received.length])
    return (
        <div style={{ position: 'relative' }}>
            <Nav>
                <Nav.Item eventKey='home'>Home</Nav.Item>
                <Nav.Item eventKey='news'>Gallery</Nav.Item>
                <Nav.Item eventKey='news'>Import</Nav.Item>
                {/* <Nav.Item eventKey='solutions'>Solutions</Nav.Item>
                <Nav.Item eventKey='products'>Products</Nav.Item> */}
                <Nav.Item eventKey='about'>About</Nav.Item>
            </Nav>
            {/* <div>{vscode.images.length} images</div> */}
            {/* {vscode.images.map((i) => (
                <div key={i}>
                    image:
                    <img src={i} />
                </div>
            ))} */}
            <div style={{ position: 'sticky', top: 0 }}>
                <PreviewListUI />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {vscode.received.map((msg) => (
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
                <button onClick={handleHowdyClick}>Howdy!</button>
            </div>
        </div>
    )
})

export function handleHowdyClick() {
    vscode.sendMessageToExtension({ type: 'say-hello', message: 'Hey there partner! 🤠' })
}

export const PreviewListUI = observer(function PreviewListUI_(p: {}) {
    return (
        <div style={{ display: 'flex', overflowX: 'scroll', width: '100%', background: 'gray' }}>
            {vscode.images.map((i) => (
                <Whisper
                    // trigger='click'
                    placement='bottomStart'
                    speaker={
                        <Tooltip>
                            <img style={{ objectFit: 'contain', maxHeight: 'unset', maxWidth: 'unset' }} key={i} src={i} />
                        </Tooltip>
                    }
                >
                    <img style={{ objectFit: 'contain', width: '92px', height: '92px' }} key={i} src={i} />
                </Whisper>
            ))}
        </div>
    )
})
