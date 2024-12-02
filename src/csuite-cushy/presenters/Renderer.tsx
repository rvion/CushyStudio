import type { DisplaySlots } from './RenderSlots'
import type { CompiledRenderProps, DisplaySlotExt } from './RenderTypes'
import type { ReactNode } from 'react'

import { createElement } from 'react'

import { Field } from '../../csuite/model/Field'
import { FieldSelector } from '../../csuite/selector/selector'
import { extractComponentName } from '../../csuite/utils/extractComponentName'
import { mergeDefined } from '../../csuite/utils/mergeDefined'
import { _isFC, renderFCOrNode, renderFCOrNodeWithWrapper } from '../../csuite/utils/renderFCOrNode'
import { QuickForm } from '../catalog/group/QuickForm'
import { widgetsCatalog } from './RenderCatalog'
import { defaultPresenterRule } from './RenderDefaults'
import { renderPresets } from './RenderPresets'
import { RenderUI } from './RenderUI'

// 👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇
// Those types are made folling a language design principle:
// every field/config/override is based on what UX people may request
// so we have a quick vocabulary to ajdust look and feel.
// see src/csuite-cushy/presenters/presenter.readme.md
// 👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆

// #region Presenter
// see `src/csuite/form/presenters/presenter.readme.md`
/**
 * retrieve * Shell + Slots for each field,
 * and convenient method to call the Wrapper bound to field and slots
 */
export class Presenter {
   /** list of all the ruleOrConf, indexed by field, added during this presenter lifecycle  */
   rules: {
      addedBy: Field | null
      selector: FieldSelector
      uiconf: DisplaySlotExt<Field>
   }[] = []

   constructor(rootField: Field) {
      this.rules.push({
         addedBy: null,
         selector: FieldSelector.from(''),
         uiconf: defaultPresenterRule,
      })
   }
   /**
    * MAIN METHOD TO RENDER A FIELD
    * this method is both for humans (calling render on field root)
    * and for fields rendering their childern
    */
   render<FIELD extends Field>(
      //
      field: FIELD,
      finalRuleOrConf: DisplaySlots<FIELD>,
      // extraRules_: PresenterRule<FIELD> | PresenterRule<FIELD>[],
   ): ReactNode {
      // ⏸️ console.log(`[💄] rendering ${field.path}`)
      // slots accumulator
      let slots: DisplaySlots<FIELD> = {} //

      // 🔴 SUPER SLOW
      this.rules = this.rules.filter((rule) => rule.addedBy !== field)

      // console.log(`[🤠] ${field.pathExt}`)
      // const shouldLog = field.pathExt === '📄[group]-latent->[link]-b->[choices]-emptyLatent->[group]-batchSize->[shared]'

      const self = this

      /**
       * a field can add rules for  any of it's children, not only itself.
       * that where the magic happen; since fields know the extra type of their children,
       * any field can quickly add a bunch of rule for all of it's descendants.
       */
      function /* A */ addForField(x: DisplaySlotExt<FIELD>): void
      function /* B */ addForField(selector: string, x: DisplaySlotExt<Field>): void
      function /* C */ addForField(selector: FieldSelector, x: DisplaySlotExt<Field>): void
      function /* D */ addForField<Sub extends Field>(field: Maybe<Sub>, x: DisplaySlotExt<Sub>): void
      function addForField<SUB extends Field>(
         x: unknown,
         y?: unknown,
         // sub: Maybe<SUB>,
         // ruleOrConf: RuleOrConf<SUB>,
      ): void {
         // #region A
         if (y === undefined) {
            evalRuleOrConf(x as DisplaySlotExt<FIELD>)
            return
         }

         // #region B
         if (typeof x === 'string') {
            const selectorStr = x as string
            const selector = FieldSelector.from(selectorStr)
            const ruleOrConf = y as DisplaySlotExt<Field>
            self.rules.push({ selector, addedBy: field, uiconf: ruleOrConf })
            return
         }

         // #region  C
         if (x instanceof FieldSelector) {
            const ruleOrConf = y as DisplaySlotExt<Field>
            self.rules.push({ selector: x, addedBy: field, uiconf: ruleOrConf })
            return
         }

         // #region D
         if (x instanceof Field) {
            const ruleOrConf = y as DisplaySlotExt<SUB>
            if (x === field) {
               evalRuleOrConf(ruleOrConf as DisplaySlotExt<FIELD>)
               return
            }
            const sub = x as SUB
            self.rules.push({
               selector: FieldSelector.from(sub.path),
               addedBy: field,
               uiconf: ruleOrConf,
            })
         }
      }

      /**
       * render SHOULD ONLY (!!) eval rules for current (FIELD)
       * enforce at type-level here                  VVVVV */
      const evalRuleOrConf = (ruleOrConf: DisplaySlotExt<FIELD>): void => {
         if (typeof ruleOrConf === 'function') {
            const _slots = ruleOrConf({
               field,
               set: addForField,
               presets: renderPresets,
            }) as Maybe<DisplaySlots<FIELD>> // 🔴🔴🔴
            if (_slots) slots = mergeDefined(slots, _slots)
         } else {
            const { rule, ...slotsOverride } = ruleOrConf
            slots = mergeDefined(slots, slotsOverride)
            if (rule != null) {
               evalRuleOrConf(rule)
            }
         }
      }
      // #region EVALUATING/MERGING ALL RULES

      // eval rule from config
      if (field.config.uiui != null) {
         evalRuleOrConf(field.config.uiui)
      }

      const debug = null // '$.latent.b' // '$.positive'
      for (const rule of this.rules) {
         const isMatching = field.matches(rule.selector)
         if (field.path === debug)
            console.log(
               `[🤠] ${field.pathExt}`,
               isMatching ? '🟢' : '🔴',
               rule.selector.selector,
               typeof rule.uiconf !== 'function' ? this.explainSlots(rule.uiconf) : '<function...>',
            )
         if (isMatching) evalRuleOrConf(rule.uiconf as DisplaySlotExt<FIELD>)
      }

      evalRuleOrConf(finalRuleOrConf)

      // #region MAKING SENSE OF THE COMPILED SLOTS OBJECT

      // override `Body` if `chidlren` is specified
      const layout = slots.layout
      if (layout != null) {
         slots.Body = createElement(QuickForm, { field, items: layout(field) })
      }

      // bad logic
      const Shell = slots.ShellName
         ? UY.Shell[slots.ShellName]
         : slots.Shell //
           ? slots.Shell
           : UY.Shell.Default

      // console.log(`[🤠] slots.ShellName`, slots.ShellName, field.path, Shell === catalog.Shell.Inline)
      if (!Shell) throw new Error('Shell is not defined')

      // COMPILED
      const finalProps: CompiledRenderProps<FIELD> = { field, UI: UY, presenter: this, ...slots }

      if (field.path === debug) this.debugFinalProps(finalProps)
      // if (field.path === '$.latent.b.image.resize') this.debugFinalProps(finalProps)
      // console.log(`[🤠] Shell for ${field.path} is `, Shell)
      return renderFCOrNode(Shell, finalProps)
   }

   debugFinalProps(finalProps: CompiledRenderProps<any>): void {
      console.log(`[🤠] `, finalProps.field.path, this.explainSlots(finalProps))
   }
   private explainSlots(slots: DisplaySlots<any>): Record<string, any> {
      return Object.fromEntries(
         Object.entries(slots).map(([k, v]) => [
            k,
            _isFC(v) && 'type' in v //
               ? (extractComponentName(v.type) ?? v)
               : v,
         ]),
      )
   }

   utils = {
      renderFCOrNode: renderFCOrNode,
      renderFCOrNodeWithWrapper: renderFCOrNodeWithWrapper,
      // _isFC: _isFC,
   }
}

// #region 'window' mixin
// Renderer is injected, to help with using csuite in other codebases.
window.RENDERER = {
   Render: RenderUI,
}
