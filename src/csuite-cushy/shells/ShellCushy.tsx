import type { CompiledRenderProps } from '../presenters/Presenter'
import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { WidgetHeaderContainerUI } from '../../csuite/form/WidgetHeaderContainerUI'
import { WidgetLabelContainerUI } from '../../csuite/form/WidgetLabelContainerUI'
import { WidgetPresetsUI } from '../../csuite/form/WidgetPresets'
import { Frame } from '../../csuite/frame/Frame'
import { AnimatedSizeUI } from '../../csuite/smooth-size/AnimatedSizeUI'

export type CushyHeadProps = CompiledRenderProps & { children?: ReactNode }

export const CushyHeadUI = observer(function CushyHead(p: CushyHeadProps) {
    const field = p.field
    const utils = p.presenter.utils
    const interfacePreferences = cushy.preferences.interface.value

    return (
        <WidgetHeaderContainerUI field={field} /* border={'red'} */>
            {/* HEADER LABEL */}
            {p.children}

            {/* HEADER CONTROLS */}
            {utils.renderFCOrNodeWithWrapper(p.Header, p, p.ContainerForHeader, {
                className: p.classNameAroundBodyAndHeader ?? undefined,
                field,
            })}

            {utils.renderFCOrNode(p.UpDownBtn, {})}
            {utils.renderFCOrNode(p.DeleteBtn, {})}

            {/* HEADER EXTRA prettier-ignore */}
            {utils.renderFCOrNode(p.Extra, p)}
            {interfacePreferences.showWidgetUndo && utils.renderFCOrNode(p.UndoBtn, p)}
            {interfacePreferences.showWidgetMenu && utils.renderFCOrNode(p.MenuBtn, p)}
        </WidgetHeaderContainerUI>
    )
})

const CushyShellUI = observer(function CushySHell(
    p: CompiledRenderProps & {
        border?: boolean
        HEADER: ReactNode
    },
) {
    const field = p.field
    const utils = p.presenter.utils
    if (p.field.isHidden && !p.shouldShowHiddenFields) return null

    const WUI = (
        <Frame
            className={p.classNameForShell ?? undefined}
            tw={['UI-WidgetWithLabel !border-l-0 !border-r-0 !border-b-0 py-0.5']}
            roundness={cushy.theme.value.inputRoundness}
            base={field.background}
            border={field.border}
            {...p.field.config.box}
        >
            {/* HEADER --------------------------------------------------------------------------------- */}
            {utils.renderFCOrNodeWithWrapper(p.HEADER, {}, p.Head, p)}
            {/* <CushyHeadUI
                {...p} // border={'red'}
            >
                {
                    p.HEADER // HEADER controls that the user will usually specify
                }
            </CushyHeadUI> */}

            {/* BODY  */}
            {p.field.isCollapsed
                ? null
                : utils.renderFCOrNodeWithWrapper(p.Body, p, p.ContainerForBody, {
                      className: p.classNameAroundBodyAndHeader ?? undefined,
                      border: p.border,
                  })}

            {/* ERRORS  */}
            {utils.renderFCOrNode(p.Errors, { field })}
        </Frame>
    )

    if (p.shouldAnimateResize) return <AnimatedSizeUI>{WUI}</AnimatedSizeUI>
    return WUI
})

export const ShellCushyLeftUI = observer(function ShellCushyLeft(p: CompiledRenderProps) {
    const field = p.field
    const originalField = field /* 🔴 */
    const utils = p.presenter.utils

    return (
        <CushyShellUI // 1️⃣
            {...p}
            HEADER={
                <>
                    <WidgetLabelContainerUI tooltip={field.config.tooltip} justify>
                        {utils.renderFCOrNode(p.Indent, /*    */ { depth: field.depth })}
                        {utils.renderFCOrNode(p.DragKnob, /*  */ {})}
                        {utils.renderFCOrNode(p.Caret, /*     */ { field })}
                        {utils.renderFCOrNode(p.Icon, /*      */ { field, className: 'mr-1' })}
                        {utils.renderFCOrNode(p.LabelText, /* */ { field })}
                        {utils.renderFCOrNode(p.DebugID, /*   */ { field })}
                        {utils.renderFCOrNode(p.Presets, /*   */ { field, className: 'ml-auto self-start' })}
                    </WidgetLabelContainerUI>
                    {utils.renderFCOrNode(p.Toogle, { field: originalField, className: 'ml-0.5' })}
                </>
            }
        />
    )
})

export const ShellCushyRightUI = observer(function ShellCushyRight(p: CompiledRenderProps) {
    const field = p.field
    const originalField = field /* 🔴 */
    const utils = p.presenter.utils

    return (
        <CushyShellUI // 2️⃣2️⃣
            {...p}
            HEADER={
                <>
                    <WidgetLabelContainerUI //
                        tooltip={field.config.tooltip}
                        justify
                    >
                        {utils.renderFCOrNode(p.Indent /*    */, { depth: field.depth })}
                        {utils.renderFCOrNode(p.DragKnob /*  */, {})}
                        {utils.renderFCOrNode(p.Caret /*     */, { field, className: 'mr-auto' })}
                        {utils.renderFCOrNode(p.Presets /*   */, { field, className: 'self-start mr-2' })}
                        {!p.field.isCollapsed && !p.field.isCollapsible && <div tw='mr-auto' />}
                        {utils.renderFCOrNode(p.LabelText /* */, { field })}
                        {utils.renderFCOrNode(p.DebugID /*   */, { field })}
                        {utils.renderFCOrNode(p.Icon /*      */, { field, className: 'mx-1' })}
                    </WidgetLabelContainerUI>

                    {/* TOOGLE (when justified) */}
                    <div tw='w-0.5' />
                    {utils.renderFCOrNode(p.Toogle, { field: originalField })}
                </>
            }
        />
    )
})

export const ShellCushyFluidUI = observer(function ShellCushyFluid(p: CompiledRenderProps) {
    const field = p.field
    const originalField = field /* 🔴 */
    const utils = p.presenter.utils

    return (
        <CushyShellUI // 3️⃣3️⃣3️⃣
            {...p}
            HEADER={
                <>
                    <WidgetLabelContainerUI //
                        tooltip={field.config.tooltip}
                        justify={false}
                    >
                        {utils.renderFCOrNode(p.Indent, /*    */ { depth: field.depth })}
                        {utils.renderFCOrNode(p.DragKnob, /*  */ {})}
                        {utils.renderFCOrNode(p.Caret, /*     */ { field })}
                        {utils.renderFCOrNode(p.Toogle, /*    */ { field: originalField, className: 'mr-1' })}
                        {utils.renderFCOrNode(p.Icon, /*      */ { field, className: 'mr-1' })}
                        {utils.renderFCOrNode(p.LabelText, /* */ { field })}
                        {utils.renderFCOrNode(p.DebugID, /*   */ { field })}
                        <WidgetPresetsUI field={field} />
                    </WidgetLabelContainerUI>
                </>
            }
        />
    )
})
