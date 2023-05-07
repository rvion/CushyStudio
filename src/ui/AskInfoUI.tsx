import type { Requestable } from 'src/controls/askv2'
import { askContext, useAsk } from './AskInfoCtx'
import { AskPath, AskState } from './AskState'

import { observer } from 'mobx-react-lite'
import { useCallback, useMemo } from 'react'
import { Button, Input, InputNumber, MultiCascader, Notification, Panel, Toggle } from 'rsuite'
import { ItemDataType } from 'rsuite/esm/@types/common'
import { BUG } from '../controls/BUG'
import { useSt } from '../core-front/stContext'
import { MessageFromExtensionToWebview_ask } from '../core-types/MessageFromExtensionToWebview'
import { PaintUI } from '../imageEditor/PaintUI'
import { exhaust } from '../utils/ComfyUtils'
import WebviewPlacePoints from './widgets/WidgetImagePoints'

/** this is the root interraction widget
 * if a workflow need user-supplied infos, it will send an 'ask' request with a list
 * of things it needs to know.
 */
export const AskInfoUI = observer(function AskInfoUI_(p: { step: MessageFromExtensionToWebview_ask }) {
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
                <div className='flex flex-col items-start'>
                    <DebugUI title='request'>
                        the request made by the wofkflow is
                        <pre>{JSON.stringify(p.step)}</pre>
                    </DebugUI>
                    <DebugUI title={'draft answer'}>
                        the value about to be sent back to the workflow is
                        <pre>{JSON.stringify(askState.value)}</pre>
                    </DebugUI>
                </div>
            </Panel>
            {/* debug -------------------------------*/}
        </askContext.Provider>
    )
})

export const DebugUI = observer(function DebugUI_(p: { title: string; children: React.ReactNode }) {
    return (
        <Notification header={p.title} type='warning'>
            {p.children}
        </Notification>
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
    if (req.type === 'int') return <WidgetIntUI get={get} set={set} />
    if (req.type === 'int?') return <WidgetIntUI get={get} set={set} />
    if (req.type === 'str') return <Input type='text' value={'5'} />
    if (req.type === 'str?') return <Input type='text' value={'6'} />
    if (req.type === 'paint') return <PaintUI uri={'foo bar 🔴'} />
    if (req.type === 'samMaskPoints') return <WebviewPlacePoints url={req.url} get={get} set={set} />
    if (req.type === 'manualMask') return <WebviewPlacePoints url={req.url} get={get} set={set} />
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
export const WidgetBoolUI = observer(function WidgetBoolUI_(p: {
    //
    get: () => boolean
    set: (v: boolean) => void
}) {
    return (
        <Toggle //
            checked={p.get()}
            onChange={(checked) => p.set(checked)}
        />
    )
})
export const WidgetIntUI = observer(function WidgetBoolUI_(p: {
    //
    get: () => number
    set: (v: number) => void
}) {
    return (
        <InputNumber //
            value={p.get()}
            onChange={(next) => {
                if (typeof next != 'number') return
                p.set(next)
            }}
        />
    )
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
        // 🔶 console.log(segments)
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
        // 🔶 console.log(l, nestedLoras)
    }

    return (
        <div>
            {/* {JSON.stringify(schema.getLoras())} */}
            <MultiCascader menuWidth={300} block data={nestedLoras} />
        </div>
    )
})
