import type * as R from 'src/controls/Widget'

import { observer } from 'mobx-react-lite'

import { runInAction } from 'mobx'
import { ErrorBoundary } from 'react-error-boundary'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { Tooltip } from 'src/rsuite/shims'
import { makeLabelFromFieldName } from '../../utils/misc/makeLabelFromFieldName'
import { ErrorBoundaryFallback } from '../../widgets/misc/ErrorBoundary'
import { InstallCustomNodeBtnUI } from '../../wiki/ui/InstallCustomNodeBtnUI'
import { InstallModelBtnUI } from '../misc/InstallModelBtnUI'
import { WidgetDI } from '../widgets/WidgetUI.DI'
import { AnimatedSizeUI } from '../widgets/choices/AnimatedSizeUI'
const KLS = WidgetDI

export const WidgetWithLabelUI = observer(function WidgetWithLabelUI_(p: {
    widget: R.Widget
    rootKey: string
    isTopLevel?: boolean
    inline?: boolean
}) {
    const { rootKey, widget } = p

    if (WidgetDI.WidgetUI == null) return <>WidgetDI.WidgetUI is null</>
    const { WidgetLineUI, WidgetBlockUI } = WidgetDI.WidgetUI(widget) // WidgetDI.WidgetUI(widget)
    const isCollapsible = WidgetBlockUI != null
    const collapsed = widget.serial.collapsed && isCollapsible
    if (widget instanceof KLS.Widget_group && Object.keys(widget.values).length === 0) return
    const className = '' // `${clsX} __${widget.type} ${levelClass} flex flex-col items-baseline`

    const onLineClick = () => {
        if (widget.serial.collapsed) return (widget.serial.collapsed = false)
        if (isCollapsible) {
            if (widget.serial.collapsed) widget.serial.collapsed = false
            else widget.serial.collapsed = true
        }
    }
    return (
        <div
            tw={[
                //
                WidgetBlockUI && 'WIDGET-WITH-BLOCK',
                p.isTopLevel ? 'TOP-LEVEL-FIELD' : 'SUB-FIELD',
                widget.type,
            ]}
            className={className}
            key={rootKey}
        >
            <AnimatedSizeUI>
                {/* LINE */}
                <div tw='WIDGET-LINE flex items-center gap-0.5'>
                    {(collapsed || isCollapsible) && <Widget_CollapseBtnUI widget={p.widget} />}
                    <span
                        tw={[
                            //
                            'flex justify-end',
                            p.isTopLevel ? 'font-bold' : 'text-base',
                            'flex-none items-center text-primary',
                            // 'whitespace-nowrap',
                            // WidgetBlockUI ? undefined : 'shrink-0 text-right mr-1',
                        ]}
                        style={
                            WidgetBlockUI || p.inline
                                ? undefined
                                : {
                                      flexShrink: 0,
                                      minWidth: '8rem',
                                      textAlign: 'right',

                                      width: WidgetLineUI ? '30%' : undefined,
                                      marginRight: WidgetLineUI ? '0.25rem' : undefined,
                                  }
                        }
                    >
                        <Widget_ToggleUI widget={p.widget} />
                        {p.widget.config.recommandedModels && <InstallModelBtnUI models={p.widget.config.recommandedModels} />}
                        <InstallCustomNodeBtnUI recomandation={p.widget.config} />
                        {widget.config.tooltip && <WidgetTooltipUI widget={p.widget} />}
                        <span onClick={onLineClick} style={{ lineHeight: '1rem' }}>
                            {widget.config.label ?? makeLabelFromFieldName(p.rootKey) ?? '...'}
                        </span>
                        {/* {widget.serial.collapsed ? <span className='material-symbols-outlined'>keyboard_arrow_right</span> : null} */}
                        {/* {widget.serial.collapsed ? '{...}' : null} */}
                        {p.widget.config.showID ? <span tw='opacity-50 italic text-sm'>#{p.widget.id.slice(0, 3)}</span> : null}
                    </span>
                    {/* )} */}
                    {WidgetLineUI && (
                        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
                            <WidgetLineUI widget={widget} />
                        </ErrorBoundary>
                    )}
                </div>

                {/* BLOCK */}
                {WidgetBlockUI && !collapsed && (
                    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
                        <div tw='WIDGET-BLOCK'>
                            <WidgetBlockUI widget={widget} />
                        </div>
                    </ErrorBoundary>
                )}
            </AnimatedSizeUI>
        </div>
    )
})

export const Widget_CollapseBtnUI = observer(function Widget_CollapseBtnUI_(p: { widget: R.Widget }) {
    const widget = p.widget
    return (
        <span
            tw={'opacity-30 hover:opacity-100 cursor-pointer'}
            onClick={(ev) => {
                ev.stopPropagation()
                ev.preventDefault()
                if (widget.serial.collapsed) widget.serial.collapsed = false
                else widget.serial.collapsed = true
            }}
            //
            className='material-symbols-outlined'
            style={{ lineHeight: '1em' }}
        >
            {widget.serial.collapsed ? 'keyboard_arrow_right' : 'keyboard_arrow_down'}
        </span>
    )
})

// export const Widget_LabelUI = observer(function Widget_LabelUI_(p: {
//     //
//     rootKey: string
//     widget: R.Widget
//     isTopLevel?: boolean
// }) {
//     const widget = p.widget
//     if (widget.config.label == false) return null
//     // isBoldTitle ? 'text-primary font-medium' : undefined,
//     // style={
//     //     true && !isVertical //
//     //         ? { lineHeight: '2rem', display: 'inline-block' }
//     //         : { lineHeight: '2rem' }
//     // }
//     return (
//         <span
//             tw={[
//                 //
//                 p.isTopLevel ? 'font-bold' : 'text-base',
//                 'whitespace-nowrap',
//                 'flex-none items-center text-primary',
//                 'min-w-20 text-right mr-1',
//             ]}
//         >
//             {widget.config.label ?? makeLabelFromFieldName(p.rootKey) ?? '...'}
//             {/* {widget.serial.collapsed ? <span className='material-symbols-outlined'>keyboard_arrow_right</span> : null} */}
//             {/* {widget.serial.collapsed ? '{...}' : null} */}
//             {p.widget.config.showID ? <span tw='opacity-50 italic text-sm'>#{p.widget.id.slice(0, 3)}</span> : null}
//         </span>
//     )
// })

export const Widget_ToggleUI = observer(function Widget_ToggleUI_(p: { widget: R.Widget }) {
    const widget = p.widget
    if (!(widget instanceof KLS.Widget_bool || widget instanceof KLS.Widget_optional)) return null
    const isActive = widget.serial.active
    const toggle = () => runInAction(widget.toggle)
    return (
        <div
            style={{ width: '1.3rem', height: '1.3rem' }}
            tw={[isActive ? 'bg-primary' : null, 'virtualBorder', 'rounded mr-1', 'cursor-pointer']}
            tabIndex={-1}
            onClick={(ev) => {
                ev.stopPropagation()
                toggle()
            }}
        >
            {isActive ? <span className='material-symbols-outlined text-primary-content'>check</span> : null}
        </div>
    )
})

export const WidgetTooltipUI = observer(function WidgetTooltipUI_(p: { widget: R.Widget }) {
    const widget = p.widget
    return (
        <RevealUI>
            <div className='btn btn-sm btn-square btn-ghost'>
                <span className='material-symbols-outlined'>info</span>
            </div>
            <Tooltip>{widget.config.tooltip}</Tooltip>
        </RevealUI>
    )
})

// const st = useSt()
// let tooltip: Maybe<string> = widget.config.tooltip
// let label: Maybe<string | false> = widget.config.label ?? makeLabelFromFieldName(rootKey)
// const isVertical = (() => {
//     if (p.widget.config.showID) return true
//     if (st.preferedFormLayout === 'auto') return p.widget.isVerticalByDefault
//     if (st.preferedFormLayout === 'mobile') return true
//     if (st.preferedFormLayout === 'dense') return false
// })()
// verticalLabels?: boolean
// const isCollapsed = widget.serial.collapsed
// const isBoldTitle = p.isTopLevel || isVertical
// const showListControls = !isCollapsed && (widget instanceof KLS.Widget_listExt || widget instanceof KLS.Widget_list)
// const showFoldIndicator = /*!widget.serial.active ||*/ !widget.serial.collapsed && !widget.isCollapsible
// const labelGap = label == false ? '' : 'gap-1'
// prettier-ignore
// let className = isVertical //
//     ? `${clsX} __${widget.type} _WidgetWithLabelUI ${levelClass} flex flex-col items-baseline`
//     : `${clsX} __${widget.type} _WidgetWithLabelUI ${levelClass} flex flex-row ${labelGap} ${isCollapsible ? 'items-baseline' : 'items-center'}` // prettier-ignore
// if (widgetUI == null) className += ' w-full'
// if (isVertical) widgetUI = <div tw='w-full'>{widgetUI}</div>

// const isCollapsible = widget.isCollapsible
// const levelClass = p.isTopLevel ? '_isTopLevel' : '_isNotTopLevel'
// const showToogle = toggleInfo != null // !widget.serial.active || widget instanceof KLS.Widget_bool //
// const clsX = widget.serial.collapsed ? '_COLLAPSED' : ''
