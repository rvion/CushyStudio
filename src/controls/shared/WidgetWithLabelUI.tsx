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
import { InstallModelBtnUI } from '../widgets/InstallModelBtnUI'
import { InstallCustomNodeBtnUI } from '../widgets/InstallCustomNodeBtnUI'

export const WidgetWithLabelUI = observer(function WidgetWithLabelUI_(p: {
    widget: R.Widget
    // labelPos?: LabelPos
    rootKey: string
    vertical?: boolean
    isTopLevel?: boolean
}) {
    const { rootKey, widget } = p
    const KLS = WidgetDI
    const st = useSt()

    let tooltip: Maybe<string> = widget.input.tooltip
    let label: Maybe<string | false> = widget.input.label ?? makeLabelFromFieldName(rootKey)

    const isVertical = (() => {
        if (p.widget.input.showID) return true
        if (st.preferedFormLayout === 'auto') return p.widget.isVerticalByDefault
        if (st.preferedFormLayout === 'mobile') return true
        if (st.preferedFormLayout === 'dense') return false
    })()

    const isCollapsible = widget.isCollapsible
    const collapsed = widget.state.collapsed && isCollapsible
    const levelClass = p.isTopLevel ? '_isTopLevel' : '_isNotTopLevel'

    const toggleInfo =
        widget instanceof KLS.Widget_bool
            ? {
                  value: widget.state.val,
                  toggle: () => {
                      runInAction(() => {
                          widget.state.val = !widget.state.val
                      })
                  },
                  //   onChange: (ev: ChangeEvent<HTMLInputElement>) => {
                  //       req.state.val = ev.target.checked
                  //       req.state.active = true
                  //   },
              }
            : {
                  value: widget.state.active,
                  toggle: () => {
                      runInAction(() => {
                          widget.state.active = !widget.state.active
                      })
                  },
                  //   onChange: (ev: ChangeEvent<HTMLInputElement>) => {
                  //       req.state.active = ev.target.checked
                  //   },
              }
    const showToogle =
        widget.isOptional || //
        !widget.state.active ||
        widget instanceof KLS.Widget_bool //

    let widgetUI =
        collapsed || widget.type === 'bool' ? null : !widget.state.active ? null : (
            <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
                <WidgetDI.WidgetUI widget={widget} />
            </ErrorBoundary>
        )

    const isBoldTitle =
        p.isTopLevel ||
        widget.type === 'group' ||
        widget.type === 'groupOpt' ||
        widget.type === 'list' ||
        widget.type === 'choices'

    // const hasNoWidget = widgetUI == null

    const LABEL = (
        <div
            tw={[
                '_WidgetLabel',
                isVertical ? 'w-full' : null,
                widgetUI == null ? 'w-full' : null,
                'min-w-max shrink-0',
                'flex items-center gap-0',
                // 'hover:bg-base-200 cursor-pointer',
                'cursor-pointer',
            ]}
            onClick={() => {
                if (widget.state.collapsed) return (widget.state.collapsed = false)
                if (!isCollapsible) {
                    if (showToogle) toggleInfo.toggle()
                    return
                }
                if (!widget.state.active) {
                    widget.state.active = true
                    return
                }
                widget.state.collapsed = true
            }}
        >
            {/* {widget.state == null ? '🟢' : '🔴'} */}
            {/* {JSON.stringify(widget.serial)} */}
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

            {/* Label ------------------------------------ */}
            {label !== false && (
                <span
                    //
                    tw={[
                        //
                        '',
                        isBoldTitle ? 'text-primary font-medium' : undefined,
                    ]}
                    style={
                        true && !isVertical //
                            ? { lineHeight: '2rem', display: 'inline-block' }
                            : { lineHeight: '2rem' }
                    }
                >
                    {label || '...'}
                    {p.widget.input.showID ? <span tw='opacity-50 italic text-sm'>#{p.widget.id.slice(0, 3)}</span> : null}
                </span>
            )}

            {/* Install Models ------------------------------------ */}
            {p.widget.input.recommandedModels ? <InstallModelBtnUI models={p.widget.input.recommandedModels} /> : null}
            {p.widget.input.customNodesByTitle ?? p.widget.input.customNodesByURI ? (
                <InstallCustomNodeBtnUI
                    //
                    customNodesByTitle={p.widget.input.customNodesByTitle}
                    customNodesByURI={p.widget.input.customNodesByURI}
                />
            ) : null}

            {/* Spacer ------------------------------------ */}
            <div tw='flex-1'></div>

            {/* Collapse ONLY Indicator ------------------------------------ */}
            <span
                onClick={(ev) => {
                    if (widget.state.collapsed) {
                        ev.stopPropagation()
                        ev.preventDefault()
                        widget.state.collapsed = false
                        return
                    }
                    if (!isCollapsible) {
                        if (showToogle) toggleInfo.toggle()
                        ev.stopPropagation()
                        ev.preventDefault()
                        return
                    }
                }}
                tw='opacity-30 hover:opacity-100'
            >
                {widget.state.collapsed ? '▸ {...}' : /*'▿'*/ ''}
            </span>
        </div>
    )

    const labelGap = label == false ? '' : 'gap-1'
    const clsX = widget.state.collapsed ? '_COLLAPSED' : ''
    // prettier-ignore
    let className = isVertical //
        ? `${clsX} __${widget.type} _WidgetWithLabelUI ${levelClass} flex flex-col items-baseline`
        : `${clsX} __${widget.type} _WidgetWithLabelUI ${levelClass} flex flex-row ${labelGap} ${isCollapsible ? 'items-baseline' : 'items-center'}` // prettier-ignore

    if (widgetUI == null) className += ' w-full'
    if (isVertical && /*WIDGET*/ true) {
        widgetUI = <div tw='w-full'>{widgetUI}</div>
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
            {widgetUI}
        </div>
    )
    // }
})
