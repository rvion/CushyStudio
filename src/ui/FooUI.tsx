// import { VSCodeButton } from '@vscode/webview-ui-toolkit/react'
import { vscode } from '../core-front/FrontState'
import { observer } from 'mobx-react-lite'
import { renderMessageFromExtensionAsEmoji } from '../core-types/MessageFromExtensionToWebview'

export const FooUI = observer(function FooUI_() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
            <div>{vscode.images.length} images</div>
            {/* {vscode.images.map((i) => (
                <div key={i}>
                    image:
                    <img src={i} />
                </div>
            ))} */}
            <div>
                received:
                <ul>
                    {vscode.received.map((i) => (
                        <li key={i.uid}>
                            {renderMessageFromExtensionAsEmoji(i)}
                            {i.type}
                            {i.type === 'images' && i.uris.length && (
                                <div>
                                    {i.uris.map((i) => (
                                        <div key={i}>
                                            <img src={i} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
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
