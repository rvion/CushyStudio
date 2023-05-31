import type { Requestable } from 'src/controls/Requestable'

import { stepContext, useStep } from '../FormCtx'

import { observer } from 'mobx-react-lite'
import { Button, Input, Panel, Popover, Whisper } from 'rsuite'
import { FormPath, StepL } from 'src/models/Step'
import { BUG } from '../../../controls/BUG'
import { exhaust } from '../../../utils/ComfyUtils'
import { ImageSelection } from './ImageSelection'
import { WidgetBoolUI } from './WidgetBoolUI'
import { WidgetEnumUI } from './WidgetEnumUI'
import { WidgetIntOptUI } from './WidgetIntOptUI'
import { WidgetIntUI } from './WidgetIntUI'
import { WidgetLorasUI } from './WidgetLorasUI'
import { WidgetPaintUI } from './WidgetPaintUI'
import { WidgetPlacePoints } from './WidgetPlacePoints'

/** this is the root interraction widget
 * if a workflow need user-supplied infos, it will send an 'ask' request with a list
 * of things it needs to know.
 */
export const StepUI = observer(function StepUI_(p: { step: StepL }) {
    const step = p.step
    // console.log({ step })
    const action = step.action.item
    if (action == null) return <>👉 pick an action</>
    const formDef = action.data.form ?? {}
    const title = action.data.name
    const locked = step.data.value != null

    return (
        <stepContext.Provider value={step}>
            <Panel header={title} shaded className='m-2 p-2'>
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
                    {locked ? (
                        <div>
                            <Button size='lg' disabled appearance='subtle'>
                                OK
                            </Button>
                        </div> // <ShowFlowEndUI msg={{}} />
                    ) : (
                        <div>
                            <Button size='lg' color='green' appearance='primary' onClick={() => step.submit()}>
                                OK
                            </Button>
                        </div>
                    )}
                    {locked ? null : (
                        <pre className='border-2 border-dashed border-orange-200 p-2'>
                            action output = {JSON.stringify(step.data.value ?? step.draft, null, 4)}
                        </pre>
                    )}
                    <div className='flex flex-col'>
                        <DebugUI title='⬇'>
                            the form definition is
                            <pre>{JSON.stringify(formDef, null, 4)}</pre>
                        </DebugUI>
                        <DebugUI title={'⬆'}>
                            the value about to be sent back to the workflow is
                            <pre>{JSON.stringify(step.draft, null, 4)}</pre>
                        </DebugUI>
                    </div>
                </div>
            </Panel>
            {/* debug -------------------------------*/}
        </stepContext.Provider>
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
    const askState = useStep()
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
    if (req.type === 'samMaskPoints') return null // <WidgetPlacePoints url={req.imageInfo.comfyURL ?? '🔴'} get={get} set={set} />
    if (req.type === 'selectImage') return <ImageSelection /*infos={req.imageInfos}*/ get={get} set={set} />
    if (req.type === 'manualMask') return null // <WidgetPlacePoints url={req.imageInfo.comfyURL ?? '🔴'} get={get} set={set} />
    if (req.type === 'embeddings') return <>TODO</>
    if (req.type === 'selectMany') return <>TODO</>
    if (req.type === 'enum') return <WidgetEnumUI autofocus={p.focus} get={get} set={set} enumName={req.enumName} />
    if (req.type === 'enum?') return <WidgetEnumUI autofocus={p.focus} get={get} set={set} enumName={req.enumName} optional />
    if (req.type === 'selectManyOrCustom') return <>TODO</>
    if (req.type === 'selectOne') return <>TODO</>
    if (req.type === 'selectOneOrCustom') return <>TODO</>
    if (req.type === 'loras') return <WidgetLorasUI get={get} set={set} />

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
