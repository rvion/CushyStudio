import type { Field } from '../model/Field'
import type { NO_PROPS } from '../types/NO_PROPS'
import type { FC } from 'react'

import { FCNull } from './FCNull'
import { WidgetBodyContainerUI } from './WidgetBodyContainerUI'
import { WidgetDebugIDUI } from './WidgetDebugIDUI'
import { WidgetErrorsUI } from './WidgetErrorsUI'
import { type WidgetHeaderContainerProps, WidgetHeaderContainerUI } from './WidgetHeaderContainerUI'
import { type WidgetIndentProps, WidgetIndentUI } from './WidgetIndentUI'
import { type WidgetLabelCaretProps, WidgetLabelCaretUI } from './WidgetLabelCaretUI'
import { type WidgetLabelIconProps, WidgetLabelIconUI } from './WidgetLabelIconUI'
import { type WidgetLabelTextProps, WidgetLabelTextUI } from './WidgetLabelTextUI'
import { type WidgetPresetsProps, WidgetPresetsUI } from './WidgetPresets'
import { type WidgetSingleLineSummaryProps, WidgetSingleLineSummaryUI } from './WidgetSingleLineSummaryUI'
import { WidgetToggleUI } from './WidgetToggleUI'
import { WidgetUndoChangesButtonUI } from './WidgetUndoChangesButtonUI'

/** global */
export const configureDefaultFieldPresenterComponents = (
    /** so you don't have to polute the rest of your code */
    overrides: Partial<FieldPresenterComponents>,
): void => {
    Object.assign(fieldPresenterComponents, overrides)
}

export type MFC<P> = FC<P> | null

/**
 * list of all components used in the built-in FieldPresenter
 * from very prioritary to very optional
 * ✅ really recommended
 * 🟢 recommanded
 * 🟡 optional
 * 🟠 very optional
 * 🟣 not recommended
 * 🟥 really not recommended
 * */
export const fieldPresenterComponents: FieldPresenterComponents = {
    // heavilly suggested to include in your presenter unless you know what you do
    /* ✅ */ Header: FCNull(), // will be injected by the field
    /* ✅ */ Body: FCNull(), // will be injected by the field

    /* 🟢 */ Errors: WidgetErrorsUI,
    /* 🟢 */ DragKnob: FCNull(),
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

/** component slots available in your FieldPresenters */
export type FieldPresenterComponents = {
    // heavilly suggested to include in your presenter unless you know what you do
    /* ✅ */ Header: MFC<{ field: Field }>
    /* ✅ */ Body: MFC<{ field: Field }>

    // stuff you want to include, possilby in some revealable way
    // based on field.hasError.
    /* 🟢 */ Errors: MFC<{ field: Field }>
    /* 🟢 */ DragKnob: MFC<NO_PROPS>
    /* 🟢 */ LabelText: MFC<WidgetLabelTextProps>

    // bonus features
    /* 🟡 */ Indent: MFC<WidgetIndentProps>
    /* 🟡 */ UndoBtn: MFC<{ field: Field }>
    /* 🟡 */ Toogle: MFC<{ field: Field }>
    /* 🟡 */ Caret: MFC<WidgetLabelCaretProps>
    /* 🟡 */ Icon: MFC<WidgetLabelIconProps>
    /* 🟡 */ Presets: MFC<WidgetPresetsProps>

    // suggested containers
    /* 🟠 */ ContainerForHeader: MFC<WidgetHeaderContainerProps>
    /* 🟠 */ ContainerForBody: MFC<React.HTMLAttributes<HTMLDivElement>>
    /* 🟠 */ ContainerForSummary: MFC<WidgetSingleLineSummaryProps>

    // stuff you probably don't want to include
    // debug stuff
    /* 🟣 */ DebugID: MFC<{ field: Field }>

    // only for the lolz
    /* 🟥 */ EasterEgg: MFC<{ field: Field }>
}
