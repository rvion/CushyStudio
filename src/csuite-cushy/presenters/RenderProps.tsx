import type { BodyContainerProps } from '../../csuite/form/WidgetBodyContainerUI'
import type { WidgetHeaderContainerProps } from '../../csuite/form/WidgetHeaderContainerUI'
import type { WidgetLabelCaretProps } from '../../csuite/form/WidgetLabelCaretUI'
import type { WidgetLabelIconProps } from '../../csuite/form/WidgetLabelIconUI'
import type { WidgetMenuProps } from '../../csuite/form/WidgetMenu'
import type { WidgetSingleLineSummaryProps } from '../../csuite/form/WidgetSingleLineSummaryUI'
import type { Field } from '../../csuite/model/Field'
import type { FCOrNode } from '../../csuite/utils/renderFCOrNode'
import type { WidgetIndentProps } from '../catalog/Indent/WidgetIndentUI'
import type { WidgetPresetsProps } from '../catalog/Presets/WidgetPresets'
import type { WidgetTitleProps } from '../catalog/Title/WidgetLabelTextUI'
import type { CushyHeadProps } from '../shells/CushyHead'
import type { RenderPropsCompiled } from './RenderPropsCompiled'
import type { RenderRule, RenderRule_asList, RenderRuleFn } from './RenderRule'
import type { FC, ReactNode } from 'react'

// #region Slots
/**
 * ui config forwarded to your selected Shell.
 * if you create your own shells, you're advised to take into account given props
 *
 * ✅ really recommended
 * 🟢 recommanded
 * 🟡 optional
 * 🟠 very optional
 * 🟣 not recommended
 * 🟥 really not recommended
 *
 * Mayby<FC> means:
 *    undefined => don't change anything; keep previous slot value
 *    FC        => use this component for the slot, passing props it expects (that's why most of the FC only accept very few params)
 *    null      => disable the slot; i.e. slot should not be displayed/used
 *    ReactNode => use this react node direclty
 */

export type UIPropsFor<FIELD extends Field> = Omit<RenderProps<FIELD>, 'Shell'> & { field: FIELD }

export interface StandardProps<FIELD extends Field = Field> {
   wrappers: { rp: UIPropsFor<FIELD>; className?: string; children: ReactNode }
}

export type RenderPropsFlat<out FIELD extends Field = Field> = Omit<
   // we need a version without subrules so it's not recusrive
   RenderProps<FIELD>,
   'rules'
>

export interface RenderProps<out FIELD extends Field = Field> {
   // todo
   // noInherit?: boolean

   /**
    * The component that will receive all those props. It's the main container for the field to be rendered.
    * it will handle the compositing the various element of the field (menu, errors, label, etc.)
    * note: passing a custom function serve as an escape hatch for a 100% custom UI
    */
   Shell?: FCOrNode<RenderPropsCompiled<FIELD>>

   /**
    * list of rules injected for itself and its *visual* children
    * note: a bit like CSS rules, except with stuff to swap components / props / etc.
    */
   // prettier-ignore
   rules?:
      // a simple set of rules
      | RenderRule<Field>[]

      // a dynamic set of rules injected by the field
      | RenderRuleFn<FIELD>

   /**
    * if specified, css rules will be matched as if the given
    * field was a direct child of given field.
    */
   virtualParent?: Field

   /** instruct the components to pretend config has been overriten with that */
   config?: Partial<FIELD['{config}']>

   /**
    * instruct the components to pretend config has been overriten with that
    * very similar to `config`, but show less fields in the completion, so may be a bit
    * simpler to explore field-specific config
    */
   ownConfig?: Partial<FIELD['{ownConfig}']>

   // when you want to wrap your whole shell into some dedicated component
   // e.g. a form, a modal, a card, etc.
   // very very common use-case
   /* ✅ */ Decoration?: FCOrNode<StandardProps<FIELD>['wrappers']>

   // for when you want to add something above/below a field ui without changing how it's rendered
   // very very common use-case
   /* ✅ */ OnTop?: FCOrNode<{ field: FIELD }>
   /* ✅ */ OnBottom?: FCOrNode<{ field: FIELD }>
   /* ✅ */ OnLeft?: FCOrNode<{ field: FIELD }>
   /* ✅ */ OnRight?: FCOrNode<{ field: FIELD }>

   // 2. Direct Slots for this field only
   // heavilly suggested to include in your presenter unless you know what you do
   /* ✅ */ Head?: FCOrNode<CushyHeadProps>
   /* ✅ */ Header?: FCOrNode<UIPropsFor<FIELD>>
   /* ✅ */ Body?: FCOrNode<UIPropsFor<FIELD>>
   /* ✅ */ Extra?: FCOrNode<UIPropsFor<FIELD>>

   // stuff you want to include, possilby in some revealable way
   // based on field.hasError.
   /* 🟢 */ Errors?: FCOrNode<UIPropsFor<FIELD>>
   /* 🟢 */ Title?: FCOrNode<WidgetTitleProps>

   /* 🟢 */ DragKnob?: FCOrNode<UIPropsFor<FIELD>>
   /* 🟢 */ UpDownBtn?: FCOrNode<UIPropsFor<FIELD>>
   /* 🟢 */ DeleteBtn?: FCOrNode<UIPropsFor<FIELD>>

   // bonus features
   /* 🟡 */ Indent?: FCOrNode<WidgetIndentProps>
   /* 🟡 */ UndoBtn?: FCOrNode<UIPropsFor<FIELD>>
   /* 🟡 */ Toogle?: FCOrNode<UIPropsFor<FIELD>>
   /* 🟡 */ Caret?: FCOrNode<UIPropsFor<FIELD> & WidgetLabelCaretProps>
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
   className?: Maybe<string>

   shouldShowHiddenFields?: Maybe<boolean>
   shouldAnimateResize?: Maybe<boolean>
   collapsible?: boolean

   // ---------------------------------------------------------
   // 4. Slots for shell
   // stuff you probably don't want to include
   // debug stuff
   /* 🟣 */ DebugID?: Maybe<FC<{ field: Field }>>
}
