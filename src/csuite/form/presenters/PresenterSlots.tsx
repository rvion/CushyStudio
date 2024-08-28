import type { Field } from '../../model/Field'
import type { NO_PROPS } from '../../types/NO_PROPS'
import type { WidgetHeaderContainerProps } from '../WidgetHeaderContainerUI'
import type { WidgetIndentProps } from '../WidgetIndentUI'
import type { WidgetLabelCaretProps } from '../WidgetLabelCaretUI'
import type { WidgetLabelIconProps } from '../WidgetLabelIconUI'
import type { WidgetLabelTextProps } from '../WidgetLabelTextUI'
import type { WidgetPresetsProps } from '../WidgetPresets'
import type { WidgetSingleLineSummaryProps } from '../WidgetSingleLineSummaryUI'
import type { FC } from 'react'

/**
 * list of all components used in the built-in FieldPresenter
 * from very prioritary to very optional
 * ✅ really recommended
 * 🟢 recommanded
 * 🟡 optional
 * 🟠 very optional
 * 🟣 not recommended
 * 🟥 really not recommended
 */

/** component slots available in your Presenter */
export type PresenterSlots = {
    // intended as an escape hatch for custom UI
    /* ✅ */ UI?: FC<{ field: Field } & PresenterSlots>

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

    // stuff you probably don't want to include
    // debug stuff
    /* 🟣 */ DebugID?: FC<{ field: Field }>

    // only for the lolz
    /* 🟥 */ EasterEgg?: FC<{ field: Field }>
}
