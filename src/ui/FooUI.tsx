import { VSCodeButton } from '@vscode/webview-ui-toolkit/react'
import { vscode } from '../core-front/FrontState'
import { observer } from 'mobx-react-lite'

export const FooUI = observer(function FooUI_() {
    return (
        <div>
            <div>🟢 Hello world 🔴 </div>
            <div>{vscode.images.length} images</div>
            {vscode.images.map((i) => (
                <div key={i}>
                    image:
                    <img src={i} />
                </div>
            ))}
            <div>
                received:
                <ul>
                    {vscode.received.map((i) => (
                        <li key={i}>{i}</li>
                    ))}
                </ul>
            </div>
            <div>
                <VSCodeButton onClick={handleHowdyClick}>Howdy!</VSCodeButton>
            </div>
        </div>
    )
})

export function handleHowdyClick() {
    vscode.postMessage({ type: 'say-hello', message: 'Hey there partner! 🤠' })
}
