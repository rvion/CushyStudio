// import { VSCodeButton } from '@vscode/webview-ui-toolkit/react'
import { vscode } from '../core-front/FrontState'
import { observer } from 'mobx-react-lite'
import { renderMessageFromExtensionAsEmoji } from '../core-types/MessageFromExtensionToWebview'
import { Fragment } from 'react'

export const FooUI = observer(function FooUI_() {
    return (
        <div>
            {/* <div>{vscode.images.length} images</div> */}
            {/* {vscode.images.map((i) => (
                <div key={i}>
                    image:
                    <img src={i} />
                </div>
            ))} */}
            <div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
                {vscode.received.map((msg) => (
                    <Fragment key={msg.uid}>
                        <div style={{ display: 'flex' }}>
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
    vscode.sendMessage({ type: 'say-hello', message: 'Hey there partner! 🤠' })
}
