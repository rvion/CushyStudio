import * as R from 'src/controls/Widget'
import { observer } from 'mobx-react-lite'
import { ErrorBoundary } from 'react-error-boundary'
import { Toggle, Tooltip, Whisper } from 'src/rsuite/shims'
import { LabelPos } from 'src/controls/IWidget'
import { useSt } from 'src/state/stateContext'
import { ErrorBoundaryFallback } from '../../widgets/misc/ErrorBoundary'
import { WidgetUI } from './WidgetUI'

export const WidgetWithLabelUI = observer(function WidgetWithLabelUI_(p: {
    req: R.Widget
    labelPos?: LabelPos
    rootKey: string
    vertical?: boolean
    isTopLevel?: boolean
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
            if (req instanceof R.Widget_str && req.input.textarea) return true
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
    const levelClass = p.isTopLevel ? '_isTopLevel' : '_isNotTopLevel'
    const toogle = (
        <Toggle //
            color='green'
            checked={req.state.active}
            onChange={(ev) => (req.state.active = ev.target.checked)}
        />
    )
    const showToogle = req.isOptional || !req.state.active

    let WIDGET = v.state.collapsed ? null : !v.state.active ? null : ( //
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
            <WidgetUI req={req} />
        </ErrorBoundary>
    )

    const LABEL = (
        <div
            tw={[
                vertical //
                    ? '_WidgetLabel w-full'
                    : '_WidgetLabel ',
                WIDGET == null ? 'w-full' : null,
                'min-w-max shrink-0 self-start',
                'flex items-center gap-1',
                'hover:bg-base-200 cursor-pointer',
            ]}
            onClick={() => {
                if (v.state.collapsed) {
                    v.state.collapsed = !Boolean(v.state.collapsed)
                    return
                }
                if (!v.state.active) return
                v.state.collapsed = !Boolean(v.state.collapsed)
            }}
        >
            {tooltip && (
                <Whisper placement='topStart' speaker={<Tooltip>{tooltip}</Tooltip>}>
                    <span className='material-symbols-outlined'>info</span>
                </Whisper>
            )}
            <span
                //
                tw={[p.isTopLevel && vertical ? 'font-bold' : undefined]}
                style={
                    true && !vertical //
                        ? {
                              //   minWidth: '5rem',
                              display: 'inline-block',
                              //   textAlign: 'right' /*marginRight: '.5rem'*/,
                          }
                        : {}
                }
            >
                {label || '...'}
            </span>{' '}
            {/* {req.constructor.name} */}
            {showToogle ? toogle : null}
            {/* {req.constructor.name} */}
            <span tw='opacity-30 hover:opacity-100'>{v.state.collapsed ? '▸ {...}' : /*'▿'*/ ''}</span>
        </div>
    )

    let className = vertical //
        ? `_WidgetWithLabelUI ${levelClass} flex flex-col items-baseline`
        : `_WidgetWithLabelUI ${levelClass} flex flex-row items-baseline gap-1`

    if (WIDGET == null) className += ' w-full'
    if (/*st.preferedFormLayout !== 'dense'*/ vertical && WIDGET) {
        WIDGET = (
            <div tw='w-full' style={{ padding: '0 1rem 0 2rem' }}>
                {/* topLevel: {p.isTopLevel ? 'true' : JSON.stringify(req.input)} */}
                {WIDGET}
            </div>
        )
    }
    if (p.labelPos === 'end') {
        return (
            <div className={className} key={rootKey}>
                {WIDGET}
                {LABEL}
            </div>
        )
    } else {
        return (
            <div className={className} key={rootKey}>
                {LABEL}
                {WIDGET}
            </div>
        )
    }
})

export function makeNicer(s: string): string {
    if (s == null) return ''
    if (s.length === 0) return s
    s = s.replace(/([a-z])([A-Z])/g, '$1 $2')
    s = s.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    s = s.replace(/_/g, ' ')
    s = s.replace(/([a-z])([A-Z])/g, '$1 $2')
    s = s.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    return s[0].toUpperCase() + s.slice(1)
}
