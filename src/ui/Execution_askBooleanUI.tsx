import { observer, useLocalObservable } from 'mobx-react-lite'
import { Fragment } from 'react'
import { vscode } from '../core-front/FrontState'
import { MessageFromExtensionToWebview_askBoolean } from '../core-types/MessageFromExtensionToWebview'

export const Execution_askBooleanUI = observer(function Execution_askUI_(p: { step: MessageFromExtensionToWebview_askBoolean }) {
    const uiSt = useLocalObservable(() => ({
        locked: false,
        value: null,
    }))

    return (
        <Fragment>
            <div>{p.step.message}</div>
            {uiSt.value != null ? (
                <div>{uiSt.value ? 'YES' : 'NO'}</div>
            ) : (
                <div>
                    <button
                        autoFocus={p.step.default === true}
                        className={p.step.default === true ? 'primary' : undefined}
                        onClick={() => {
                            vscode.answerBoolean(true)
                            uiSt.locked = true
                        }}
                    >
                        Yes
                    </button>
                    <button
                        autoFocus={p.step.default === false}
                        className={p.step.default === false ? 'primary' : undefined}
                        onClick={() => {
                            vscode.answerBoolean(false)
                            uiSt.locked = true
                        }}
                    >
                        No
                    </button>
                </div>
            )}
        </Fragment>
    )
})
