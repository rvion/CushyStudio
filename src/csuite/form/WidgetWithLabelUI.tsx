import type { BaseField } from '../model/BaseField'

import { observer } from 'mobx-react-lite'

import { useCSuite } from '../../csuite/ctx/useCSuite'
import { ErrorBoundaryUI } from '../../csuite/errors/ErrorBoundaryUI'
import { Frame } from '../../csuite/frame/Frame'
import { AnimatedSizeUI } from '../../csuite/smooth-size/AnimatedSizeUI'
import { makeLabelFromFieldName } from '../../csuite/utils/makeLabelFromFieldName'
import { getActualWidgetToDisplay } from './getActualWidgetToDisplay'
import { getIfWidgetNeedJustifiedLabel } from './getIfWidgetNeedAlignedLabel'
import { Widget_ToggleUI } from './Widget_ToggleUI'
import { WidgetDebugIDUI } from './WidgetDebugIDUI'
import { WidgetErrorsUI } from './WidgetErrorsUI'
import { WidgetHeaderContainerUI } from './WidgetHeaderContainerUI'
import { WidgetHeaderControlsContainerUI } from './WidgetHeaderControlsContainerUI'
import { WidgetIndentUI } from './WidgetIndentUI'
import { WidgetLabelCaretUI } from './WidgetLabelCaretUI'
import { WidgetLabelContainerUI } from './WidgetLabelContainerUI'
import { WidgetLabelIconUI } from './WidgetLabelIconUI'
import { WidgetLabelUI } from './WidgetLabelUI'
import { WidgetMenuUI } from './WidgetMenu'
import { WidgetTooltipUI } from './WidgetTooltipUI'
import { WidgetUndoChangesButtonUI } from './WidgetUndoChangesButtonUI'

export type WidgetWithLabelProps = {
    widget: BaseField
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
    className?: string
}

export const WidgetWithLabelUI = observer(function WidgetWithLabelUI_(p: WidgetWithLabelProps) {
    if (p.widget.isHidden) return null
    const originalWidget = p.widget
    const widget = getActualWidgetToDisplay(originalWidget)
    const HeaderUI = widget.header()
    const BodyUI = widget.body()
    const extraClass = originalWidget.isDisabled ? 'pointer-events-none opacity-30 bg-[#00000005]' : undefined
    const csuite = useCSuite()
    const labelText: string | false = p.label ?? widget.config.label ?? makeLabelFromFieldName(p.fieldName)

    const justifyOld = p.justifyLabel ?? getIfWidgetNeedJustifiedLabel(widget)
    const labellayout = justifyOld ? csuite.labellayout : 'fixed-left'
    const justify = p.justifyLabel ?? (labellayout === 'fluid' ? false : true)

    const WUI = (
        <Frame
            className={p.className}
            tw='WidgetWithLabelUI !border-l-0 !border-r-0 !border-b-0'
            base={widget.background}
            border={widget.border}
            tooltip={widget.config.tooltip}
            // border={8}
            {...p.widget.config.box}
        >
            {/* HEADER --------------------------------------------------------------------------------- */}
            {!p.noHeader && (
                <WidgetHeaderContainerUI widget={widget}>
                    {/* HEADER LABEL */}
                    <WidgetLabelContainerUI //
                        tooltip={widget.config.tooltip}
                        justify={justify}
                    >
                        {labellayout === 'fixed-left' ? (
                            <>
                                <WidgetIndentUI depth={originalWidget.depth} />
                                <WidgetLabelCaretUI widget={widget} />
                                <WidgetLabelIconUI tw='mr-1' widget={widget} />
                                <WidgetLabelUI widget={widget}>{labelText}</WidgetLabelUI>
                                {widget.config.tooltip && <WidgetTooltipUI widget={widget} />}
                                {widget.config.showID && <WidgetDebugIDUI widget={widget} />}
                                {/* <Widget_ToggleUI tw='ml-1' widget={originalWidget} /> */}
                            </>
                        ) : labellayout === 'fixed-right' ? (
                            <>
                                <WidgetIndentUI depth={widget.depth} />
                                <WidgetLabelCaretUI tw='mr-auto' widget={widget} />
                                {!p.widget.isCollapsed && !p.widget.isCollapsible && <div tw='mr-auto' />}
                                <WidgetLabelUI widget={widget}>{labelText}</WidgetLabelUI>
                                {widget.config.tooltip && <WidgetTooltipUI widget={widget} />}
                                {widget.config.showID && <WidgetDebugIDUI widget={widget} />}
                                <WidgetLabelIconUI tw='mx-1' widget={widget} />
                                {/* <Widget_ToggleUI tw='ml-1' widget={originalWidget} /> */}
                            </>
                        ) : (
                            <>
                                <WidgetLabelCaretUI widget={widget} />
                                <Widget_ToggleUI tw='mr-1' widget={originalWidget} />
                                <WidgetLabelIconUI tw='mr-1' widget={widget} />
                                {widget.config.tooltip && <WidgetTooltipUI widget={widget} />}
                                <WidgetLabelUI widget={widget}>{labelText}</WidgetLabelUI>
                                {widget.config.showID && <WidgetDebugIDUI widget={widget} />}
                            </>
                        )}
                        <div tw='w-1' /* margin between label and controls */ />
                    </WidgetLabelContainerUI>

                    {/* TOOGLE (when justified) */}
                    {justify && <Widget_ToggleUI /* tw='ml-1' */ widget={originalWidget} />}
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
