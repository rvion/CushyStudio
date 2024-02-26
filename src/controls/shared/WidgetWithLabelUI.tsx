import type { IWidget } from '../IWidget'
import type { CSSProperties } from 'react'

import { observer } from 'mobx-react-lite'
import { ErrorBoundary } from 'react-error-boundary'

import { makeLabelFromFieldName } from '../../utils/misc/makeLabelFromFieldName'
import { ErrorBoundaryFallback } from '../../widgets/misc/ErrorBoundary'
import { InstallRequirementsBtnUI } from '../REQUIREMENTS/Panel_InstallRequirementsUI'
import { AnimatedSizeUI } from '../widgets/choices/AnimatedSizeUI'
import { isWidgetOptional, WidgetDI } from '../widgets/WidgetUI.DI'
import { checkIfWidgetIsCollapsible } from './checkIfWidgetIsCollapsible'
import { getActualWidgetToDisplay } from './getActualWidgetToDisplay'
import { Widget_CollapseBtnUI } from './Widget_CollapseBtnUI'
import { Widget_ToggleUI } from './Widget_ToggleUI'
import { WidgetTooltipUI } from './WidgetTooltipUI'

export const KLS = WidgetDI

export const WidgetWithLabelUI = observer(function WidgetWithLabelUI_(p: {
    widget: IWidget
    rootKey: string
    isTopLevel?: boolean
    inline?: boolean
    /**
     * override the label (false to force disable the label)
     * some widget like `choice`, already display the selected header in their own way
     * so they may want to skip the label.
     * */
    label?: string | false
}) {
    const rootKey = p.rootKey
    const originalWidget = p.widget
    const widget = getActualWidgetToDisplay(originalWidget)
    const isDisabled = isWidgetOptional(originalWidget) && !originalWidget.serial.active

    const HeaderUI = widget.HeaderUI // WidgetDI.WidgetUI(widget)
    const BodyUI = widget.BodyUI // WidgetDI.WidgetUI(widget)

    const isCollapsible: boolean = checkIfWidgetIsCollapsible(widget)
    const isCollapsed = (widget.serial.collapsed ?? isDisabled) && isCollapsible

    // ------------------------------------------------------------
    const k = widget
    if (
        k instanceof KLS.Widget_group && //
        Object.keys(k.fields).length === 0 &&
        k.config.requirements == null
    )
        return
    // ------------------------------------------------------------

    const onLabelClick = () => {
        if (widget.serial.collapsed) return (widget.serial.collapsed = false)
        if (isCollapsible && !widget.serial.collapsed) return (widget.serial.collapsed = true)
        if (!isCollapsible && isWidgetOptional(originalWidget)) return originalWidget.toggle()
    }

    const showBorder = (() => {
        // if app author manually specify they want no border, then we respect that
        if (widget.config.border != null) return widget.config.border
        // if the widget ovveride the default border => we respect that
        if (widget.border != null) return widget.border
        // if the widget do NOT have a body => we do not show the border
        if (widget.BodyUI == null) return false
        // default case when we have a body => we show the border
        return true
    })()

    const labelText: string | false = (() => {
        // if parent widget wants to override the label (or disable it with false), we accept
        if (p.label != null) return p.label
        // if widget defines it's own label (or disable it with false), we accept
        if (widget.config.label != null) return widget.config.label
        // if parent told use which `key` this sub-widget was mounted to, we use that to derive a label
        return makeLabelFromFieldName(p.rootKey)
    })()

    const LABEL = (
        <span onClick={onLabelClick} style={{ lineHeight: '1rem' }}>
            {labelText}
            {widget.config.showID ? <span tw='opacity-50 italic text-sm'>#{widget.id.slice(0, 3)}</span> : null}
        </span>
    )

    const styleDISABLED: CSSProperties | undefined = isDisabled
        ? { pointerEvents: 'none', opacity: 0.3, backgroundColor: 'rgba(0,0,0,0.05)' }
        : undefined

    return (
        <div
            key={rootKey}
            tw={[
                'bg-base-100',
                showBorder && 'WIDGET-GROUP-BORDERED',
                p.isTopLevel ? 'TOP-LEVEL-FIELD' : 'SUB-FIELD',
                widget.type,
            ]}
        >
            <AnimatedSizeUI>
                {/*
                    LINE part
                    (label, collapse button, toggle button, tooltip, etc.)
                    Only way to have it completely disabled is to have no label, no tooltip, no requirements, etc.
                */}
                <div tw={['flex items-center gap-0.5']}>
                    {(isCollapsed || isCollapsible) && <Widget_CollapseBtnUI widget={widget} />}
                    {/* isCollapsible:{isCollapsible ? '🟢' : '❌'} */}
                    <span
                        tw={[
                            'flex justify-end gap-0.5',
                            p.isTopLevel && !isDisabled ? 'font-bold' : 'text-base',
                            'flex-none items-center',
                            isDisabled ? undefined : 'text-primary',
                        ]}
                        style={
                            BodyUI || p.inline
                                ? undefined
                                : {
                                      flexShrink: 0,
                                      minWidth: '8rem',
                                      textAlign: 'right',

                                      width: HeaderUI ? '35%' : undefined,
                                      marginRight: HeaderUI ? '0.25rem' : undefined,
                                  }
                        }
                    >
                        {BodyUI && <Widget_ToggleUI widget={originalWidget} />}
                        {widget.config.requirements && (
                            <InstallRequirementsBtnUI
                                active={widget instanceof KLS.Widget_optional ? widget.serial.active : true}
                                requirements={widget.config.requirements}
                            />
                        )}
                        {widget.config.tooltip && <WidgetTooltipUI widget={widget} />}
                        {LABEL}
                        {!BodyUI && <Widget_ToggleUI widget={originalWidget} />}
                    </span>
                    {/* )} */}
                    {HeaderUI && (
                        <div tw='flex items-center gap-0.5 flex-1' style={styleDISABLED}>
                            <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
                                <HeaderUI widget={widget} />
                            </ErrorBoundary>
                        </div>
                    )}
                </div>

                {/* BLOCK */}
                {BodyUI && !isCollapsed && (
                    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
                        <div style={styleDISABLED} tw={[isCollapsible && 'WIDGET-BLOCK']}>
                            <BodyUI widget={widget} />
                        </div>
                    </ErrorBoundary>
                )}
            </AnimatedSizeUI>
        </div>
    )
})
