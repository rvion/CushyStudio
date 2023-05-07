import { observer, useLocalObservable } from 'mobx-react-lite'
import { useCallback } from 'react'
import { Panel } from 'rsuite'
import { useSt } from '../core-front/stContext'
import { MessageFromExtensionToWebview_ask } from '../core-types/MessageFromExtensionToWebview'

export const Execution_askUI = observer(function Execution_askUI_(p: { step: MessageFromExtensionToWebview_ask }) {
    const st = useSt()
    const uiSt = useLocalObservable(() => ({
        value: 0 as any, // 🔴
        locked: false,
    }))
    const submit = useCallback(
        (ev: { preventDefault?: () => void; stopPropagation?: () => void }) => {
            ev.preventDefault?.()
            ev.stopPropagation?.()
            st.answerString(uiSt.value)
            uiSt.locked = true
        },
        [uiSt],
    )

    return (
        <Panel shaded header={<>💬 ASK</>} collapsible defaultExpanded>
            <pre>{JSON.stringify(p.step)}</pre>
            {/* <div className='text-xl font-bold'>{p.step.message}</div> */}
            {/* <Input
                autoFocus
                onKeyDown={(ev) => {
                    if (ev.key === 'Enter') submit(ev)
                }}
                // disabled={uiSt.locked}
                value={uiSt.value}
                onChange={(next) => (uiSt.value = next)}
            />
            {uiSt.locked ? null : (
                <Button appearance='primary' onClick={submit}>
                    OK
                </Button>
            )} */}
        </Panel>
    )
})
