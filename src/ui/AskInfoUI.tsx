import type { Requestable } from 'src/controls/askv2'

import { observer, useLocalObservable } from 'mobx-react-lite'
import { useCallback } from 'react'
import { Button, Input, MultiCascader, Panel, Toggle } from 'rsuite'
import { useSt } from '../core-front/stContext'
import { MessageFromExtensionToWebview_ask } from '../core-types/MessageFromExtensionToWebview'
import { ItemDataType } from 'rsuite/esm/@types/common'
import { PaintUI } from '../imageEditor/PaintUI'
import { BUG } from '../controls/BUG'
import { exhaust } from '../utils/ComfyUtils'

/** this is the root interraction widget
 * if a workflow need user-supplied infos, it will send an 'ask' request with a list
 * of things it needs to know.
 */
export const Execution_askUI = observer(function Execution_askUI_(p: { step: MessageFromExtensionToWebview_ask }) {
    const st = useSt()
    const uiSt = useLocalObservable(() => ({
        value: {} as any, // this value is the root response object the form will progressively fill
        locked: false, // this should be set to true once the component can no longer be interracted with
    }))

    const submit = useCallback(
        (ev: { preventDefault?: () => void; stopPropagation?: () => void }) => {
            ev.preventDefault?.()
            ev.stopPropagation?.()
            st.answerInfo(uiSt.value)
            uiSt.locked = true
        },
        [uiSt],
    )

    return (
        <Panel shaded header={<>💬 ASK</>} collapsible defaultExpanded>
            {/* widgets ------------------------------- */}
            {Object.entries(p.step.request).map(([k, v]) => (
                <div className='row items-baseline' key={k}>
                    {k} <WidgetUI req={v} />
                </div>
            ))}
            {/* submit ------------------------------- */}
            {uiSt.locked ? null : (
                <Button appearance='primary' onClick={submit}>
                    OK
                </Button>
            )}
            {/* debug -------------------------------*/}
            <pre>{JSON.stringify(p.step, null, 4)}</pre>
        </Panel>
    )
})

/** this widget will then dispatch the individual requests to the appropriate sub-widgets
 * collect the responses and submit them to the back once completed and valid.
 */
const WidgetUI = observer(function WidgetUI_(p: { req: Requestable }) {
    const req = p.req

    // array recursion
    if (Array.isArray(req))
        return (
            <div>
                {req.map((x, ix) => (
                    <WidgetUI req={x} key={ix} />
                ))}
            </div>
        )

    // forget next line, it's just to make the compiler happy somewhere else
    if (req instanceof BUG) return <div>❌ BUG</div>
    if (req.type === 'bool') return <Toggle />
    if (req.type === 'bool?') return <Toggle />
    if (req.type === 'int') return <Input type='number' value={3} />
    if (req.type === 'int?') return <Input type='number' value={4} />
    if (req.type === 'str') return <Input type='text' value={'5'} />
    if (req.type === 'str?') return <Input type='text' value={'6'} />
    if (req.type === 'paint') return <PaintUI uri={'foo bar 🔴'} />
    if (req.type === 'samMaskPoints') return <div>🌶️ {req.url}</div>
    if (req.type === 'manualMask') return <div>🌶️ {req.url}</div>
    if (req.type === 'embeddings') return <>TODO</>
    if (req.type === 'items') return <>TODO</>
    if (req.type === 'lora') return <>TODO</>
    if (req.type === 'selectMany') return <>TODO</>
    if (req.type === 'selectManyOrCustom') return <>TODO</>
    if (req.type === 'selectOne') return <>TODO</>
    if (req.type === 'selectOneOrCustom') return <>TODO</>
    if (req.type === 'loras') return <LoraWidgetUI />

    exhaust(req)
    return <div>{JSON.stringify(req)} not supported ok</div>
})

// ----------------------------------------------------------------------
export const LoraWidgetUI = observer(function LoraWidgetUI_(p: {}) {
    const st = useSt()
    const schema = st.schema
    if (schema == null) return <div>❌ no schema</div>
    const loras = schema.getLoras()
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
})
