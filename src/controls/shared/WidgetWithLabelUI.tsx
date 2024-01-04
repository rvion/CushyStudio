import type { LabelPos } from 'src/controls/IWidget'
import type * as R from 'src/controls/Widget'

import { observer } from 'mobx-react-lite'

import { runInAction } from 'mobx'
import { ErrorBoundary } from 'react-error-boundary'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { Tooltip } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { makeLabelFromFieldName } from '../../utils/misc/makeLabelFromFieldName'
import { ErrorBoundaryFallback } from '../../widgets/misc/ErrorBoundary'
import { WidgetDI } from '../widgets/WidgetUI.DI'

export const WidgetWithLabelUI = observer(function WidgetWithLabelUI_(p: {
    req: R.Widget
    // labelPos?: LabelPos
    rootKey: string
    vertical?: boolean
    isTopLevel?: boolean
}) {
    const { rootKey, req } = p
    const KLS = WidgetDI
    const st = useSt()

    let tooltip: Maybe<string> = req.input.tooltip
    let label: Maybe<string | false> = req.input.label ?? makeLabelFromFieldName(rootKey)

    const isVertical = (() => {
        if (p.req.input.showID) return true
        if (st.preferedFormLayout === 'auto') return p.req.isVerticalByDefault
        if (st.preferedFormLayout === 'mobile') return true
        if (st.preferedFormLayout === 'dense') return false
    })()

    const isCollapsible = req.isCollapsible
    const collapsed = req.state.collapsed && isCollapsible
    const v = p.req
    const levelClass = p.isTopLevel ? '_isTopLevel' : '_isNotTopLevel'

    const toggleInfo =
        req instanceof KLS.Widget_bool
            ? {
                  value: req.state.val,
                  toggle: () => {
                      runInAction(() => {
                          req.state.val = !req.state.val
                      })
                  },
                  //   onChange: (ev: ChangeEvent<HTMLInputElement>) => {
                  //       req.state.val = ev.target.checked
                  //       req.state.active = true
                  //   },
              }
            : {
                  value: req.state.active,
                  toggle: () => {
                      runInAction(() => {
                          req.state.active = !req.state.active
                      })
                  },
                  //   onChange: (ev: ChangeEvent<HTMLInputElement>) => {
                  //       req.state.active = ev.target.checked
                  //   },
              }
    const showToogle =
        req.isOptional || //
        !req.state.active ||
        req instanceof KLS.Widget_bool //

    let WIDGET = collapsed ? null : !v.state.active ? null : ( //
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
            <WidgetDI.WidgetUI widget={req} />
        </ErrorBoundary>
    )

    const LABEL = (
        <div
            tw={[
                '_WidgetLabel',
                isVertical ? 'w-full' : null,
                WIDGET == null ? 'w-full' : null,
                'min-w-max shrink-0',
                'flex items-center gap-0',
                'hover:bg-base-200 cursor-pointer',
            ]}
            onClick={() => {
                if (v.state.collapsed) return (v.state.collapsed = false)
                if (!isCollapsible) {
                    if (showToogle) toggleInfo.toggle()
                    return
                }
                if (!v.state.active) {
                    v.state.active = true
                    return
                }
                v.state.collapsed = true
            }}
        >
            {showToogle && (
                <div
                    style={{ width: '1.3rem', height: '1.3rem' }}
                    tw={[
                        toggleInfo.value ? 'bg-primary' : null,
                        //
                        'virtualBorder',
                        'rounded mr-2',
                        'cursor-pointer',
                    ]}
                    tabIndex={-1}
                    onClick={(ev) => {
                        ev.stopPropagation()
                        toggleInfo.toggle()
                    }}
                >
                    {toggleInfo.value ? <span className='material-symbols-outlined text-primary-content'>check</span> : null}
                </div>
            )}
            {tooltip && (
                <RevealUI>
                    <span className='material-symbols-outlined'>info</span>
                    <Tooltip>{tooltip}</Tooltip>
                </RevealUI>
            )}
            {label !== false && (
                <span
                    //
                    tw={[
                        //
                        '',
                        p.isTopLevel ? 'text-primary font-bold' : undefined,
                    ]}
                    style={
                        true && !isVertical //
                            ? { lineHeight: '2rem', display: 'inline-block' }
                            : { lineHeight: '2rem' }
                    }
                >
                    {label || '...'}
                    {p.req.input.showID ? <span tw='opacity-50 italic text-sm'>#{p.req.id.slice(0, 3)}</span> : null}
                </span>
            )}
            <span tw='opacity-30 hover:opacity-100'>{v.state.collapsed ? '▸ {...}' : /*'▿'*/ ''}</span>
        </div>
    )

    const labelGap = label == false ? '' : 'gap-1'
    const clsX = v.state.collapsed ? '_COLLAPSED' : ''
    // prettier-ignore
    let className = isVertical //
        ? `${clsX} __${req.type} _WidgetWithLabelUI ${levelClass} flex flex-col items-baseline`
        : `${clsX} __${req.type} _WidgetWithLabelUI ${levelClass} flex flex-row ${labelGap} ${isCollapsible ? 'items-baseline' : 'items-center'}` // prettier-ignore

    if (WIDGET == null) className += ' w-full'
    if (isVertical && /*WIDGET*/ true) {
        WIDGET = <div tw='w-full'>{WIDGET}</div>
        // return (
        //     <fieldset className={className} key={rootKey}>
        //         <legend>{LABEL}</legend>
        //         {WIDGET}
        //     </fieldset>
        // )
    }
    // if (p.labelPos === 'end') {
    //     return (
    //         <div tw='FIELD [padding-left:0.3rem]' className={className} key={rootKey}>
    //             {WIDGET}
    //             {LABEL}
    //         </div>
    //     )
    // } else {
    return (
        <div tw='FIELD [padding-left:0.3rem]' className={className} key={rootKey}>
            {LABEL}
            {WIDGET}
        </div>
    )
    // }
})
