import type { WidgetHeaderContainerProps } from '../../csuite/form/WidgetHeaderContainerUI'
import type { WidgetIndentProps } from '../../csuite/form/WidgetIndentUI'
import type { WidgetLabelCaretProps } from '../../csuite/form/WidgetLabelCaretUI'
import type { WidgetLabelIconProps } from '../../csuite/form/WidgetLabelIconUI'
import type { WidgetLabelTextProps } from '../../csuite/form/WidgetLabelTextUI'
import type { WidgetPresetsProps } from '../../csuite/form/WidgetPresets'
import type { WidgetSingleLineSummaryProps } from '../../csuite/form/WidgetSingleLineSummaryUI'
import type { Field } from '../../csuite/model/Field'
import type { NO_PROPS } from '../../csuite/types/NO_PROPS'
import type { FC } from 'react'

import { WidgetBodyContainerUI } from '../../csuite/form/WidgetBodyContainerUI'
import { WidgetDebugIDUI } from '../../csuite/form/WidgetDebugIDUI'
import { WidgetErrorsUI } from '../../csuite/form/WidgetErrorsUI'
import { WidgetHeaderContainerUI } from '../../csuite/form/WidgetHeaderContainerUI'
import { WidgetIndentUI } from '../../csuite/form/WidgetIndentUI'
import { WidgetLabelCaretUI } from '../../csuite/form/WidgetLabelCaretUI'
import { WidgetLabelIconUI } from '../../csuite/form/WidgetLabelIconUI'
import { WidgetLabelTextUI } from '../../csuite/form/WidgetLabelTextUI'
import { WidgetPresetsUI } from '../../csuite/form/WidgetPresets'
import { WidgetSingleLineSummaryUI } from '../../csuite/form/WidgetSingleLineSummaryUI'
import { WidgetToggleUI } from '../../csuite/form/WidgetToggleUI'
import { WidgetUndoChangesButtonUI } from '../../csuite/form/WidgetUndoChangesButtonUI'
import { ShellNoop } from '../shells/ShellNoop'

// #region Slots
/**
 * component slots available in your Presenter
 * list of all components used in the built-in FieldPresenter
 * from very prioritary to very optional
 * ✅ really recommended
 * 🟢 recommanded
 * 🟡 optional
 * 🟠 very optional
 * 🟣 not recommended
 * 🟥 really not recommended
 */
export type PresenterSlots = {
    // ---------------------------------------------------------
    // 1. Shell
    // can also be used an escape hatch for 100% custom UI
    /* ✅ */ Shell?: FC<{ field: Field } & PresenterSlots>

    // ---------------------------------------------------------
    // 2. Slots for shell
    // heavilly suggested to include in your presenter unless you know what you do
    /* ✅ */ Header?: FC<{ field: Field }>
    /* ✅ */ Body?: FC<{ field: Field }>

    // stuff you want to include, possilby in some revealable way
    // based on field.hasError.
    /* 🟢 */ Errors?: FC<{ field: Field }>
    /* 🟢 */ DragKnob?: FC<NO_PROPS>
    /* 🟢 */ LabelText?: FC<WidgetLabelTextProps>

    // bonus features
    /* 🟡 */ Indent?: FC<WidgetIndentProps>
    /* 🟡 */ UndoBtn?: FC<{ field: Field }>
    /* 🟡 */ Toogle?: FC<{ field: Field }>
    /* 🟡 */ Caret?: FC<WidgetLabelCaretProps>
    /* 🟡 */ Icon?: FC<WidgetLabelIconProps>
    /* 🟡 */ Presets?: FC<WidgetPresetsProps>

    // suggested containers
    /* 🟠 */ ContainerForHeader?: FC<WidgetHeaderContainerProps>
    /* 🟠 */ ContainerForBody?: FC<React.HTMLAttributes<HTMLDivElement>>
    /* 🟠 */ ContainerForSummary?: FC<WidgetSingleLineSummaryProps>

    // ---------------------------------------------------------
    // 3. various params

    // ---------------------------------------------------------
    // 4. Slots for shell
    // stuff you probably don't want to include
    // debug stuff
    /* 🟣 */ DebugID?: FC<{ field: Field }>

    // only for the lolz
    /* 🟥 */ EasterEgg?: FC<{ field: Field }>
}

// #region P.defaults
export const defaultPresenterSlots: PresenterSlots = {
    /* ✅ */ Shell: ShellNoop,

    // heavilly suggested to include in your presenter unless you know what you do
    /* ✅ */ Header: undefined, // will be injected by the field
    /* ✅ */ Body: undefined, // will be injected by the field

    /* 🟢 */ DragKnob: undefined,
    /* 🟢 */ Errors: WidgetErrorsUI,
    /* 🟢 */ LabelText: WidgetLabelTextUI,

    // bonus features
    /* 🟡 */ Indent: WidgetIndentUI,
    /* 🟡 */ UndoBtn: WidgetUndoChangesButtonUI,
    /* 🟡 */ Toogle: WidgetToggleUI,
    /* 🟡 */ Caret: WidgetLabelCaretUI,
    /* 🟡 */ Icon: WidgetLabelIconUI,
    /* 🟡 */ Presets: WidgetPresetsUI,

    // suggested containers
    /* 🟠 */ ContainerForHeader: WidgetHeaderContainerUI,
    /* 🟠 */ ContainerForBody: WidgetBodyContainerUI,
    /* 🟠 */ ContainerForSummary: WidgetSingleLineSummaryUI,

    // stuff you probably don't want to include
    // debug stuff
    /* 🟣 */ DebugID: WidgetDebugIDUI,

    // only for the lolz
    /* 🟥 */ EasterEgg: (): JSX.Element => <>🥚</>,
}

// #region P.setup
export const configureDefaultFieldPresenterComponents = (
    /** so you don't have to polute the rest of your code */
    overrides: Partial<PresenterSlots>,
): void => {
    Object.assign(defaultPresenterSlots, overrides)
}

// #region P.Rule
export type PresenterRule<FIELD extends Field> = (field: FIELD) => Maybe<PresenterSlots>

export const defaultPresenterRule = (field: Field): PresenterSlots => ({
    ...defaultPresenterSlots,
    Header: field.DefaultHeaderUI,
    Body: field.DefaultBodyUI,
})

// #region RenderProps
// this is the final type that is given to your Shell:
export type ShellProps<Field> = {
    field: Field
} & PresenterSlots
