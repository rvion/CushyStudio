import type { IWidget } from '../IWidget'

import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { ErrorBoundary } from 'react-error-boundary'

import { makeLabelFromFieldName } from '../../utils/misc/makeLabelFromFieldName'
import { ErrorBoundaryFallback } from '../../widgets/misc/ErrorBoundary'
import { InstallRequirementsBtnUI } from '../REQUIREMENTS/Panel_InstallRequirementsUI'
import { AnimatedSizeUI } from '../widgets/choices/AnimatedSizeUI'
import { WidgetDI } from '../widgets/WidgetUI.DI'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { Tooltip } from 'src/rsuite/shims'

const KLS = WidgetDI

export const WidgetWithLabelUI = observer(function WidgetWithLabelUI_(p: {
    widget: IWidget
    rootKey: string
    isTopLevel?: boolean
    inline?: boolean
}) {
    const { rootKey, widget } = p

    if (WidgetDI.WidgetUI == null) return <>WidgetDI.WidgetUI is null</>
    const { WidgetLineUI, WidgetBlockUI } = WidgetDI.WidgetUI(widget) // WidgetDI.WidgetUI(widget)
    const isCollapsible = WidgetBlockUI != null && widget.isCollapsible
    const collapsed = widget.serial.collapsed && isCollapsible
    if (widget instanceof KLS.Widget_group && Object.keys(widget.fields).length === 0) return
    const className = '' // `${clsX} __${widget.type} ${levelClass} flex flex-col items-baseline`

    const onLineClick = () => {
        if (widget.serial.collapsed) return (widget.serial.collapsed = false)
        if (isCollapsible) {
            if (widget.serial.collapsed) widget.serial.collapsed = false
            else widget.serial.collapsed = true
        }
    }
    const LABEL = (
        <span onClick={onLineClick} style={{ lineHeight: '1rem' }}>
            {widget.config.label ?? makeLabelFromFieldName(p.rootKey) ?? '...'}
            {p.widget.config.showID ? <span tw='opacity-50 italic text-sm'>#{p.widget.id.slice(0, 3)}</span> : null}
        </span>
    )
    return (
        <div
            tw={[
                'bg-base-100',
                //
                isCollapsible && 'WIDGET-WITH-BLOCK',
                p.isTopLevel ? 'TOP-LEVEL-FIELD' : 'SUB-FIELD',
                widget.type,
            ]}
            className={className}
            key={rootKey}
        >
            <AnimatedSizeUI>
                {/* LINE */}
                <div tw={[isCollapsible && 'WIDGET-LINE', 'flex items-center gap-0.5']}>
                    {(collapsed || isCollapsible) && <Widget_CollapseBtnUI widget={p.widget} />}
                    <span
                        tw={[
                            //
                            'flex justify-end gap-0.5',
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

                                      width: WidgetLineUI ? '25%' : undefined,
                                      marginRight: WidgetLineUI ? '0.25rem' : undefined,
                                  }
                        }
                    >
                        <Widget_ToggleUI widget={p.widget} />
                        {p.widget.config.requirements && (
                            <InstallRequirementsBtnUI
                                active={widget instanceof KLS.Widget_optional ? widget.serial.active : true}
                                requirements={p.widget.config.requirements}
                            />
                        )}
                        {/* <InstallCustomNodeBtnUI recomandation={p.widget.config} /> */}
                        {widget.config.tooltip && <WidgetTooltipUI widget={p.widget} />}
                        {LABEL}
                        {/* {widget.serial.collapsed ? <span className='material-symbols-outlined'>keyboard_arrow_right</span> : null} */}
                        {/* {widget.serial.collapsed ? '{...}' : null} */}
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
                        <div tw={[isCollapsible && 'WIDGET-BLOCK']}>
                            <WidgetBlockUI widget={widget} />
                        </div>
                    </ErrorBoundary>
                )}
            </AnimatedSizeUI>
        </div>
    )
})

export const Widget_CollapseBtnUI = observer(function Widget_CollapseBtnUI_(p: { widget: IWidget }) {
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

export const Widget_ToggleUI = observer(function Widget_ToggleUI_(p: { widget: IWidget }) {
    const widget = p.widget
    if (!(widget instanceof KLS.Widget_optional)) return null
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

export const WidgetTooltipUI = observer(function WidgetTooltipUI_(p: { widget: IWidget }) {
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
