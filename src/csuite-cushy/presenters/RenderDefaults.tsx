import type { Field } from '../../csuite/model/Field'
import type { FCOrNode } from '../shells/_isFC'
import type { DisplayConf } from './Renderer'
import type { WidgetSlots } from './RenderSlots'

import { ShellLinkUI } from '../../csuite/fields/link/WidgetLink'
import { ShellOptionalUI } from '../../csuite/fields/optional/WidgetOptional'
import { ShellSharedUI } from '../../csuite/fields/shared/WidgetSharedUI'
import { isFieldLink, isFieldOptional, isFieldShared } from '../../csuite/fields/WidgetUI.DI'
import { WidgetBodyContainerUI } from '../../csuite/form/WidgetBodyContainerUI'
import { WidgetHeaderContainerUI } from '../../csuite/form/WidgetHeaderContainerUI'
import { WidgetIndentUI } from '../../csuite/form/WidgetIndentUI'
import { WidgetLabelCaretUI } from '../../csuite/form/WidgetLabelCaretUI'
import { WidgetLabelIconUI } from '../../csuite/form/WidgetLabelIconUI'
import { WidgetMenuUI } from '../../csuite/form/WidgetMenu'
import { WidgetSingleLineSummaryUI } from '../../csuite/form/WidgetSingleLineSummaryUI'
import { WidgetToggleUI } from '../../csuite/form/WidgetToggleUI'
import { WidgetUndoChangesButtonUI } from '../../csuite/form/WidgetUndoChangesButtonUI'
import { WidgetDebugIDUI } from '../catalog/Debug/WidgetDebugIDUI'
import { WidgetErrorsUI } from '../catalog/Errors/WidgetErrorsUI'
import { WidgetPresetsUI } from '../catalog/Presets/WidgetPresets'
import { DefaultWidgetTitleUI } from '../catalog/Title/WidgetLabelTextUI'
import { CushyHeadUI } from '../shells/CushyHead'
import { ShellCushyLeftUI } from '../shells/ShellCushy'
import { widgetsCatalog } from './RenderCatalog'

export const defaultPresenterRule = <FIELD extends Field>(field: FIELD): DisplayConf<FIELD> => {
    const slots: WidgetSlots<FIELD> = { ...defaultPresenterSlots }
    const catalog = widgetsCatalog
    const apply = (overrides: Partial<WidgetSlots<FIELD>>): void => void Object.assign(slots, overrides)
    slots.DebugID = null

    // shared
    if (isFieldShared(field)) {
        slots.Shell = ShellSharedUI as any
    }
    // link
    else if (isFieldLink(field)) {
        slots.Shell = ShellLinkUI as any
    }
    // optional
    else if (isFieldOptional(field)) {
        slots.Shell = ShellOptionalUI as any
    }

    // others
    else {
        slots.Header = field.DefaultHeaderUI
        slots.Body = field.DefaultBodyUI
        slots.Extra = field.schema.LabelExtraUI as FCOrNode<{ field: FIELD }> /* 🔴 check if that can be fixed */

        if (field.depth === 1) {
            if (field.isOfType('group', 'list', 'choices')) {
                slots.Decoration = (p): JSX.Element => <catalog.Decorations.Card field={field} {...p} />
                slots.Title = catalog.Title.h3
            }
        } else if (field.depth === 2) {
            if (field.isOfType('group', 'list', 'choices')) apply({ Title: catalog.Title.h4 })
            if (!field.isOfType('optional', 'link', 'list', 'shared')) apply({ Shell: catalog.Shell.Right })
        }
    }

    return slots
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
    /* 🟢 */ Title: DefaultWidgetTitleUI,

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
