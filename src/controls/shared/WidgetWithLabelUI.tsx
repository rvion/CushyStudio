import type { IWidget } from '../IWidget'

import { observer } from 'mobx-react-lite'

import { useCSuite } from '../../csuite/ctx/useCSuite'
import { ErrorBoundaryUI } from '../../csuite/errors/ErrorBoundaryUI'
import { Frame } from '../../csuite/frame/Frame'
import { makeLabelFromFieldName } from '../../utils/misc/makeLabelFromFieldName'
import { AnimatedSizeUI } from '../utils/AnimatedSizeUI'
import { getActualWidgetToDisplay } from './getActualWidgetToDisplay'
import { getIfWidgetNeedAlignedLabel } from './getIfWidgetNeedAlignedLabel'
import { Widget_ToggleUI } from './Widget_ToggleUI'
import { WidgetDebugIDUI } from './WidgetDebugIDUI'
import { WidgetErrorsUI } from './WidgetErrorsUI'
import { WidgetHeaderContainerUI } from './WidgetHeaderContainerUI'
import { WidgetHeaderControlsContainerUI } from './WidgetHeaderControlsContainerUI'
import { WidgetLabelCaretUI } from './WidgetLabelCaretUI'
import { WidgetLabelContainerUI } from './WidgetLabelContainerUI'
import { WidgetLabelIconUI } from './WidgetLabelIconUI'
import { WidgetLabelUI } from './WidgetLabelUI'
import { WidgetMenuUI } from './WidgetMenu'
import { WidgetTooltipUI } from './WidgetTooltipUI'
import { WidgetUndoChangesButtonUI } from './WidgetUndoChangesButtonUI'

export const WidgetWithLabelUI = observer(function WidgetWithLabelUI_(p: {
    widget: IWidget
    rootKey: string
    /**
     * override the label (false to force disable the label)
     * some widget like `choice`, already display the selected header in their own way
     * so they may want to skip the label.
     * */
    label?: string | false
    justifyLabel?: boolean
}) {
    if (p.widget.isHidden) return null
    const rootKey = p.rootKey
    const originalWidget = p.widget
    const widget = getActualWidgetToDisplay(originalWidget)
    const HeaderUI = widget.header()
    const BodyUI = widget.body()
    const justify = p.justifyLabel ?? getIfWidgetNeedAlignedLabel(widget)
    const showBorder = widget.border
    const extraClass = originalWidget.isDisabled ? 'pointer-events-none opacity-30 bg-[#00000005]' : undefined
    const csuite = useCSuite()
    const showContrast = /* 🤮👉 */ (widget.background && widget.isCollapsible) || showBorder
    const boxBase = showContrast ? { contrast: 0.05 } : undefined

    const labelText: string | false = (() => {
        // if parent widget wants to override the label (or disable it with false), we accept
        if (p.label != null) return p.label
        // if widget defines it's own label (or disable it with false), we accept
        if (widget.config.label != null) return widget.config.label
        // if parent told use which `key` this sub-widget was mounted to, we use that to derive a label
        return makeLabelFromFieldName(p.rootKey)
    })()

    const WUI = (
        <Frame
            //
            tw='flex flex-col gap-1'
            key={rootKey}
            base={boxBase}
            border={showBorder ? 5 : 0}
            {...p.widget.config.box}
        >
            {/* HEADER --------------------------------------------------------------------------------- */}
            <WidgetHeaderContainerUI widget={widget}>
                {/* HEADER LABEL */}
                <WidgetLabelContainerUI justify={justify}>
                    <WidgetLabelCaretUI widget={widget} />
                    <WidgetLabelIconUI widget={widget} />
                    {BodyUI && <Widget_ToggleUI tw='mr-1' widget={originalWidget} />}
                    {widget.config.tooltip && <WidgetTooltipUI widget={widget} />}
                    <WidgetLabelUI widget={widget}>{labelText}</WidgetLabelUI>
                    {widget.config.showID && <WidgetDebugIDUI widget={widget} />}
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
                {csuite.showWidgetUndo && <WidgetUndoChangesButtonUI widget={originalWidget} />}
                {csuite.showWidgetMenu && <WidgetMenuUI widget={widget} />}
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
