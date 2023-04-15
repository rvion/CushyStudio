import { observer, useLocalObservable } from 'mobx-react-lite'
import { useCallback } from 'react'
import { vscode } from '../core-front/FrontState'
import { MessageFromExtensionToWebview_askString } from '../core-types/MessageFromExtensionToWebview'

export const Execution_askStringUI = observer(function Execution_askUI_(p: { step: MessageFromExtensionToWebview_askString }) {
    const uiSt = useLocalObservable(() => ({
        value: p.step.default ?? '',
        locked: false,
    }))
    const submit = useCallback(
        (ev: { preventDefault?: () => void; stopPropagation?: () => void }) => {
            ev.preventDefault?.()
            ev.stopPropagation?.()
            vscode.answerString(uiSt.value)
            uiSt.locked = true
        },
        [uiSt],
    )

    return (
        <div>
            <div>{p.step.message}</div>
            <input
                //
                autoFocus
                onKeyDown={(ev) => {
                    if (ev.key === 'Enter') submit(ev)
                }}
                disabled={uiSt.locked}
                value={uiSt.value}
                onChange={(ev) => (uiSt.value = ev.target.value)}
            />

            {uiSt.locked ? null : <button onClick={submit}>OK</button>}
        </div>
    )
})
