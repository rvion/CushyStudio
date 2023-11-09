import * as I from '@rsuite/icons'
import * as R from 'src/controls/Widget'

import { observer } from 'mobx-react-lite'
import { ErrorBoundary } from 'react-error-boundary'
import { Message, Toggle, Tooltip, Whisper } from 'rsuite'
import { LabelPos } from 'src/controls/IWidget'
import { useSt } from 'src/state/stateContext'
import { exhaust } from '../../utils/misc/ComfyUtils'
import { ErrorBoundaryFallback } from '../../widgets/misc/ErrorBoundary'
import { WidgetPromptUI } from '../../widgets/prompter/WidgetPromptUI'
import { WidgetBoolUI } from './WidgetBoolUI'
import { WidgetChoiceUI } from './WidgetChoice'
import { WidgetChoicesUI } from './WidgetChoices'
import { WidgetColorUI } from './WidgetCololrUI'
import { WidgetEnumUI } from './WidgetEnumUI'
import { WidgetGroupUI } from './WidgetIGroupUI'
import { WidgetListUI } from './WidgetListUI'
import { WidgetLorasUI } from './WidgetLorasUI'
import { WidgetMardownUI } from './WidgetMarkdownUI'
import { WidgetMatrixUI } from './WidgetMatrixUI'
import { WidgetNumOptUI } from './WidgetNumOptUI'
import { WidgetNumUI } from './WidgetNumUI'
import { WidgetSeedUI } from './WidgetSeedUI'
import { WidgetSelectImageUI } from './WidgetSelectImageUI'
import { WidgetSelectOneUI } from './WidgetSelectOneUI'
import { WigetSizeUI } from './WidgetSizeUI'
import { WidgetStrUI } from './WidgetStrUI'

const makeNicer = (s: string) => {
    if (s == null) return ''
    if (s.length === 0) return s
    s = s.replace(/([a-z])([A-Z])/g, '$1 $2')
    s = s.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    s = s.replace(/_/g, ' ')
    s = s.replace(/([a-z])([A-Z])/g, '$1 $2')
    s = s.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    return s[0].toUpperCase() + s.slice(1)
}

export const WidgetWithLabelUI = observer(function WidgetWithLabelUI_(p: {
    req: R.Widget
    labelPos?: LabelPos
    rootKey: string
    vertical?: boolean
}) {
    const st = useSt()
    const { rootKey, req } = p
    let tooltip: Maybe<string>
    let label: Maybe<string>
    label = req.input.label ?? makeNicer(rootKey)
    tooltip = req.input.tooltip

    // const vertical = false // p.vertical
    const vertical = (() => {
        // 🔴 (do I want to let this configurable => probably not, or if so, only optionally)
        // 🔴 if (p.vertical != null) return p.vertical
        if (st.preferedFormLayout === 'auto') {
            // if (req.isOptional) return true
            if (req instanceof R.Widget_group) return true
            if (req instanceof R.Widget_groupOpt) return true
            if (req instanceof R.Widget_list) return true
            if (req instanceof R.Widget_prompt) return true
            if (req instanceof R.Widget_promptOpt) return true
            return false
        }
        if (st.preferedFormLayout === 'mobile') {
            return true
        }
        if (st.preferedFormLayout === 'dense') {
            return false
        }
        // p.vertical ?? (st.preferedFormLayout ? false : true)
    })()
    const v = p.req

    const toogle = (
        <Toggle
            //
            // size='sm'
            checked={req.state.active}
            onChange={(t) => (req.state.active = t)}
        />
    )
    const showToogle = req.isOptional || !req.state.active

    const LABEL = (
        <div
            // style={{ minWidth: '5rem' }}
            className={
                vertical //
                    ? 'min-w-max shrink-0 self-start w-full'
                    : 'min-w-max shrink-0 self-start'
            }
        >
            <div
                tw='py-0.5 rounded hover:bg-blue-500 cursor-pointer'
                onClick={() => (v.state.collapsed = !Boolean(v.state.collapsed))}
            >
                {tooltip && (
                    <Whisper placement='topStart' speaker={<Tooltip>{tooltip}</Tooltip>}>
                        <I.InfoOutline className='mr-2 cursor-pointer' />
                    </Whisper>
                )}
                <span>{label || '...'}</span> {/* {req.constructor.name} */}
                {showToogle ? toogle : null}
                {/* {req.constructor.name} */}
                <span tw='opacity-30 hover:opacity-100'>{v.state.collapsed ? '▸ {...}' : /*'▿'*/ ''}</span>
            </div>
        </div>
    )
    let WIDGET = v.state.collapsed ? null : !v.state.active ? null : ( //
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
            <WidgetUI req={req} />
        </ErrorBoundary>
    )
    const className = vertical //
        ? 'flex flex-col items-baseline'
        : 'flex flex-row items-baseline gap-1'

    if (/*st.preferedFormLayout !== 'dense'*/ vertical) {
        WIDGET = (
            <div tw='w-full' style={{ paddingLeft: '2rem' }}>
                {WIDGET}
            </div>
        )
    }
    if (p.labelPos === 'end') {
        return (
            <div tw='_WidgetWithLabelUI' className={className} key={rootKey}>
                {WIDGET}
                {LABEL}
            </div>
        )
    } else {
        return (
            <div tw='_WidgetWithLabelUI' className={className} key={rootKey}>
                {LABEL}
                {WIDGET}
            </div>
        )
    }
})

/**
 * this widget will then dispatch the individual requests to the appropriate sub-widgets
 * collect the responses and submit them to the back once completed and valid.
 */
// prettier-ignore
export const WidgetUI = observer(function WidgetUI_(p: { req: R.Widget; focus?: boolean }) {
    const req = p.req
    if (req == null) return <>NULL</>
    if (req instanceof R.Widget_seed)               return <WidgetSeedUI        req={req} />
    if (req instanceof R.Widget_int)                return <WidgetNumUI         req={req} />
    if (req instanceof R.Widget_intOpt)             return <WidgetNumOptUI      req={req} />
    if (req instanceof R.Widget_float)              return <WidgetNumUI         req={req} />
    if (req instanceof R.Widget_floatOpt)           return <WidgetNumOptUI      req={req} />
    if (req instanceof R.Widget_str)                return <WidgetStrUI         req={req} />
    if (req instanceof R.Widget_strOpt)             return <WidgetStrUI         req={req} />
    if (req instanceof R.Widget_image)              return <WidgetSelectImageUI req={req} />
    if (req instanceof R.Widget_imageOpt)           return <WidgetSelectImageUI req={req} />
    if (req instanceof R.Widget_list)               return <WidgetListUI        req={req} />
    if (req instanceof R.Widget_group)              return <WidgetGroupUI       req={req} />
    if (req instanceof R.Widget_groupOpt)           return <WidgetGroupUI       req={req} />
    if (req instanceof R.Widget_size)               return <WigetSizeUI         req={req} />
    if (req instanceof R.Widget_enum)               return <WidgetEnumUI        req={req} />
    if (req instanceof R.Widget_enumOpt)            return <WidgetEnumUI        req={req} />
    if (req instanceof R.Widget_matrix)             return <WidgetMatrixUI      req={req} />
    if (req instanceof R.Widget_bool)               return <WidgetBoolUI        req={req} />
    if (req instanceof R.Widget_prompt)             return <WidgetPromptUI      req={req} />
    if (req instanceof R.Widget_promptOpt)          return <WidgetPromptUI      req={req} />
    if (req instanceof R.Widget_loras)              return <WidgetLorasUI       req={req} />
    if (req instanceof R.Widget_color)              return <WidgetColorUI       req={req} />
    if (req instanceof R.Widget_selectOne)          return <WidgetSelectOneUI   req={req} />
    if (req instanceof R.Widget_choice)             return <WidgetChoiceUI      req={req} />
    if (req instanceof R.Widget_choices)            return <WidgetChoicesUI     req={req} />
    if (req instanceof R.Widget_markdown)           return <WidgetMardownUI     req={req} />
    if (req instanceof R.Widget_selectMany)         return <>TODO</>
    if (req instanceof R.Widget_selectManyOrCustom) return <>TODO</>
    if (req instanceof R.Widget_selectOneOrCustom)  return <>TODO</>

    exhaust(req)
    console.log(`🔴`, (req as any).type, req)
    return <Message type='error' showIcon>
        <div>{(req as any).type}</div>
        <div>{(req as any).constructor.name}</div>
        <div>{typeof (req as any)}</div>
        not supported
     </Message>
})
