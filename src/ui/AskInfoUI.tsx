import type { Requestable } from 'src/controls/Requestable'
import type { EnumValue } from '../core/Schema'

import { askContext, useAsk } from './AskInfoCtx'
import { AskPath, AskState } from './AskState'

import { observer } from 'mobx-react-lite'
import { useCallback, useMemo } from 'react'
import { Button, Input, InputNumber, MultiCascader, Panel, SelectPicker, Toggle, Tooltip, Whisper } from 'rsuite'
import { ItemDataType } from 'rsuite/esm/@types/common'
import { BUG } from '../controls/BUG'
import { useSt } from '../front/FrontStateCtx'
import { FromExtension_ask } from '../types/MessageFromExtensionToWebview'
import { PaintUI } from './widgets/PaintUI'
import { exhaust } from '../utils/ComfyUtils'
import { WebviewPlacePoints } from './widgets/WebviewPlacePoints'
import { ImageSelection } from './widgets/ImageSelection'
import { useFlow } from '../front/FrontFlowCtx'
import { ShowFlowEndUI } from './flow/ShowFlowEndUI'

/** this is the root interraction widget
 * if a workflow need user-supplied infos, it will send an 'ask' request with a list
 * of things it needs to know.
 */
export const AskInfoUI = observer(function AskInfoUI_(p: {
    //
    step: FromExtension_ask
    submit: (value: any) => void
}) {
    const st = useSt()
    const askState = useMemo(() => new AskState(), [])

    const submit = useCallback(
        (ev: { preventDefault?: () => void; stopPropagation?: () => void }) => {
            ev.preventDefault?.()
            ev.stopPropagation?.()
            // st.answerInfo(askState.value)
            p.submit(askState.value)
            askState.locked = true
        },
        [askState],
    )

    return (
        <askContext.Provider value={askState}>
            <Panel shaded>
                {/* widgets ------------------------------- */}
                <div className='flex'>
                    <div>
                        {Object.entries(p.step.request).map(([k, v], ix) => (
                            <div
                                // style={{ background: ix % 2 === 0 ? '#313131' : undefined }}
                                className='row items-start gap-2'
                                key={k}
                            >
                                <div>{k}</div>
                                <WidgetUI path={[k]} req={v} />
                            </div>
                        ))}
                        {/* submit ------------------------------- */}
                        {askState.locked ? null : ( // <ShowFlowEndUI msg={{}} />
                            <Button className='w-full' color='green' appearance='primary' onClick={submit}>
                                OK
                            </Button>
                        )}
                    </div>
                    <div className='flex flex-col items-end'>
                        <DebugUI title='⬇'>
                            the request made by the wofkflow is
                            <pre>{JSON.stringify(p.step, null, 4)}</pre>
                        </DebugUI>
                        <DebugUI title={'⬆'}>
                            the value about to be sent back to the workflow is
                            <pre>{JSON.stringify(askState.value, null, 4)}</pre>
                        </DebugUI>
                    </div>
                </div>
            </Panel>
            {/* debug -------------------------------*/}
        </askContext.Provider>
    )
})

export const DebugUI = observer(function DebugUI_(p: { title: string; children: React.ReactNode }) {
    return (
        <Whisper speaker={<Tooltip>{p.children}</Tooltip>}>
            <Button size='xs'>{p.title}</Button>
        </Whisper>
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
    if (req.type === 'str') return <WidgetStrUI get={get} set={set} />
    if (req.type === 'str?') return <WidgetStrUI get={get} set={set} nullable />
    if (req.type === 'paint') return <PaintUI uri={'foo bar 🔴'} />
    if (req.type === 'samMaskPoints') return <WebviewPlacePoints url={req.imageInfo.comfyURL ?? '🔴'} get={get} set={set} />
    if (req.type === 'selectImage') return <ImageSelection /*infos={req.imageInfos}*/ get={get} set={set} />
    if (req.type === 'manualMask') return <WebviewPlacePoints url={req.imageInfo.comfyURL ?? '🔴'} get={get} set={set} />
    if (req.type === 'embeddings') return <>TODO</>
    if (req.type === 'selectMany') return <>TODO</>
    if (req.type === 'enum') return <WidgetEnumUI get={get} set={set} enumName={req.enumName} />
    if (req.type === 'selectManyOrCustom') return <>TODO</>
    if (req.type === 'selectOne') return <>TODO</>
    if (req.type === 'selectOneOrCustom') return <>TODO</>
    if (req.type === 'loras') return <LoraWidgetUI />

    exhaust(req)
    return <div>{JSON.stringify(req)} not supported ok</div>
})

export const WidgetStrUI = observer(function WidgetStrUI_(p: {
    //
    get: () => string
    set: (v: string) => void
    nullable?: boolean
}) {
    return (
        <Input //
            type='text'
            onChange={(e) => p.set(e)}
            value={p.get()}
        />
    )
})

export const WidgetEnumUI = observer(function WidgetEnumUI_(p: {
    enumName: string
    get: () => EnumValue
    set: (v: EnumValue) => void
}) {
    const flow = useFlow()
    const schema = flow.workspace.schema
    const options = useMemo(() => {
        if (schema == null) return []
        return schema!.getEnumOptionsForSelectPicker(p.enumName)
    }, [schema])
    return (
        <SelectPicker //
            data={options}
            value={p.get()}
            onChange={(e) => {
                if (e == null) return
                p.set(e)
            }}
        />
    )
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
