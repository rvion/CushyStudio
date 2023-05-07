import type { Requestable } from 'src/controls/askv2'
import type { FrontState } from 'src/core-front/FrontState'

import { observer, useLocalObservable } from 'mobx-react-lite'
import { useCallback } from 'react'
import { Input, MultiCascader, Panel, Toggle } from 'rsuite'
import { useSt } from '../core-front/stContext'
import { MessageFromExtensionToWebview_ask } from '../core-types/MessageFromExtensionToWebview'
import { ItemDataType } from 'rsuite/esm/@types/common'

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
            {Object.entries(p.step.request).map(([k, v]) => (
                <div className='row' key={k}>
                    {k} {formUI(st, v)}
                </div>
            ))}
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

const formUI = (st: FrontState, p: Requestable) => {
    if (p === 'bool') return <Toggle />
    if (p === 'bool?') return <Toggle />
    if (p === 'int') return <Input type='number' value={3} />
    if (p === 'int?') return <Input type='number' value={4} />
    if (p === 'loras') {
        const schema = st.schema
        if (schema == null) return <div>❌ no schema</div>

        const loras = schema.getLoras() //.map((x) => ({ label: x, value: x }))

        const nestedLoras: ItemDataType<any>[] = []
        const insertAt = (path: string) => {
            const segments = path.split(/\\/)
            console.log(segments)
            let parent = nestedLoras
            for (let i = 0; i < segments.length - 1; i++) {
                const segment = segments[i]
                const found = parent.find((x) => x.label === segment)
                if (found == null) {
                    const newParent = { label: segment, children: [] }
                    parent.push(newParent)
                    parent = newParent.children
                } else {
                    parent = found.children!
                }
            }
        }
        for (const l of loras) {
            insertAt(l)
            console.log(l, nestedLoras)
        }

        return (
            <div>
                {/* {JSON.stringify(schema.getLoras())} */}
                <MultiCascader menuWidth={300} block data={nestedLoras} />
            </div>
        )
    }
    return <div>{JSON.stringify(p)} not supported</div>
}
