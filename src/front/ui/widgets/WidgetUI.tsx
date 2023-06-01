import type { Requestable } from 'src/controls/Requestable'
import { useForm } from '../FormCtx'
import { observer } from 'mobx-react-lite'
import { FormPath } from 'src/models/Step'
import { BUG } from '../../../controls/BUG'
import { exhaust } from '../../../utils/ComfyUtils'
import { ImageSelection } from './ImageSelection'
import { WidgetBoolUI } from './WidgetBoolUI'
import { WidgetEnumUI } from './WidgetEnumUI'
import { WidgetIntOptUI } from './WidgetIntOptUI'
import { WidgetIntUI } from './WidgetIntUI'
import { WidgetLorasUI } from './WidgetLorasUI'
import { WidgetPaintUI } from './WidgetPaintUI'
import { WidgetStrUI } from './WidgetStrUI'

/** this widget will then dispatch the individual requests to the appropriate sub-widgets
 * collect the responses and submit them to the back once completed and valid.
 */
export const WidgetUI = observer(function WidgetUI_(p: {
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
