import type { Field } from '../../csuite/model/Field'
import type { FCOrNode } from '../shells/_isFC'
import type { DisplayConf } from './Renderer'
import type { WidgetSlots } from './RenderSlots'

import { ShellLinkUI } from '../../csuite/fields/link/WidgetLink'
import { ShellOptionalUI } from '../../csuite/fields/optional/WidgetOptional'
import { isFieldLink, isFieldOptional } from '../../csuite/fields/WidgetUI.DI'
import { WidgetBodyContainerUI } from '../../csuite/form/WidgetBodyContainerUI'
import { WidgetDebugIDUI } from '../../csuite/form/WidgetDebugIDUI'
import { WidgetErrorsUI } from '../../csuite/form/WidgetErrorsUI'
import { WidgetHeaderContainerUI } from '../../csuite/form/WidgetHeaderContainerUI'
import { WidgetIndentUI } from '../../csuite/form/WidgetIndentUI'
import { WidgetLabelCaretUI } from '../../csuite/form/WidgetLabelCaretUI'
import { WidgetLabelIconUI } from '../../csuite/form/WidgetLabelIconUI'
import { WidgetLabelTextUI } from '../../csuite/form/WidgetLabelTextUI'
import { WidgetMenuUI } from '../../csuite/form/WidgetMenu'
import { WidgetPresetsUI } from '../../csuite/form/WidgetPresets'
import { WidgetSingleLineSummaryUI } from '../../csuite/form/WidgetSingleLineSummaryUI'
import { WidgetToggleUI } from '../../csuite/form/WidgetToggleUI'
import { WidgetUndoChangesButtonUI } from '../../csuite/form/WidgetUndoChangesButtonUI'
import { CushyHeadUI } from '../shells/CushyHead'
import { ShellCushyLeftUI } from '../shells/ShellCushy'

export const defaultPresenterRule = <FIELD extends Field>(field: FIELD): DisplayConf<FIELD> => {
    if (isFieldLink(field)) {
        return {
            ...defaultPresenterSlots,
            Shell: ShellLinkUI as any,
        }
    }
    if (isFieldOptional(field)) {
        return {
            ...defaultPresenterSlots,
            Shell: ShellOptionalUI as any,
        }
    }

    return {
        ...defaultPresenterSlots,
        Header: field.DefaultHeaderUI,
        Body: field.DefaultBodyUI,
        Extra: field.schema.LabelExtraUI as FCOrNode<{ field: FIELD }> /* 🔴 check if that can be fixed */,
        DebugID: null,
    }
}

// #region P.setup
export const configureDefaultFieldPresenterComponents = (
    /** so you don't have to polute the rest of your code */
    overrides: Partial<WidgetSlots>,
): void => {
    Object.assign(defaultPresenterSlots, overrides)
}

export const defaultPresenterSlots: WidgetSlots<any> = {
    /* ✅ */ Shell: ShellCushyLeftUI,

    // heavilly suggested to include in your presenter unless you know what you do
    /* ✅ */ Head: CushyHeadUI, // will be injected by the field
    /* ✅ */ Header: undefined, // will be injected by the field
    /* ✅ */ Body: undefined, // will be injected by the field
    /* ✅ */ Extra: undefined,

    /* 🟢 */ Errors: WidgetErrorsUI,
    /* 🟢 */ LabelText: WidgetLabelTextUI,

    /* 🟢 */ DragKnob: undefined,
    /* 🟢 */ UpDownBtn: undefined,
    /* 🟢 */ DeleteBtn: undefined,

    // bonus features
    /* 🟡 */ Indent: WidgetIndentUI,
    /* 🟡 */ UndoBtn: WidgetUndoChangesButtonUI,
    /* 🟡 */ Toogle: WidgetToggleUI,
    /* 🟡 */ Caret: WidgetLabelCaretUI,
    /* 🟡 */ Icon: WidgetLabelIconUI,
    /* 🟡 */ Presets: WidgetPresetsUI,
    /* 🟡 */ MenuBtn: WidgetMenuUI,

    // suggested containers
    /* 🟠 */ ContainerForHeader: WidgetHeaderContainerUI,
    /* 🟠 */ ContainerForBody: WidgetBodyContainerUI,
    /* 🟠 */ ContainerForSummary: WidgetSingleLineSummaryUI,

    classNameAroundBodyAndHeader: null,
    classNameAroundBody: null,
    classNameAroundHeader: null,
    classNameForShell: null,
    shouldShowHiddenFields: false,
    shouldAnimateResize: true,

    // stuff you probably don't want to include
    // debug stuff
    /* 🟣 */ DebugID: WidgetDebugIDUI,

    // only for the lolz
    /* 🟥 */ EasterEgg: (): JSX.Element => <>🥚</>,
}
