import type { IWidget } from '../IWidget'
import type { CSSProperties } from 'react'

import { observer } from 'mobx-react-lite'

import { ErrorBoundaryUI } from '../../rsuite/errors/ErrorBoundaryUI'
import { Frame } from '../../rsuite/frame/Frame'
import { makeLabelFromFieldName } from '../../utils/misc/makeLabelFromFieldName'
import { useCushyKit } from '../context/CushyKitCtx'
import { AnimatedSizeUI } from '../utils/AnimatedSizeUI'
import { getActualWidgetToDisplay } from './getActualWidgetToDisplay'
import { getIfWidgetNeedAlignedLabel } from './getIfWidgetNeedAlignedLabel'
import { Widget_ToggleUI } from './Widget_ToggleUI'
import { WidgetErrorsUI } from './WidgetErrorsUI'
import { WidgetHeaderContainerUI } from './WidgetHeaderContainerUI'
import { WidgetHeaderControlsContainerUI } from './WidgetHeaderControlsContainerUI'
import { WidgetLabelCaretUI } from './WidgetLabelCaretUI'
import { WidgetLabelContainerUI } from './WidgetLabelContainerUI'
import { WidgetLabelIconUI } from './WidgetLabelIconUI'
import { WidgetMenuUI } from './WidgetMenu'
import { WidgetTooltipUI } from './WidgetTooltipUI'
import { WidgetUndoChangesButtonUI } from './WidgetUndoChangesButtonUI'

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
    if (p.widget.isHidden) return null
    const rootKey = p.rootKey
    const originalWidget = p.widget
    const widget = getActualWidgetToDisplay(originalWidget)
    const HeaderUI = widget.header()
    const BodyUI = widget.body()
    const justify = p.alignLabel ?? getIfWidgetNeedAlignedLabel(widget)
    const showBorder = widget.border

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
        <span
            tw={[widget.isCollapsed || widget.isCollapsible ? 'cursor-pointer' : null]}
            className='COLLAPSE-PASSTHROUGH whitespace-nowrap'
            style={{ lineHeight: '1rem' }}
        >
            {labelText}
            {widget.config.showID ? <span tw='opacity-50 italic text-sm'>#{widget.id.slice(0, 3)}</span> : null}
        </span>
    )

    const extraClass = originalWidget.isDisabled ? 'pointer-events-none opacity-30 bg-[#00000005]' : undefined

    const kit = useCushyKit()
    const boxBase = (widget.background && widget.isCollapsible) || showBorder ? { contrast: 0.05 } : undefined
    const WUI = (
        <Frame
            key={rootKey}
            base={boxBase}
            {...p.widget.config.box}
            // border={showBorder ? 10 : 0}
        >
            {/* HEADER --------------------------------------------------------------------------------- */}
            <WidgetHeaderContainerUI widget={widget}>
                {/* HEADER LABEL */}
                <WidgetLabelContainerUI justify={justify}>
                    <WidgetLabelCaretUI widget={widget} />
                    <WidgetLabelIconUI widget={widget} />
                    {BodyUI && <Widget_ToggleUI tw='mr-1' widget={originalWidget} />}
                    {widget.config.tooltip && <WidgetTooltipUI widget={widget} />}
                    {LABEL}
                    {!BodyUI && <Widget_ToggleUI tw='ml-1' widget={originalWidget} />}
                </WidgetLabelContainerUI>

                {/* HEADER CONTROLS */}
                {HeaderUI && (
                    <WidgetHeaderControlsContainerUI className={extraClass}>
                        <ErrorBoundaryUI>{HeaderUI}</ErrorBoundaryUI>
                    </WidgetHeaderControlsContainerUI>
                )}

                {/* HEADER OPTIONS (undo, menu, ...) */}
                <div tw='ml-auto'></div>
                {widget.spec.LabelExtraUI && <widget.spec.LabelExtraUI widget={widget} />}
                {kit.showWidgetUndo && <WidgetUndoChangesButtonUI tw='self-start' widget={widget} />}
                {kit.showWidgetMenu && <WidgetMenuUI tw='self-start' widget={widget} />}
            </WidgetHeaderContainerUI>

            {/* BODY  ------------------------------------------------------------------------------ */}
            {BodyUI && !widget.isCollapsed && (
                <ErrorBoundaryUI>
                    <div className={extraClass} tw={[widget.isCollapsible && 'WIDGET-BLOCK']}>
                        {BodyUI}
                    </div>
                </ErrorBoundaryUI>
            )}

            {/* ERRORS  ------------------------------------------------------------------------------ */}
            <WidgetErrorsUI widget={widget} />
        </Frame>
    )
    if (widget.animateResize) return <AnimatedSizeUI>{WUI}</AnimatedSizeUI>
    return WUI
})
