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
}) {
    const rootKey = p.rootKey
    const originalWidget = p.widget
    const widget = getActualWidgetToDisplay(originalWidget)
    const isDisabled = isWidgetOptional(originalWidget) && !originalWidget.serial.active

    const WidgetHeaderUI = widget.HeaderUI // WidgetDI.WidgetUI(widget)
    const WidgetBodyUI = widget.BodyUI // WidgetDI.WidgetUI(widget)

    const isCollapsible: boolean = checkIfWidgetIsCollapsible(widget)
    const isCollapsed = widget.serial.collapsed && isCollapsible

    if (widget instanceof KLS.Widget_group && Object.keys(widget.fields).length === 0) return

    const onLineClick = () => {
        if (widget.serial.collapsed) return (widget.serial.collapsed = false)
        if (isCollapsible && !widget.serial.collapsed) widget.serial.collapsed = true
    }
    const showBorder = widget.config.neverBordered ? false : widget.hasBlock
    const LABEL = (
        <span onClick={onLineClick} style={{ lineHeight: '1rem' }}>
            {widget.config.label ?? makeLabelFromFieldName(p.rootKey) ?? '...'}
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
                <div tw={[isCollapsible && 'WIDGET-LINE', 'flex items-center gap-0.5']}>
                    {(isCollapsed || isCollapsible) && <Widget_CollapseBtnUI widget={widget} />}
                    <span
                        tw={[
                            'flex justify-end gap-0.5',
                            p.isTopLevel && !isDisabled ? 'font-bold' : 'text-base',
                            'flex-none items-center',
                            isDisabled ? undefined : 'text-primary',
                        ]}
                        style={
                            WidgetBodyUI || p.inline
                                ? undefined
                                : {
                                      flexShrink: 0,
                                      minWidth: '8rem',
                                      textAlign: 'right',

                                      width: WidgetHeaderUI ? '35%' : undefined,
                                      marginRight: WidgetHeaderUI ? '0.25rem' : undefined,
                                  }
                        }
                    >
                        <Widget_ToggleUI widget={originalWidget} />
                        {widget.config.requirements && (
                            <InstallRequirementsBtnUI
                                active={widget instanceof KLS.Widget_optional ? widget.serial.active : true}
                                requirements={widget.config.requirements}
                            />
                        )}
                        {widget.config.tooltip && <WidgetTooltipUI widget={widget} />}
                        {LABEL}
                    </span>
                    {/* )} */}
                    {WidgetHeaderUI && (
                        <div tw='flex items-center gap-0.5 flex-1' style={styleDISABLED}>
                            <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
                                <WidgetHeaderUI widget={widget} />
                            </ErrorBoundary>
                        </div>
                    )}
                </div>

                {/* BLOCK */}
                {WidgetBodyUI && !isCollapsed && (
                    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
                        <div style={styleDISABLED} tw={[isCollapsible && 'WIDGET-BLOCK']}>
                            <WidgetBodyUI widget={widget} />
                        </div>
                    </ErrorBoundary>
                )}
            </AnimatedSizeUI>
        </div>
    )
})
