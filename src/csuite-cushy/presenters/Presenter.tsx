import type { WidgetHeaderContainerProps } from '../../csuite/form/WidgetHeaderContainerUI'
import type { WidgetIndentProps } from '../../csuite/form/WidgetIndentUI'
import type { WidgetLabelCaretProps } from '../../csuite/form/WidgetLabelCaretUI'
import type { WidgetLabelIconProps } from '../../csuite/form/WidgetLabelIconUI'
import type { WidgetLabelTextProps } from '../../csuite/form/WidgetLabelTextUI'
import type { WidgetMenuProps } from '../../csuite/form/WidgetMenu'
import type { WidgetPresetsProps } from '../../csuite/form/WidgetPresets'
import type { WidgetSingleLineSummaryProps } from '../../csuite/form/WidgetSingleLineSummaryUI'
import type { WidgetToggleProps } from '../../csuite/form/WidgetToggleUI'
import type { Field } from '../../csuite/model/Field'
import type { NO_PROPS } from '../../csuite/types/NO_PROPS'
import type { CovariantFn1 } from '../../csuite/variance/BivariantHack'
import type { CovariantFC } from '../../csuite/variance/CovariantFC'
import type { QuickFormContent } from '../catalog/group/QuickForm'
import type { FC, ReactNode } from 'react'

import { createElement } from 'react'

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
import { mergeDefined } from '../../csuite/utils/mergeDefined'
import { QuickForm } from '../catalog/group/QuickForm'
import { renderFCOrNode, renderFCOrNodeWithWrapper } from '../shells/_isFC'
import { ShellCushyRightUI } from '../shells/ShellCushy'
import { usePresenter } from './PresenterCtx'
import { widgetsCatalog } from './widgets-catalog'

// 👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇
// Those types are made folling a language design principle:
// every field/config/override is based on what UX people may request
// so we have a quick vocabulary to ajdust look and feel.
// see src/csuite-cushy/presenters/presenter.readme.md
// 👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆

// #region <Render />
// const customRender = (field: Field, p: RENDERER.FieldRenderArgs<any>): ReactNode => {
//     // const { Widget, Wrapper, readonly, label, renderCtx, ...renderProps } = p
//     const { ctx, baseRenderer, ...renderProps } = p
//     // 🔶 shouldn't it be presenter from context instead?
//     // => yes, for now Field.Render provides it to this function (in a very brittle way) via p.baseRenderer
//     const renderer = p.baseRenderer ?? getGlobalRenderer()
//     return renderer.extends(ctx).render(field, renderProps as any)
// }

const CushyRender = ({ field, p }: { field: Field; p: RENDERER.FieldRenderArgs<any> }): ReactNode => {
    const presenter = usePresenter() ?? new Presenter()
    return presenter.render(field, p)
}

// #region 'window' mixin
// Renderer is injected, to help with using csuite in other codebases.
window.RENDERER = {
    Render: CushyRender,
}

// #region Presenter
// see `src/csuite/form/presenters/presenter.readme.md`
/**
 * retrieve * Shell + Slots for each field,
 * and convenient method to call the Wrapper bound to field and slots
 */
export class Presenter {
    rules: PresenterRule<Field>[]

    constructor(
        /** rules are functions that may alter slots for current fields */
        rules: PresenterRule<Field>[] = [],
        /** if parent is given, it's rules will be re-used as fallback */
        parent?: Presenter,
    ) {
        this.rules = parent ? [...parent.rules, ...rules] : rules
    }

    /** create a new Presenter from this one with extra rendering rules */
    extend(rule_: PresenterRule<Field> | PresenterRule<Field>[]): Presenter {
        const rules = Array.isArray(rule_) ? rule_ : [rule_]
        return new Presenter(rules, this)
    }

    /**
     * only to avoid multiple extends within same logical function
     * @internal
     */
    protected pushRules(rule_: PresenterRule<Field> | PresenterRule<Field>[]): void {
        this.rules = Array.isArray(rule_) ? [...this.rules, ...rule_] : [...this.rules, rule_]
    }

    /**
     * MAIN METHOD TO RENDER A FIELD
     * this method is both for humans (calling render on field root)
     * and for fields rendering their childern
     */
    render<FIELD extends Field>(
        //
        field: FIELD,
        config: RenderDSL<FIELD>,
        // extraRules_: PresenterRule<FIELD> | PresenterRule<FIELD>[],
    ): ReactNode {
        // slots accumulator
        let slots: UISlots<FIELD> = {}

        // apply all rules from context
        for (const rule of this.rules) {
            const slots_ = rule(field) as Maybe<UISlots<FIELD>> // 🔴🔴🔴
            if (slots_) slots = mergeDefined(slots, slots_)
        }

        // apply loval overrides
        const { children, childrenRule, globalRules, ...slotOverrides } = config
        slots = mergeDefined(slots, slotOverrides)

        // override body if chidlren is specified
        if (children != null) {
            slots.Body = createElement(QuickForm, { field, items: children(field) })
        }

        // if either childrenRule or globalRules are defined, we need to
        // fork the renderer for children, adding the new rules to the stack
        let childPresenter: Presenter | undefined
        if (childrenRule != null || globalRules != null) {
            childPresenter
        }

        const Shell = slots.Shell ?? defaultPresenterSlots.Shell
        if (!Shell) throw new Error('Shell is not defined')

        // COMPILED
        const UI = widgetsCatalog
        const finalProps: CompiledRenderProps<FIELD> = { field, UI, presenter: this, ...slots }
        if (typeof Shell === 'function') return createElement(Shell, finalProps as any /* 🔴🔴🔴🔴 */)
        else return Shell
    }

    utils = {
        renderFCOrNode: renderFCOrNode,
        renderFCOrNodeWithWrapper: renderFCOrNodeWithWrapper,
        // _isFC: _isFC,
    }
}

export type FCOrNode<P extends object> = CovariantFC<P> | React.ReactNode
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
 *
 * ⭕️ entrypoint; needs to be handled by the presenter
 * Mayby<FC> means:
 *
 *    undefined => don't change anything; keep previous slot value
 *    FC        => use this component for the slot, passing props it expects (that's why most of the FC only accept very few params)
 *    null      => disable the slot; i.e. slot should not be displayed/used
 *    ReactNode => use this react node direclty
 */
export interface UISlots<out FIELD extends Field = Field> {
    // 1. Shell
    // can also be used an escape hatch for 100% custom UI
    /* ⭕️ */ Shell?: FCOrNode<CompiledRenderProps<FIELD>>

    // 2. Direct Slots for this field only
    // heavilly suggested to include in your presenter unless you know what you do
    /* ✅ */ Header?: FCOrNode<{ field: FIELD }>
    /* ✅ */ Body?: FCOrNode<{ field: FIELD }>
    /* ✅ */ Extra?: FCOrNode<{ field: FIELD }>

    // stuff you want to include, possilby in some revealable way
    // based on field.hasError.
    /* 🟢 */ Errors?: FCOrNode<{ field: FIELD }>
    /* 🟢 */ LabelText?: FCOrNode<WidgetLabelTextProps>

    /* 🟢 */ DragKnob?: FCOrNode<NO_PROPS>
    /* 🟢 */ UpDownBtn?: FCOrNode<NO_PROPS>
    /* 🟢 */ DeleteBtn?: FCOrNode<NO_PROPS>

    // bonus features
    /* 🟡 */ Indent?: FCOrNode<WidgetIndentProps>
    /* 🟡 */ UndoBtn?: FCOrNode<{ field: FIELD }>
    /* 🟡 */ Toogle?: FCOrNode<WidgetToggleProps>
    /* 🟡 */ Caret?: FCOrNode<WidgetLabelCaretProps>
    /* 🟡 */ Icon?: FCOrNode<WidgetLabelIconProps>
    /* 🟡 */ Presets?: FCOrNode<WidgetPresetsProps>
    /* 🟡 */ MenuBtn?: FCOrNode<WidgetMenuProps>

    // suggested containers
    /* 🟠 */ ContainerForHeader?: Maybe<FC<WidgetHeaderContainerProps>>
    /* 🟠 */ ContainerForBody?: Maybe<FC<React.HTMLAttributes<HTMLDivElement>>>
    /* 🟠 */ ContainerForSummary?: Maybe<FC<WidgetSingleLineSummaryProps>>

    // ---------------------------------------------------------
    // 3. various other params, mostly to tweak looks
    classNameAroundBodyAndHeader?: Maybe<string>
    classNameAroundBody?: Maybe<string>
    classNameAroundHeader?: Maybe<string>
    classNameForShell?: Maybe<string>
    shouldShowHiddenFields?: Maybe<boolean>
    shouldAnimateResize?: Maybe<boolean>
    // ---------------------------------------------------------
    // 4. Slots for shell
    // stuff you probably don't want to include
    // debug stuff
    /* 🟣 */ DebugID?: Maybe<FC<{ field: Field }>>

    // only for the lolz
    /* 🟥 */ EasterEgg?: Maybe<FC<{ field: Field }>>
}

// #region P.defaults
export const defaultPresenterSlots: UISlots<any> = {
    /* ✅ */ Shell: ShellCushyRightUI,

    // heavilly suggested to include in your presenter unless you know what you do
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

// #region P.setup
export const configureDefaultFieldPresenterComponents = (
    /** so you don't have to polute the rest of your code */
    overrides: Partial<UISlots>,
): void => {
    Object.assign(defaultPresenterSlots, overrides)
}

// #region P.Rule
// export type PresenterRule<out FIELD extends Field> = (field: FIELD) => Maybe<PresenterSlots>
export type PresenterRule<FIELD extends Field> = (field: FIELD) => Maybe<RenderDSL<FIELD>>

export const defaultPresenterRule = <FIELD extends Field>(field: FIELD): RenderDSL<FIELD> => ({
    ...defaultPresenterSlots,

    Header: field.DefaultHeaderUI,
    Body: field.DefaultBodyUI,
    Extra: field.schema.LabelExtraUI,
})

// #region RenderProps

/**
 * this is the type you usually specify when calling <field.UI <...RENDER_DSL...> />
 */
export interface RenderDSL<out FIELD extends Field> //
    // 1️⃣ for self: UISlots + shell + children
    extends UISlots<FIELD> {
    // alternative to specify body; makes it easy to quickly spawn forms with various layouts
    children?: CovariantFn1<FIELD, QuickFormContent[]>

    // 2️⃣ STUFF FOR DIRECT CHILDREN
    // prettier-ignore
    /**
     * > global rules will extend the renderer for the whole UI sub-tree.
     * > note 1: not the whole "model" subtree, but the (JSX) sub-tree
     * > note 2: the rules are templated on FIELD['$Child']
     */
    childrenRule?:
        | PresenterRule<Field >[]
        | CovariantFn1<FIELD, PresenterRule<Field /* FIELD['$Child']['$Field'] */>[]>
        // 👇 better one, but boesn't typecheck
        // 🔴 | PresenterRule<FIELD['$Child']['$Field']>[]
        // 🔴 | CovariantFn1<FIELD, PresenterRule< FIELD['$Child']['$Field'] >[]>
        | RenderDSL<FIELD['$Child']['$Field']>

    // 3️⃣ STUFF FOR ALL DESCENDANTS
    // prettier-ignore
    /**
     * > global rules will extend the renderer for the whole UI sub-tree.
     * > note 1: not the whole "model" subtree, but the (JSX) sub-tree
     * > note 2: the rules are templated on Field, since they need to be executable
     *           for every single possible descendant
     *
     */
    globalRules?: any
        | PresenterRule<Field>[]
        | CovariantFn1<FIELD, PresenterRule<Field>[]>
        | UISlots<Field>
} // globalRules or childrenRule // spreaded for readibility, otherwise it is impossible to use recursively with // 3️⃣ STUF FOR SELF

/**
 * this is the final type that is given to your most of your widgets (Shell, Body, ...)
 * it contains context things like `Presenter`, `field`, and `UI catalog`
 */
export interface CompiledRenderProps<out FIELD extends Field = Field> //
    /** full list of all slots when applying all the rules. */
    extends UISlots<FIELD> {
    /** presenter */
    presenter: Presenter

    /** Field we're currently rendering */
    field: FIELD

    /** catalog of widgets, to ease discoverability and make it easy to use variants. */
    UI: CATALOG.widgets
}
