import { askContext, useAsk } from './AskInfoCtx'
import { AskPath, AskState } from './AskState'
import type { Requestable } from 'src/controls/askv2'

import { observer, useLocalObservable } from 'mobx-react-lite'
import { useCallback, useMemo } from 'react'
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
    const askState = useMemo(() => new AskState(), [])

    const submit = useCallback(
        (ev: { preventDefault?: () => void; stopPropagation?: () => void }) => {
            ev.preventDefault?.()
            ev.stopPropagation?.()
            st.answerInfo(askState.value)
            askState.locked = true
        },
        [askState],
    )

    return (
        <askContext.Provider value={askState}>
            <Panel shaded header={<>💬 ASK</>} collapsible defaultExpanded>
                {/* widgets ------------------------------- */}
                {Object.entries(p.step.request).map(([k, v]) => (
                    <div className='row items-baseline' key={k}>
                        {k} <WidgetUI path={[k]} req={v} />
                    </div>
                ))}
                {/* submit ------------------------------- */}
                {askState.locked ? null : (
                    <Button appearance='primary' onClick={submit}>
                        OK
                    </Button>
                )}
                {/* debug -------------------------------*/}
                <pre>{JSON.stringify(p.step, null, 4)}</pre>
            </Panel>
        </askContext.Provider>
    )
})

/** this widget will then dispatch the individual requests to the appropriate sub-widgets
 * collect the responses and submit them to the back once completed and valid.
 */
const WidgetUI = observer(function WidgetUI_(p: {
    //
    path: AskPath
    req: Requestable
}) {
    const askState = useAsk()
    const req = p.req

    // forget next line, it's just to make the compiler happy somewhere else
    if (req instanceof BUG) return <div>❌ BUG</div>

    // array recursion
    if (Array.isArray(req))
        return (
            <div>
                {req.map((item, ix) => (
                    <WidgetUI path={[...p.path, ix]} req={item} key={ix} />
                ))}
            </div>
        )

    // group recursion
    if (req.type === 'items') return <>TODO</>

    // primitives
    const get = () => askState.getAtPath(p.path)
    const set = (next: any) => askState.setAtPath(p.path, next)

    if (req.type === 'bool') return <WidgetBoolUI get={get} set={set} />
    if (req.type === 'bool?') return <WidgetBoolUI get={get} set={set} />
    if (req.type === 'int') return <Input type='number' value={3} />
    if (req.type === 'int?') return <Input type='number' value={4} />
    if (req.type === 'str') return <Input type='text' value={'5'} />
    if (req.type === 'str?') return <Input type='text' value={'6'} />
    if (req.type === 'paint') return <PaintUI uri={'foo bar 🔴'} />
    if (req.type === 'samMaskPoints') return <div>🌶️ {req.url}</div>
    if (req.type === 'manualMask') return <div>🌶️ {req.url}</div>
    if (req.type === 'embeddings') return <>TODO</>
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
export const WidgetBoolUI = observer(function WidgetBoolUI_(p: { get: () => boolean; set: (v: boolean) => void }) {
    return <Toggle checked={p.get()} onChange={(checked) => p.set(checked)} />
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
