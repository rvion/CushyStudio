import type { Requestable } from 'src/controls/askv2'
import type { FrontState } from 'src/core-front/FrontState'

import { observer, useLocalObservable } from 'mobx-react-lite'
import { useCallback } from 'react'
import { Button, Input, MultiCascader, Panel, Toggle } from 'rsuite'
import { useSt } from '../core-front/stContext'
import { MessageFromExtensionToWebview_ask } from '../core-types/MessageFromExtensionToWebview'
import { ItemDataType } from 'rsuite/esm/@types/common'
import { PaintUI } from '../imageEditor/PaintUI'
import { BUG } from '../controls/BUG'
import { exhaust } from 'src/utils/ComfyUtils'

/** this is the root interraction widget
 * if a workflow need user-supplied infos, it will send an 'ask' request with a list
 * of things it needs to know.
 * this widget will then dispatch the individual requests to the appropriate sub-widgets
 * collect the responses and submit them to the back once completed and valid.
 */
export const Execution_askUI = observer(function Execution_askUI_(p: { step: MessageFromExtensionToWebview_ask }) {
    const st = useSt()
    const uiSt = useLocalObservable(() => ({
        // this value is the root response object the form will progressively fill
        value: {} as any,
        locked: false,
    }))
    const submit = useCallback(
        (ev: { preventDefault?: () => void; stopPropagation?: () => void }) => {
            ev.preventDefault?.()
            ev.stopPropagation?.()
            // 🔴
            st.answerInfo(uiSt.value)
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
            {uiSt.locked ? null : (
                <Button appearance='primary' onClick={submit}>
                    OK
                </Button>
            )}
            {/* <div className='text-xl font-bold'>{p.step.message}</div> */}
            {/* <Input
                autoFocus
                onKeyDown={(ev) => {
                    if (ev.key === 'Enter') submit(ev)
                }}
                // disabled={uiSt.locked}
                value={uiSt.value}
                onChange={(next) => (uiSt.value = next)}
            /> */}
        </Panel>
    )
})

const formUI = (st: FrontState, p: Requestable) => {
    // array recursion
    if (Array.isArray(p))
        return (
            <div>
                Array
                {p.map((x) => formUI(st, x))}
            </div>
        )

    // TODO: explain
    if (p instanceof BUG) return <div>❌ BUG</div>

    if (p.type === 'bool') return <Toggle />
    if (p.type === 'bool?') return <Toggle />
    if (p.type === 'int') return <Input type='number' value={3} />
    if (p.type === 'int?') return <Input type='number' value={4} />
    if (p.type === 'str') return <Input type='text' value={'5'} />
    if (p.type === 'str?') return <Input type='text' value={'6'} />
    if (p.type === 'paint') return <PaintUI uri={'foo bar 🔴'} />
    if (p.type === 'samMaskPoints') return <div>🌶️ {p.url}</div>
    if (p.type === 'manualMask') return <div>🌶️ {p.url}</div>
    if (p.type === 'embeddings') return <>TODO</>
    if (p.type === 'items') return <>TODO</>
    if (p.type === 'lora') return <>TODO</>
    if (p.type === 'selectMany') return <>TODO</>
    if (p.type === 'selectManyOrCustom') return <>TODO</>
    if (p.type === 'selectOne') return <>TODO</>
    if (p.type === 'selectOneOrCustom') return <>TODO</>
    if (p.type === 'loras') {
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

    exhaust(p)
    return <div>{JSON.stringify(p)} not supported ok</div>
}
