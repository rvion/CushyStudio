import type { Requestable } from 'src/controls/InfoRequest'
import * as I from '@rsuite/icons'

import { observer } from 'mobx-react-lite'
import { Tooltip, Whisper } from 'rsuite'
import { DraftL } from 'src/models/Draft'
import { FormPath } from 'src/models/Step'
import { BUG } from '../../../controls/InfoRequest'
import { exhaust } from '../../../utils/ComfyUtils'
import { useDraft } from '../useDraft'
import { WidgetBoolUI } from './WidgetBoolUI'
import { WidgetEnumUI } from './WidgetEnumUI'
import { WidgetItemsOptUI } from './WidgetItemsOptUI'
import { WidgetItemsUI } from './WidgetItemsUI'
import { EditorUI } from './WidgetLexical'
import { WidgetLorasUI } from './WidgetLorasUI'
import { WidgetNumOptUI } from './WidgetNumOptUI'
import { WidgetNumUI } from './WidgetNumUI'
import { WidgetSelectImageUI } from './WidgetSelectImageUI'

export const WidgetWithLabelUI = observer(function WidgetWithLabelUI_(p: {
    draft: DraftL
    path: FormPath
    req: Requestable
    rootKey: string
    ix: number
}) {
    const { draft, rootKey, req, path, ix } = p

    let tooltip: Maybe<string>
    let label: Maybe<string>
    const fullPath = p.path.join('/')
    if (Array.isArray(req)) {
        label = rootKey
    } else if (req instanceof BUG) {
        label = '❌ BUG'
        tooltip = '❌ BUG'
    } else {
        label = req.label ?? rootKey
        tooltip = req.tooltip
        if (fullPath !== label) tooltip = `${fullPath} ${tooltip ?? ''}`
    }

    return (
        <div
            // style={{ background: ix % 2 === 0 ? '#313131' : undefined }}
            className='row gap-2 items-baseline'
            key={rootKey}
        >
            <div className='w-20 min-w-max shrink-0 text-right'>
                {tooltip && (
                    <Whisper placement='topStart' speaker={<Tooltip>{tooltip}</Tooltip>}>
                        <I.InfoOutline className='mr-2 cursor-pointer' />
                    </Whisper>
                )}
                {label}
            </div>
            <WidgetUI //
                key={[draft.id, p.path].join('/')}
                path={path}
                req={req}
                focus={ix === 0}
            />
        </div>
    )
})
/** this widget will then dispatch the individual requests to the appropriate sub-widgets
 * collect the responses and submit them to the back once completed and valid.
 */
export const WidgetUI = observer(function WidgetUI_(p: {
    //
    path: FormPath
    req: Requestable
    focus?: boolean
}) {
    const draft = useDraft()
    const req = p.req

    // forget next line, it's just to make the compiler happy somewhere else
    if (req instanceof BUG) return <div>❌ BUG</div>

    // array recursion
    if (Array.isArray(req))
        return (
            <div>
                {req.map((item, ix) => (
                    <WidgetUI //
                        focus={p.focus}
                        path={[...p.path, ix]}
                        req={item}
                        key={ix}
                    />
                ))}
            </div>
        )

    // group recursion
    // if (req.type === 'items')
    //     return (
    //         <Panel collapsible title='Foo' header={'subgroup'}>
    //             {Object.entries(req.items).map(([rootKey, req], ix) => (
    //                 <div key={rootKey}>
    //                     {/* <div>{i[0]}</div> */}
    //                     <WidgetWithLabelUI //
    //                         draft={draft}
    //                         ix={ix}
    //                         rootKey={rootKey}
    //                         req={req as any}
    //                         // focus={p.focus}
    //                         // path={[...p.path, i[0]]}
    //                     />
    //                 </div>
    //             ))}
    //         </Panel>
    //     )

    // primitives
    const get = () => draft.getAtPath(p.path)
    const set = (next: any) => draft.setAtPath(p.path, next)
    const def = () => req.default
    // const finalPath = [p.path]

    // group recursion
    if (req.type === 'items') return <WidgetItemsUI get={get} set={set} path={p.path} req={req} />
    if (req.type === 'itemsOpt') return <WidgetItemsOptUI get={get} set={set} path={p.path} req={req} />
    if (req.type === 'bool') return <WidgetBoolUI get={get} set={set} optional={false} />
    if (req.type === 'bool?') return <WidgetBoolUI get={get} set={set} optional={true} />
    if (req.type === 'int') return <WidgetNumUI mode='int' get={get} set={set} def={def} />
    if (req.type === 'int?') return <WidgetNumOptUI mode='int' get={get} set={set} def={def} />
    if (req.type === 'float') return <WidgetNumUI mode='float' get={get} set={set} def={def} />
    if (req.type === 'float?') return <WidgetNumOptUI mode='float' get={get} set={set} def={def} />
    if (req.type === 'str') return <EditorUI get={get} set={set} />
    if (req.type === 'str?') return <EditorUI get={get} set={set} nullable />
    if (req.type === 'paint') return <>🔴 paint form commented</> //<WidgetPaintUI uri={'foo bar 🔴'} />
    if (req.type === 'samMaskPoints') return null // <WidgetPlacePoints url={req.imageInfo.comfyURL ?? '🔴'} get={get} set={set} />
    if (req.type === 'selectImage') return <WidgetSelectImageUI /*infos={req.imageInfos}*/ get={get} set={set} />
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
