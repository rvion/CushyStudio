import type { Requestable } from 'src/controls/Requestable'

import { formContext, useForm } from '../FormCtx'
import { FormPath, FormState } from '../FormState'

import { observer } from 'mobx-react-lite'
import { ReactNode, useCallback, useMemo } from 'react'
import { Button, Input, MultiCascader, Panel, Popover, Tooltip, Whisper } from 'rsuite'
import { ItemDataType } from 'rsuite/esm/@types/common'
import { FormDefinition } from 'src/core/Requirement'
import { BUG } from '../../controls/BUG'
import { useSt } from '../../front/FrontStateCtx'
import { exhaust } from '../../utils/ComfyUtils'
import { ImageSelection } from './ImageSelection'
import { WidgetPaintUI } from './WidgetPaintUI'
import { WidgetPlacePoints } from './WidgetPlacePoints'
import { WidgetEnumUI } from './WidgetEnumUI'
import { WidgetBoolUI } from './WidgetBoolUI'
import { WidgetIntUI } from './WidgetIntUI'
import { WidgetIntOptUI } from './WidgetIntOptUI'

/** this is the root interraction widget
 * if a workflow need user-supplied infos, it will send an 'ask' request with a list
 * of things it needs to know.
 */
export const FormUI = observer(function AskInfoUI_(p: {
    //
    className?: string
    title?: ReactNode
    formDef: FormDefinition
    formState?: FormState
    submit: (value: any) => void
}) {
    const st = useSt()
    const formDef = p.formDef
    const form = p.formState ?? useMemo(() => new FormState(st), [st])
    const submit = useCallback(
        (ev: { preventDefault?: () => void; stopPropagation?: () => void }) => {
            ev.preventDefault?.()
            ev.stopPropagation?.()
            // st.answerInfo(askState.value)
            p.submit(form.value)
            form.locked = true
        },
        [form],
    )

    return (
        <formContext.Provider value={form}>
            <Panel header={p.title} shaded className={`${p.className} m-2 p-2`}>
                {/* widgets ------------------------------- */}
                <div className='flex gap-2'>
                    <div>
                        {Object.entries(formDef).map(([k, v], ix) => (
                            <div
                                // style={{ background: ix % 2 === 0 ? '#313131' : undefined }}
                                className='row gap-2 items-baseline'
                                key={k}
                            >
                                <div className='w-20 shrink-0 text-right'>{k}</div>
                                <WidgetUI path={[k]} req={v} focus={ix === 0} />
                            </div>
                        ))}
                    </div>
                    {/* submit ------------------------------- */}
                    {/* <div className='flex-grow'></div> */}
                    {form.locked ? (
                        <div>
                            <Button size='lg' disabled appearance='subtle' onClick={submit}>
                                OK
                            </Button>
                        </div> // <ShowFlowEndUI msg={{}} />
                    ) : (
                        <div>
                            <Button size='lg' color='green' appearance='primary' onClick={submit}>
                                OK
                            </Button>
                        </div>
                    )}
                    {form.locked ? null : (
                        <pre className='border-2 border-dashed border-orange-200 p-2'>
                            output=
                            {JSON.stringify(form.value, null, 4)}
                        </pre>
                    )}
                    <div className='flex flex-col'>
                        <DebugUI title='⬇'>
                            the form definition is
                            <pre>{JSON.stringify(p.formDef, null, 4)}</pre>
                        </DebugUI>
                        <DebugUI title={'⬆'}>
                            the value about to be sent back to the workflow is
                            <pre>{JSON.stringify(form.value, null, 4)}</pre>
                        </DebugUI>
                    </div>
                </div>
            </Panel>
            {/* debug -------------------------------*/}
        </formContext.Provider>
    )
})

export const DebugUI = observer(function DebugUI_(p: { title: string; children: React.ReactNode }) {
    return (
        <Whisper enterable speaker={<Popover>{p.children}</Popover>}>
            <Button size='xs'>{p.title}</Button>
        </Whisper>
    )
})

/** this widget will then dispatch the individual requests to the appropriate sub-widgets
 * collect the responses and submit them to the back once completed and valid.
 */
const WidgetUI = observer(function WidgetUI_(p: {
    //
    path: FormPath
    req: Requestable
    focus?: boolean
}) {
    const askState = useForm()
    const req = p.req

    // forget next line, it's just to make the compiler happy somewhere else
    if (req instanceof BUG) return <div>❌ BUG</div>

    // array recursion
    if (Array.isArray(req))
        return (
            <div>
                {req.map((item, ix) => (
                    <WidgetUI focus={p.focus} path={[...p.path, ix]} req={item} key={ix} />
                ))}
            </div>
        )

    // group recursion
    if (req.type === 'items') return <>TODO</>

    // primitives
    const get = () => askState.getAtPath(p.path)
    const set = (next: any) => askState.setAtPath(p.path, next)

    if (req.type === 'bool') return <WidgetBoolUI get={get} set={set} optional={false} />
    if (req.type === 'bool?') return <WidgetBoolUI get={get} set={set} optional={true} />
    if (req.type === 'int') return <WidgetIntUI get={get} set={set} />
    if (req.type === 'int?') return <WidgetIntOptUI get={get} set={set} />
    if (req.type === 'str') return <WidgetStrUI get={get} set={set} />
    if (req.type === 'str?') return <WidgetStrUI get={get} set={set} nullable />
    if (req.type === 'paint') return <WidgetPaintUI uri={'foo bar 🔴'} />
    if (req.type === 'samMaskPoints') return <WidgetPlacePoints url={req.imageInfo.comfyURL ?? '🔴'} get={get} set={set} />
    if (req.type === 'selectImage') return <ImageSelection /*infos={req.imageInfos}*/ get={get} set={set} />
    if (req.type === 'manualMask') return <WidgetPlacePoints url={req.imageInfo.comfyURL ?? '🔴'} get={get} set={set} />
    if (req.type === 'embeddings') return <>TODO</>
    if (req.type === 'selectMany') return <>TODO</>
    if (req.type === 'enum') return <WidgetEnumUI autofocus={p.focus} get={get} set={set} enumName={req.enumName} />
    if (req.type === 'enum?') return <WidgetEnumUI autofocus={p.focus} get={get} set={set} enumName={req.enumName} optional />
    if (req.type === 'selectManyOrCustom') return <>TODO</>
    if (req.type === 'selectOne') return <>TODO</>
    if (req.type === 'selectOneOrCustom') return <>TODO</>
    if (req.type === 'loras') return <WidgetLorasUI />

    exhaust(req)
    console.log(`🔴`, (req as any).type)
    return <div>{JSON.stringify(req)} not supported </div>
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

// ----------------------------------------------------------------------
export const WidgetLorasUI = observer(function LoraWidgetUI_(p: {}) {
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
