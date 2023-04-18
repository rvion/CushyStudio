// import { VSCodeButton } from '@vscode/webview-ui-toolkit/react'
import { vscode } from '../core-front/FrontState'
import { observer } from 'mobx-react-lite'
import { renderMessageFromExtensionAsEmoji } from '../core-types/MessageFromExtensionToWebview'
import { Fragment, useEffect } from 'react'
import { Execution_askStringUI } from './Execution_askStringUI'
import { Execution_askBooleanUI } from './Execution_askBooleanUI'
import { PaintUI } from '../imageEditor/PaintUI'

export const WebviewUI = observer(function WebviewUI_() {
    useEffect(() => {
        const lastMsg = vscode.received[vscode.received.length - 1]
        if (lastMsg == null) return
        const el = document.getElementById(lastMsg.uid.toString())
        if (el) el.scrollIntoView()
        else console.log('❌no el', lastMsg.uid)
    }, [vscode.received.length])
    return (
        <div>
            {/* <div>{vscode.images.length} images</div> */}
            {/* {vscode.images.map((i) => (
                <div key={i}>
                    image:
                    <img src={i} />
                </div>
            ))} */}
            <div style={{ position: 'sticky', top: 0 }}>
                <div style={{ display: 'flex', overflowX: 'scroll', width: '100%', background: 'gray' }}>
                    {vscode.images.map((i) => (
                        <img style={{ objectFit: 'contain', width: '92px', height: '92px' }} key={i} src={i} />
                    ))}
                </div>
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
