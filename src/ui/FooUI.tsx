import { VSCodeButton } from '@vscode/webview-ui-toolkit/react'
import { vscode } from './vscodeClientWrapper'
import { observer } from 'mobx-react-lite'
import { handleHowdyClick } from './main'

export const FooUI = observer(function FooUI_() {
    return (
        <div>
            <div>🟢 Hello world 🔴 </div>
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
