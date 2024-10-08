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

import { ShellLinkUI } from '../../csuite/fields/link/WidgetLink'
import { ShellOptionalUI } from '../../csuite/fields/optional/WidgetOptional'
import { isFieldLink, isFieldOptional } from '../../csuite/fields/WidgetUI.DI'
import { type BodyContainerProps, WidgetBodyContainerUI } from '../../csuite/form/WidgetBodyContainerUI'
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
import { type CushyHeadProps, CushyHeadUI } from '../shells/CushyHead'
import { ShellCushyLeftUI } from '../shells/ShellCushy'
import { PresenterCtx, usePresenterOrNull } from './PresenterCtx'
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
    const presenter = usePresenterOrNull() ?? new Presenter()

    return (
        <PresenterCtx.Provider value={presenter}>
            {/*  */}
            {presenter.render(field, p)}
        </PresenterCtx.Provider>
    )
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
    /** list of all the ruleOrConf, indexed by field, added during this presenter lifecycle  */
    private rulesForField: Map<Field, RuleOrConf<Field>[]> = new Map()
    private rulesForAllFields: { whenUnderPath: string; ruleOrConf: RuleOrConf<Field> }[] = []
    private rulesForChildrenOf: Map<Field, RuleOrConf<Field>[]> = new Map()
    private rulesForChildrenOfFieldWithTypes: Map<CATALOG.AllFieldTypes, RuleOrConf<Field>[]> = new Map()

    /** retrive the stack of rules previously pre-planned for this FIELD */
    // getRulesFor<FIELD extends Field>(field: FIELD): RuleOrConf<FIELD>[] {
    //     const out: RuleOrConf<FIELD>[] = []
    //     // eslint-disable-next-line consistent-this
    //     let at: Maybe<Presenter> = this
    //     while (at != null) {
    //         const y = (this.rulesForField.get(field) ?? []) as RuleOrConf<FIELD>[]
    //         out.push(...y)
    //         at = at.parent
    //     }
    //     return out
    // }

    constructor /** if parent is given, it's rules will be re-used as fallback */() {} // public parent?: Presenter,

    // 💬 2024-10-06 rvion:
    // | 🔴 <Render /> should alwyas inject a new Presenter in context, since
    // | I"m no longer going to extend those anymore.

    /** create a new Presenter from this one with extra rendering rules */
    // extend(entries: [Field, RuleOrConf<Field>[]][]): Presenter {
    //     return new Presenter(this).pushRules(entries)
    // }

    /**
     * MAIN METHOD TO RENDER A FIELD
     * this method is both for humans (calling render on field root)
     * and for fields rendering their childern
     */
    render<FIELD extends Field>(
        //
        field: FIELD,
        finalRuleOrConf: DisplayConf<FIELD>,
        // extraRules_: PresenterRule<FIELD> | PresenterRule<FIELD>[],
    ): ReactNode {
        // ⏸️ console.log(`[💄] rendering ${field.path}`)
        // slots accumulator
        let slots: WidgetSlots<FIELD> = defaultPresenterRule(field)
        const catalog = widgetsCatalog

        /**
         * a field can add rules for  any of it's children, not only itself.
         * that where the magic happen; since fields know the extra type of their children,
         * any field can quickly add a bunch of rule for all of it's descendants.
         */
        const addForField = <SUB extends Field>(sub: Maybe<SUB>, ruleOrConf: RuleOrConf<SUB>): any => {
            if (sub == null) return
            let sub_ = sub as Field
            if (sub_ === field) {
                // ⏸️ console.log(`[💄@${sub.path} ] adding a self rule (why though❓); merging it right now`)
                evalRuleOrConf(ruleOrConf as RuleOrConf<FIELD>)
            } else {
                // ⏸️ console.log(`[💄] adding a rule for (${field.path})`, ruleOrConf)
                const prev = this.rulesForField.get(sub_) ?? []
                this.rulesForField.set(sub_, [...prev, ruleOrConf])
            }
        }

        const addForAllFields = (globalRule: RuleOrConf<Field>): void => {
            this.rulesForAllFields.push({
                whenUnderPath: field.path,
                ruleOrConf: globalRule,
            })
        }

        const addForChildrenOf = <SUB extends Field>(sub: SUB, ruleOrConf: RuleOrConf<SUB['$Child']>): void => {
            const prev = this.rulesForChildrenOf.get(sub) ?? []
            this.rulesForChildrenOf.set(sub, [...prev, ruleOrConf])
        }

        const addForChildrenOfFieldWithTypes = (type: CATALOG.AllFieldTypes, ruleOrConf: RuleOrConf<Field>): void => {
            const prev = this.rulesForChildrenOfFieldWithTypes.get(type) ?? []
            this.rulesForChildrenOfFieldWithTypes.set(type, [...prev, ruleOrConf])
        }

        /**
         * render SHOULD ONLY (!!) eval rules for current (FIELD)
         * enforce at type-level here                  VVVVV */
        const evalRuleOrConf = (ruleOrConf: RuleOrConf<FIELD>): void => {
            if (typeof ruleOrConf === 'function') {
                const _slots = ruleOrConf({
                    field,
                    catalog,
                    apply: (x) => evalRuleOrConf(x),
                    forField: addForField,
                    forAllFields: addForAllFields,
                    forChildrenOf: addForChildrenOf,
                    forChildrenOfFieldWithTypes: addForChildrenOfFieldWithTypes,
                    presets,
                }) as Maybe<WidgetSlots<FIELD>> // 🔴🔴🔴
                if (_slots) slots = mergeDefined(slots, _slots)
            } else {
                const { rule, global, ...slotsOverride } = ruleOrConf
                slots = mergeDefined(slots, slotsOverride)
                if (rule != null) {
                    evalRuleOrConf(rule)
                }
                // TODO do we want to simplify this
                if (global != null) {
                    this.rulesForAllFields.push({ whenUnderPath: field.path, ruleOrConf: global })
                    evalRuleOrConf(global as RuleOrConf<FIELD> /* 🔶 cast probably necessary */)
                }
                // ⏸️ console.log(`[💄]    | slots are merged`)
            }
        }
        // #region EVALUATING/MERGING ALL RULES

        // eval all rules from context
        const rule_viaForField = (this.rulesForField.get(field) ?? []) as RuleOrConf<FIELD>[]
        // ⏸️ console.log(`[💄]    | ${rule_viaForField.length} rules in context:`, rule_viaForField)
        for (const ruleOrConf of rule_viaForField) {
            evalRuleOrConf(ruleOrConf)
        }

        if (field.parent) {
            // eval all parent rules
            const rule_viaForParent = (this.rulesForChildrenOf.get(field.parent) ?? []) as RuleOrConf<FIELD>[]
            // ⏸️ console.log(`[💄]    | ${rule_viaForParent.length} rules in context:`, rule_viaForParent)
            for (const ruleOrConf of rule_viaForParent) {
                evalRuleOrConf(ruleOrConf)
            }

            // eval all parent/type rules
            const rule_viaForParentType = (this.rulesForChildrenOfFieldWithTypes.get(field.parent.type) ??
                []) as RuleOrConf<FIELD>[]
            // ⏸️ console.log(`[💄]    | ${rule_viaForParentType.length} rules in context:`, rule_viaForParentType)
            for (const ruleOrConf of rule_viaForParentType) {
                evalRuleOrConf(ruleOrConf)
            }
        }

        // eval all global rules from compatible prefixes
        for (const { whenUnderPath, ruleOrConf } of this.rulesForAllFields) {
            if (field.path.startsWith(whenUnderPath)) {
                // ⏸️ console.log(`[💄]    | plus global rule:`, ruleOrConf)
                evalRuleOrConf(ruleOrConf as RuleOrConf<FIELD> /* 🔶 cast probably necessary */)
            }
        }

        // eval rule from config
        if (field.config.uiui != null) {
            evalRuleOrConf(field.config.uiui)
        }

        // eval last ruleOrConf passed as parameter
        // ⏸️ console.log(`[💄]    | plus current rule:`, finalRuleOrConf)
        evalRuleOrConf(finalRuleOrConf)

        // 🎉 slots should now be defined / compiled !

        // #region MAKING SENSE OF THE COMPILED SLOTS OBJECT

        // override `Body` if `chidlren` is specified
        const layout = slots.layout
        if (layout != null) {
            slots.Body = createElement(QuickForm, { field, items: layout(field) })
        }

        // 💬 2024-10-06 rvion:
        // | no longer true
        // 🔶 // if either childrenRule or globalRules are defined, we need to
        // 🔶 // fork the renderer for children, adding the new rules to the stack
        // 🔶 if (childrenRule != null || globalRules != null) {
        // 🔶     // function extractRules(x: ChildrenRules<FIELD>): void {
        // 🔶     //     if (typeof x === 'function') x({ field, catalog, apply })
        // 🔶     //     else apply(x)
        // 🔶     // }
        // 🔶     // if (childrenRule != null) {
        // 🔶     //     const rules = extractRules(childrenRule)
        // 🔶     //     childPresenter.pushRules(rules)
        // 🔶     // }
        // 🔶     if (globalRules != null) {
        // 🔶         if (typeof globalRules === 'function') globalRules({ field, catalog, apply })
        // 🔶         else apply(globalRules)
        // 🔶         // childPresenter.pushRules(rules)
        // 🔶     }
        // 🔶 }
        // 🔶 // }

        // bad logic
        const Shell = slots.ShellName
            ? catalog.Shell[slots.ShellName]
            : slots.Shell //
              ? slots.Shell
              : defaultPresenterSlots.Shell
        console.log(`[🤠] slots.ShellName`, slots.ShellName, field.path, Shell === catalog.Shell.Inline)
        if (!Shell) throw new Error('Shell is not defined')

        // COMPILED
        const UI = widgetsCatalog
        const finalProps: CompiledRenderProps<FIELD> = { field, UI, presenter: this, ...slots }

        // console.log(`[🤠] Shell for ${field.path} is `, Shell)
        return renderFCOrNode(Shell, finalProps)
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
export interface WidgetSlots<out FIELD extends Field = Field> {
    layout?: CovariantFn1<FIELD, QuickFormContent[]>
    // 1. Shell
    // can also be used an escape hatch for 100% custom UI
    /* ⭕️ */ Shell?: FCOrNode<CompiledRenderProps<FIELD>>
    /* ⭕️ */ ShellName?: keyof CATALOG.widgets['Shell']

    // 2. Direct Slots for this field only
    // heavilly suggested to include in your presenter unless you know what you do
    /* ✅ */ Head?: FCOrNode<CushyHeadProps>
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
    /* 🟠 */ ContainerForBody?: Maybe<FC<BodyContainerProps>>
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

// #region P.setup
export const configureDefaultFieldPresenterComponents = (
    /** so you don't have to polute the rest of your code */
    overrides: Partial<WidgetSlots>,
): void => {
    Object.assign(defaultPresenterSlots, overrides)
}

// type RuleFor<FIELD extends Field = Field> = CovariantFn<[field: FIELD, fn: any], UISlots<FIELD> | undefined>

// #region P.Rule
// export type PresenterRule<out FIELD extends Field> = (field: FIELD) => Maybe<PresenterSlots>

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

// #region RenderProps

// prettier-ignore
export type RuleOrConf<FIELD extends Field> =
    | DisplayRule<FIELD>
    | DisplayConf<FIELD> // RenderDSL<FIELD['$Child']['$Field']>

const typed = <T extends any>(t: T): T => t

const presets = {
    noLabel: typed<DisplayConf<any>>({ LabelText: null, Icon: null, Indent: null }),
    // inline() {},
}

export type DisplayRuleCtx<FIELD extends Field = Field> = {
    field: FIELD
    apply(x: RuleOrConf<FIELD>): void
    forField<Sub extends Field>(field: Maybe<Sub>, x: RuleOrConf<Sub>): void
    forChildrenOf<Sub extends Field>(field: Sub, x: RuleOrConf<Sub['$Child']>): void
    forChildrenOfFieldWithTypes<T extends CATALOG.AllFieldTypes>(type: T, x: RuleOrConf<Field>): void
    forAllFields(x: RuleOrConf<Field>): void
    catalog: CATALOG.widgets
    presets: typeof presets
}

export type DisplayRule<FIELD extends Field> = CovariantFn1<DisplayRuleCtx<FIELD>, WidgetSlots<FIELD> | undefined | void>

/**
 * this is the type you usually specify when calling <field.UI <...RENDER_DSL...> />
 */
export interface DisplayConf<out FIELD extends Field> //
    // 1️⃣ for self: UISlots + shell + children
    extends WidgetSlots<FIELD> {
    layout?: CovariantFn1<FIELD, QuickFormContent[]>
    rule?: RuleOrConf<FIELD>
    global?: RuleOrConf<Field> // | null | undefined | void
}

/**
 * this is the final type that is given to your most of your widgets (Shell, Body, ...)
 * it contains context things like `Presenter`, `field`, and `UI catalog`
 */
export interface CompiledRenderProps<out FIELD extends Field = Field> //
    /** full list of all slots when applying all the rules. */
    extends WidgetSlots<FIELD> {
    /** presenter */
    presenter: Presenter

    /** Field we're currently rendering */
    field: FIELD

    /** catalog of widgets, to ease discoverability and make it easy to use variants. */
    UI: CATALOG.widgets
}
