import type { Field } from '../model/Field'
import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { useCSuite } from '../../csuite/ctx/useCSuite'
import { ErrorBoundaryUI } from '../../csuite/errors/ErrorBoundaryUI'
import { Frame } from '../../csuite/frame/Frame'
import { AnimatedSizeUI } from '../../csuite/smooth-size/AnimatedSizeUI'
import { makeLabelFromFieldName } from '../../csuite/utils/makeLabelFromFieldName'
import { WidgetDebugIDUI } from './WidgetDebugIDUI'
import { WidgetErrorsUI } from './WidgetErrorsUI'
import { WidgetHeaderContainerUI } from './WidgetHeaderContainerUI'
import { WidgetHeaderControlsContainerUI } from './WidgetHeaderControlsContainerUI'
import { WidgetIndentUI } from './WidgetIndentUI'
import { WidgetLabelCaretUI } from './WidgetLabelCaretUI'
import { WidgetLabelContainerUI } from './WidgetLabelContainerUI'
import { WidgetLabelIconUI } from './WidgetLabelIconUI'
import { WidgetLabelTextUI } from './WidgetLabelTextUI'
import { WidgetMenuUI } from './WidgetMenu'
import { WidgetPresetsUI } from './WidgetPresets'
import { WidgetToggleUI } from './WidgetToggleUI'
import { WidgetUndoChangesButtonUI } from './WidgetUndoChangesButtonUI'

export type WidgetWithLabelProps = {
    field: Field
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
    showWidgetIndent?: boolean
    className?: string

    /** 2024-08-06 rvion: temporary addition removing primitive nature of optional */
    classNameAroundBodyAndHeader?: string

    /** @since 2024-08-06; reserved but unused */
    slotToggle?: ReactNode
    slotDelete?: ReactNode
    slotDragKnob?: ReactNode
    slotUpDown?: ReactNode

    showHidden?: () => boolean
}

export const WidgetWithLabelUI = observer(function WidgetWithLabelUI_(p: WidgetWithLabelProps) {
    if (p.field.isHidden && !p.showHidden?.()) return null
    const originalField = p.field
    const field = originalField.actualWidgetToDisplay
    const HeaderUI = field.header()
    const BodyUI = field.body()
    const extraClass = originalField.isDisabled ? 'pointer-events-none opacity-30 bg-[#00000005]' : undefined
    const csuite = useCSuite()
    const labelText: string | false = p.label ?? field.config.label ?? makeLabelFromFieldName(p.fieldName)

    const justifyOld = p.justifyLabel ?? field.justifyLabel
    const labellayout = justifyOld ? csuite.labellayout : 'fixed-left'
    const justify = p.justifyLabel ?? (labellayout === 'fluid' ? false : true)

    const WUI = (
        <Frame
            className={p.className}
            tw={[
                //
                'UI-WidgetWithLabel',
                '!border-l-0 !border-r-0 !border-b-0',
            ]}
            base={field.background}
            border={field.border}
            // tooltip={field.config.tooltip}
            // border={8}
            {...p.field.config.box}
        >
            {/* HEADER --------------------------------------------------------------------------------- */}
            {!p.noHeader && (
                <WidgetHeaderContainerUI field={field}>
                    {/* HEADER LABEL */}
                    {labellayout === 'mobile' ? (
                        <div tw='flex flex-1'>
                            {(p.showWidgetIndent ?? true) && <WidgetIndentUI tw='pr-2' depth={originalField.depth} />}
                            <div tw='flex-1'>
                                <div tw='flex flex-1'>
                                    {p.slotDragKnob}
                                    <WidgetLabelCaretUI placeholder={false} field={field} />
                                    {/* <WidgetToggleUI tw='mr-1' field={originalField} /> */}
                                    <WidgetLabelIconUI tw='mr-1' widget={field} />
                                    {/* {widget.config.tooltip && <WidgetTooltipUI widget={widget} />} */}
                                    <WidgetLabelTextUI widget={field}>{labelText}</WidgetLabelTextUI>
                                    {field.config.showID && <WidgetDebugIDUI field={field} />}
                                    <WidgetPresetsUI field={field} />
                                </div>
                                <div tw='flex flex-1'>
                                    {/* <WidgetLabelCaretPlaceholderUI /> */}
                                    {/* <div tw='w-0.5' /> */}
                                    {justify && <WidgetToggleUI /* tw='ml-1' */ field={originalField} />}
                                    {HeaderUI && (
                                        <WidgetHeaderControlsContainerUI tw={[extraClass, p.classNameAroundBodyAndHeader]}>
                                            <ErrorBoundaryUI>{HeaderUI}</ErrorBoundaryUI>
                                        </WidgetHeaderControlsContainerUI>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <WidgetLabelContainerUI //
                                tooltip={field.config.tooltip}
                                justify={justify}
                            >
                                {/* {labellayout} */}
                                {labellayout === 'fixed-left' ? (
                                    <>
                                        {(p.showWidgetIndent ?? true) && <WidgetIndentUI depth={originalField.depth} />}
                                        {p.slotDragKnob}
                                        <WidgetLabelCaretUI field={field} />
                                        <WidgetLabelIconUI tw='mr-1' widget={field} />
                                        <WidgetLabelTextUI widget={field}>{labelText}</WidgetLabelTextUI>
                                        {/* {widget.config.tooltip && <WidgetTooltipUI widget={widget} />} */}
                                        {field.config.showID && <WidgetDebugIDUI field={field} />}
                                        <WidgetPresetsUI tw='ml-auto self-start' field={field} />
                                        {/* <Field_ToggleUI tw='ml-1' widget={originalWidget} /> */}
                                    </>
                                ) : labellayout === 'fixed-right' ? (
                                    <>
                                        {(p.showWidgetIndent ?? true) && <WidgetIndentUI depth={field.depth} />}
                                        {p.slotDragKnob}
                                        <WidgetLabelCaretUI tw='mr-auto' field={field} />
                                        <WidgetPresetsUI tw='self-start mr-2' field={field} />
                                        {!p.field.isCollapsed && !p.field.isCollapsible && <div tw='mr-auto' />}
                                        <WidgetLabelTextUI widget={field}>{labelText}</WidgetLabelTextUI>
                                        {/* {widget.config.tooltip && <WidgetTooltipUI widget={widget} />} */}
                                        {field.config.showID && <WidgetDebugIDUI field={field} />}
                                        <WidgetLabelIconUI tw='mx-1' widget={field} />
                                        {/* <Field_ToggleUI tw='ml-1' widget={originalWidget} /> */}
                                    </>
                                ) : (
                                    <>
                                        {(p.showWidgetIndent ?? true) && <WidgetIndentUI depth={originalField.depth} />}
                                        {p.slotDragKnob}
                                        <WidgetLabelCaretUI field={field} />
                                        <WidgetToggleUI tw='mr-1' field={originalField} />
                                        <WidgetLabelIconUI tw='mr-1' widget={field} />
                                        {/* {widget.config.tooltip && <WidgetTooltipUI widget={widget} />} */}
                                        <WidgetLabelTextUI widget={field}>{labelText}</WidgetLabelTextUI>
                                        {field.config.showID && <WidgetDebugIDUI field={field} />}
                                        <WidgetPresetsUI field={field} />
                                    </>
                                )}
                                <div tw='w-1' /* margin between label and controls */ />
                            </WidgetLabelContainerUI>

                            {/* TOOGLE (when justified) */}
                            <div tw='w-0.5' />
                            {justify && <WidgetToggleUI /* tw='ml-1' */ field={originalField} />}
                            {/* HEADER CONTROLS */}
                            {HeaderUI && (
                                <WidgetHeaderControlsContainerUI tw={[extraClass, p.classNameAroundBodyAndHeader]}>
                                    <ErrorBoundaryUI>{HeaderUI}</ErrorBoundaryUI>
                                </WidgetHeaderControlsContainerUI>
                            )}

                            {p.slotUpDown}
                            {p.slotDelete}

                            {/* HEADER EXTRA prettier-ignore */}
                            {(p.showWidgetExtra ?? csuite.showWidgetExtra) && field.schema.LabelExtraUI && (
                                <field.schema.LabelExtraUI field={field} />
                            )}
                            {(p.showWidgetUndo ?? csuite.showWidgetUndo) && <WidgetUndoChangesButtonUI field={originalField} />}
                            {(p.showWidgetMenu ?? csuite.showWidgetMenu) && <WidgetMenuUI widget={field} />}
                        </>
                    )}
                </WidgetHeaderContainerUI>
            )}

            {/* BODY  ------------------------------------------------------------------------------ */}
            {!p.noBody && BodyUI && !field.isCollapsed && (
                <ErrorBoundaryUI>
                    <div className={extraClass} tw={[field.isCollapsible && 'WIDGET-BLOCK']}>
                        {BodyUI}
                    </div>
                </ErrorBoundaryUI>
            )}

            {/* ERRORS  ------------------------------------------------------------------------------ */}
            {!p.noErrors && <WidgetErrorsUI field={field} />}
        </Frame>
    )
    if (field.animateResize && !p.noBody && BodyUI) return <AnimatedSizeUI>{WUI}</AnimatedSizeUI>
    return WUI
})
