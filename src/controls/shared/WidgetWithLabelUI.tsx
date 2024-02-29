import type { IWidget } from '../IWidget'
import type { CSSProperties } from 'react'

import { observer } from 'mobx-react-lite'
import { ErrorBoundary } from 'react-error-boundary'

import { makeLabelFromFieldName } from '../../utils/misc/makeLabelFromFieldName'
import { ErrorBoundaryFallback } from '../../widgets/misc/ErrorBoundary'
import { InstallRequirementsBtnUI } from '../REQUIREMENTS/Panel_InstallRequirementsUI'
import { AnimatedSizeUI } from '../widgets/choices/AnimatedSizeUI'
import { isWidgetOptional, WidgetDI } from '../widgets/WidgetUI.DI'
import { getActualWidgetToDisplay } from './getActualWidgetToDisplay'
import { getBorderStatusForWidget } from './getBorderStatusForWidget'
import { getIfWidgetIsCollapsible } from './getIfWidgetIsCollapsible'
import { getIfWidgetNeedAlignedLabel } from './getIfWidgetNeedAlignedLabel'
import { Widget_ToggleUI } from './Widget_ToggleUI'
import { WidgetTooltipUI } from './WidgetTooltipUI'

export const KLS = WidgetDI

let isDragging = false
let wasEnabled = false

export const WidgetWithLabelUI = observer(function WidgetWithLabelUI_(p: {
    widget: IWidget
    rootKey: string
    isTopLevel?: boolean
    alignLabel?: boolean
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

    const HeaderUI = widget.HeaderUI
    const BodyUI = widget.BodyUI

    const isCollapsible: boolean = getIfWidgetIsCollapsible(widget)
    const isCollapsed = (widget.serial.collapsed ?? isDisabled) && isCollapsible

    const alignLabel = p.alignLabel ?? getIfWidgetNeedAlignedLabel(widget)
    // ------------------------------------------------------------
    // quick hack to prevent showing emtpy groups when there is literally nothing interesting to show
    const k = widget
    if (
        k instanceof KLS.Widget_group && //
        Object.keys(k.fields).length === 0 &&
        k.config.requirements == null
    )
        return
    // ------------------------------------------------------------

    const onLabelClick = () => {
        // if the widget is collapsed, clicking on the label should expand it
        if (widget.serial.collapsed) return (widget.serial.collapsed = false)
        // if the widget can be collapsed, and is expanded, clicking on the label should collapse it
        if (isCollapsible && !widget.serial.collapsed) return (widget.serial.collapsed = true)
        // if the widget is not collapsible, and is optional, clicking on the label should toggle it
        if (!isCollapsible && isWidgetOptional(originalWidget)) return originalWidget.toggle()
    }

    const showBorder = getBorderStatusForWidget(widget)

    const labelText: string | false = (() => {
        // if parent widget wants to override the label (or disable it with false), we accept
        if (p.label != null) return p.label
        // if widget defines it's own label (or disable it with false), we accept
        if (widget.config.label != null) return widget.config.label
        // if parent told use which `key` this sub-widget was mounted to, we use that to derive a label
        return makeLabelFromFieldName(p.rootKey)
    })()

    const LABEL = (
        // <span onClick={onLabelClick} style={{ lineHeight: '1rem' }}>
        <span style={{ lineHeight: '1rem' }}>
            {labelText}
            {widget.config.showID ? <span tw='opacity-50 italic text-sm'>#{widget.id.slice(0, 3)}</span> : null}
        </span>
    )

    const styleDISABLED: CSSProperties | undefined = isDisabled
        ? { pointerEvents: 'none', opacity: 0.3, backgroundColor: 'rgba(0,0,0,0.05)' }
        : undefined

    const isDraggingListener = (ev: MouseEvent) => {
        if (ev.button == 0) {
            isDragging = false
            window.removeEventListener('mouseup', isDraggingListener, true)
        }
    }

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
                <div
                    tw={['flex items-center gap-0.5 select-none']}
                    /*
                     * bird_d:
                     *  | Have the whole header able to collapse the panel,
                     *  | any actual buttons in the header should prevent this themselves.
                     *  | Also will continue to expand/collapse any panel that is hovered over while dragging.
                     * 2024-02-29 rvion: this broke 3/4 widgets who did not preventDefault in their header;
                     *  | may cause more problems later; not sure how to make this sligtly safer / easy to test.
                     * */
                    onMouseDown={(ev) => {
                        if (ev.button != 0) return
                        isDragging = true
                        window.addEventListener('mouseup', isDraggingListener, true)
                        wasEnabled = !widget.serial.collapsed
                        widget.serial.collapsed = wasEnabled
                    }}
                    // 2024-02-29 rvion: not quite sure this is the right logic now
                    // | do we want to call the now usused `onLabelClick()` function instead (defined above)
                    onMouseEnter={(ev) => {
                        if (!isDragging) return
                        widget.serial.collapsed = wasEnabled
                    }}
                >
                    <span
                        tw={[
                            'flex justify-end gap-0.5 flex-none items-center shrink-0',
                            p.isTopLevel && !isDisabled ? 'font-bold' : 'text-base',
                            isDisabled ? undefined : 'text-primary',
                        ]}
                        style={
                            alignLabel
                                ? {
                                      textAlign: 'right',
                                      minWidth: '8rem',
                                      width: alignLabel && HeaderUI ? '35%' : undefined,
                                      marginRight: alignLabel && HeaderUI ? '0.25rem' : undefined,
                                  }
                                : undefined
                        }
                    >
                        {/* COLLAPSE */}
                        {(isCollapsed || isCollapsible) && (
                            <span className='WIDGET-COLLAPSE-BTN material-symbols-outlined opacity-70 hover:opacity-100'>
                                {isCollapsed ? 'chevron_right' : 'expand_more'}
                            </span>
                        )}
                        {/* TOGGLE BEFORE */}
                        {BodyUI && <Widget_ToggleUI widget={originalWidget} />}
                        {/* REQUIREMENTS  */}
                        {widget.config.requirements && (
                            <InstallRequirementsBtnUI
                                active={widget instanceof KLS.Widget_optional ? widget.serial.active : true}
                                requirements={widget.config.requirements}
                            />
                        )}
                        {/* TOOLTIPS  */}
                        {widget.config.tooltip && <WidgetTooltipUI widget={widget} />}
                        {/* LABEL  */}
                        {LABEL}
                        {/* TOOGLE (after)  */}
                        {!BodyUI && <Widget_ToggleUI widget={originalWidget} />}
                    </span>
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
