import type { PresenterSlots } from './PresenterSlots'

import { WidgetBodyContainerUI } from '../WidgetBodyContainerUI'
import { WidgetDebugIDUI } from '../WidgetDebugIDUI'
import { WidgetErrorsUI } from '../WidgetErrorsUI'
import { WidgetHeaderContainerUI } from '../WidgetHeaderContainerUI'
import { WidgetIndentUI } from '../WidgetIndentUI'
import { WidgetLabelCaretUI } from '../WidgetLabelCaretUI'
import { WidgetLabelIconUI } from '../WidgetLabelIconUI'
import { WidgetLabelTextUI } from '../WidgetLabelTextUI'
import { WidgetPresetsUI } from '../WidgetPresets'
import { WidgetSingleLineSummaryUI } from '../WidgetSingleLineSummaryUI'
import { WidgetToggleUI } from '../WidgetToggleUI'
import { WidgetUndoChangesButtonUI } from '../WidgetUndoChangesButtonUI'

/** global */

export const configureDefaultFieldPresenterComponents = (
    /** so you don't have to polute the rest of your code */
    overrides: Partial<PresenterSlots>,
): void => {
    Object.assign(defaultPresenterSlots, overrides)
}

export const defaultPresenterSlots: PresenterSlots = {
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
