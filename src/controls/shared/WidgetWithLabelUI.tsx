import type { IWidget } from '../IWidget'

import { observer } from 'mobx-react-lite'

import { useCSuite } from '../../csuite/ctx/useCSuite'
import { ErrorBoundaryUI } from '../../csuite/errors/ErrorBoundaryUI'
import { Frame } from '../../csuite/frame/Frame'
import { makeLabelFromFieldName } from '../../utils/misc/makeLabelFromFieldName'
import { AnimatedSizeUI } from '../utils/AnimatedSizeUI'
import { getActualWidgetToDisplay } from './getActualWidgetToDisplay'
import { getIfWidgetNeedJustifiedLabel } from './getIfWidgetNeedAlignedLabel'
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
    fieldName: string
    /**
     * override the label (false to force disable the label)
     * some widget like `choice`, already display the selected header in their own way
     * so they may want to skip the label.
     * */
    noHeader?: boolean
    noBody?: boolean
    noErrors?: boolean

    label?: string | false
    justifyLabel?: boolean
    showWidgetExtra?: boolean
    showWidgetUndo?: boolean
    showWidgetMenu?: boolean
}) {
    if (p.widget.isHidden) return null
    const originalWidget = p.widget
    const widget = getActualWidgetToDisplay(originalWidget)
    const HeaderUI = widget.header()
    const BodyUI = widget.body()
    const justify = p.justifyLabel ?? getIfWidgetNeedJustifiedLabel(widget)
    const extraClass = originalWidget.isDisabled ? 'pointer-events-none opacity-30 bg-[#00000005]' : undefined
    const csuite = useCSuite()
    const labelText: string | false = p.label ?? widget.config.label ?? makeLabelFromFieldName(p.fieldName)
    const WUI = (
        <Frame
            //
            tw='flex flex-col gap-1'
            base={widget.background}
            border={widget.border}
            {...p.widget.config.box}
        >
            {/* HEADER --------------------------------------------------------------------------------- */}
            {!p.noHeader && (
                <WidgetHeaderContainerUI widget={widget}>
                    {/* HEADER LABEL */}
                    <WidgetLabelContainerUI justify={justify}>
                        <WidgetLabelCaretUI widget={widget} />
                        <WidgetLabelIconUI widget={widget} />
                        {!justify && <Widget_ToggleUI tw='mr-1' widget={originalWidget} />}
                        {widget.config.tooltip && <WidgetTooltipUI widget={widget} />}
                        <WidgetLabelUI widget={widget}>{labelText}</WidgetLabelUI>
                        {widget.config.showID && <WidgetDebugIDUI widget={widget} />}
                        {justify && <Widget_ToggleUI tw='ml-1' widget={originalWidget} />}
                    </WidgetLabelContainerUI>

                    {/* HEADER CONTROLS */}
                    {HeaderUI && (
                        <WidgetHeaderControlsContainerUI className={extraClass}>
                            <ErrorBoundaryUI>{HeaderUI}</ErrorBoundaryUI>
                        </WidgetHeaderControlsContainerUI>
                    )}

                    {/* HEADER EXTRA prettier-ignore */}
                    {(p.showWidgetExtra ?? csuite.showWidgetExtra) && widget.spec.LabelExtraUI && (
                        <widget.spec.LabelExtraUI widget={widget} />
                    )}
                    {(p.showWidgetUndo ?? csuite.showWidgetUndo) && <WidgetUndoChangesButtonUI widget={originalWidget} />}
                    {(p.showWidgetMenu ?? csuite.showWidgetMenu) && <WidgetMenuUI widget={widget} />}
                </WidgetHeaderContainerUI>
            )}

            {/* BODY  ------------------------------------------------------------------------------ */}
            {!p.noBody && BodyUI && !widget.isCollapsed && (
                <ErrorBoundaryUI>
                    <div className={extraClass} tw={[widget.isCollapsible && 'WIDGET-BLOCK']}>
                        {BodyUI}
                    </div>
                </ErrorBoundaryUI>
            )}

            {/* ERRORS  ------------------------------------------------------------------------------ */}
            {!p.noErrors && <WidgetErrorsUI widget={widget} />}
        </Frame>
    )
    if (widget.animateResize && !p.noBody && BodyUI) return <AnimatedSizeUI>{WUI}</AnimatedSizeUI>
    return WUI
})
