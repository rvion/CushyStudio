import { observer, useLocalObservable } from 'mobx-react-lite'
import { Fragment } from 'react'
import { MessageFromExtensionToWebview_askString } from '../core-types/MessageFromExtensionToWebview'
import { vscode } from '../core-front/FrontState'

export const Execution_askStringUI = observer(function Execution_askUI_(p: { step: MessageFromExtensionToWebview_askString }) {
    const uiSt = useLocalObservable(() => ({
        value: p.step.default ?? '',
        locked: false,
    }))
    return (
        <Fragment>
            <div>{p.step.message}</div>
            <input disabled={uiSt.locked} value={uiSt.value} onChange={(ev) => (uiSt.value = ev.target.value)} />
            {uiSt.locked ? null : (
                // <CardFooter>{p.step.value}</CardFooter>
                <button onClick={() => vscode.sendMessageToExtension({ type: 'answer-string', value: uiSt.value })}>OK</button>
            )}
        </Fragment>
    )
})
