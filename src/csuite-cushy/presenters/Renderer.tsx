import type { Field } from '../../csuite/model/Field'
import type { RenderProps } from './RenderProps'
import type { RenderPropsCompiled } from './RenderPropsCompiled'
import type { ReactNode } from 'react'

import { FieldSelector } from '../../csuite/selector/selector'
import { extractComponentName } from '../../csuite/utils/extractComponentName'
import { mergeDefined } from '../../csuite/utils/mergeDefined'
import { _isFC, renderFCOrNode, renderFCOrNodeWithWrapper } from '../../csuite/utils/renderFCOrNode'
import { type RenderCtx, rendererCtx } from './RenderCtx'
import {
   convertShortRule,
   type RenderRule,
   type RenderRule_asList,
   type RenderRuleFlat,
   type RenderRuleFn,
} from './RenderRule'
import { RenderUI } from './RenderUI'

// prettier-ignore
type FlattenableRule =
   | undefined           // 1 == null
   | null                // 2 == null
   | RenderProps<Field>  // 3 typeof === 'object'
   | RenderRuleFn<Field> // 4 typeof === 'function'
   | RenderRule<Field>[] // 5 Array.isArray

// see `src/csuite/form/presenters/presenter.readme.md`
/**
 * retrieve * Shell + Slots for each field,
 * and convenient method to call the Wrapper bound to field and slots
 */
export class Renderer {
   static count = 0
   constructor(public rootField: Field) {
      Renderer.count++
   }

   private flattenRules(
      //
      field: Field,
      flattenables: FlattenableRule[],
   ): RenderRuleFlat<Field>[] {
      const out: RenderRuleFlat<Field>[] = []

      // step 1.
      const queue: FlattenableRule[] = flattenables
      // for (const flattenable of flattenables) {
      //    this.flattenRule(field, flattenable, out, queue)
      // }

      // step 2.
      let max = 100
      while (queue.length > 0 && max--) {
         const flattenable = queue.shift()
         this.flattenRule(field, flattenable, out, queue)
      }
      return out
   }

   private flattenRule(
      field: Field,
      rulesDef: FlattenableRule,
      rules: RenderRuleFlat<Field>[],
      queue: FlattenableRule[],
   ) {
      // 1, 2
      if (rulesDef == null) {
         return
      }

      // 3
      if (typeof rulesDef === 'object' && !Array.isArray(rulesDef)) {
         // rulesDef = { rules: [rulesDef] }
         const rule: RenderRule<Field> = {
            pattern: field,
            renderProps: rulesDef,
            addedBy: field,
            priority: 99,
         }
         rulesDef = [rule]
         // and continue to step 5
      }

      // 4
      if (typeof rulesDef === 'function') {
         rulesDef = this._evalRenderRuleFn(field, rulesDef)
         // and continue to step 5
      }

      // 5
      if (Array.isArray(rulesDef)) {
         for (const rule of rulesDef) {
            rules.push({
               pattern: rule.pattern,
               renderPropsFlat: rule.renderProps,
               addedBy: rule.addedBy,
               priority: rule.priority,
            })
            if (rule.renderProps.rules != null) {
               queue.push(rule.renderProps.rules)
            }
         }
         return
      }

      //
      throw new Error(`rulesDef is not an array or a function`)
   }

   private _evalRenderRuleFn(field: Maybe<Field>, uiFn: RenderRuleFn<any>): RenderRule<Field>[] {
      if (field == null) throw new Error('form not loaded yet')

      const extraRules: RenderRule<any>[] = []
      const OUT: RenderProps = {}

      function set<F extends Z.Field>(...props: RenderRule_asList<F>): void
      function set<F extends Z.Field>(prop: RenderProps<any>): void
      function set(...props: any[]) {
         // self rule
         if (props.length === 1) {
            Object.assign(OUT, props[0])
            extraRules.push({ pattern: field, renderProps: props[0], addedBy: field, priority: 99 })
         }
         // child rule
         else {
            const extraRule = convertShortRule(props as RenderRule_asList<any>)
            extraRules.push(extraRule)
         }
      }

      uiFn(field, set)
      return extraRules
   }

   /**
    * MAIN METHOD TO RENDER A FIELD
    * this method is both for humans (calling render on field root)
    * and for fields rendering their childern
    */
   render<FIELD extends Field>(
      //
      field: FIELD,
      ctx: RenderCtx<FIELD>,
      renderProps: RenderProps<FIELD>,
   ): ReactNode {
      // {
      //    // updated list of rules to inject to children
      //    rules: RenderRuleFlat<Field>[]
      //    // and react node for this field
      //    reactNode: ReactNode
      // }
      const { /* field, */ ancestors } = ctx
      const debug = false // field.path === '...'

      console.log(`[🔴] >>>>>>>> `, field.zPath, field.zUid)
      // all rules applied
      const selfUIUI: RenderProps<FIELD> | RenderRule<FIELD>[] = field.zConfig.uiui as any
      const NEWRULESNORM: RenderRuleFlat<Field>[] = this.flattenRules(field, [selfUIUI, renderProps])

      // massive optimization here; just support arbitrary nested arrays
      // and ache the object so we never spread stuff
      const rules: RenderRuleFlat<Field>[] = [...ctx.rules, ...NEWRULESNORM]

      // override parents if need be
      const virtualParents: Map<Field, Field> = new Map<Field, Field>()
      for (let i = 0; i < ancestors.length - 1; i++) {
         const parent_ = ancestors[i]!.field
         const child_ = ancestors[i + 1]!.field
         if (child_.zParent !== parent_) virtualParents.set(child_, parent_)
      }

      const directParent_ = ancestors[ancestors.length - 1]?.field
      if (directParent_ && field.zParent !== directParent_) virtualParents.set(field, directParent_)
      // if (virtualParents.size > 0)
      //    console.log(`[      🟢 >] rendering ${field.path} at ${getVisualPath(ctx)}`, virtualParents)

      let slots: RenderProps<FIELD> = {}
      // eval rule from config
      // if (field.config.uiui != null) xxx.evalRule(field.config.uiui, RENDER_PRIORITY_UIUI)
      for (const rule of rules) {
         const isMatching = FieldSelector.match(rule.pattern, field, virtualParents)

         if (isMatching) {
            const newSlots = rule.renderPropsFlat as RenderProps<FIELD>
            if (newSlots != null && Object.keys(newSlots).length > 0) {
               slots = mergeDefined(slots, newSlots)
            }
         }
      }
      const Shell = slots.Shell

      // COMPILED
      const finalProps: RenderPropsCompiled<FIELD> = {
         field,
         presenter: this,
         ...slots,
      }

      if (debug) this.debugFinalProps(finalProps)
      // if (field.path === '$.latent.b.image.resize') this.debugFinalProps(finalProps)
      // console.log(`[🤠] Shell for ${field.path} is `, Shell)
      // console.log(`[🦊] slots for`, field.path, slots)
      // console.log(`[🦊🟢FINAL] slots for`, field.path, slots.Head)
      // return renderFCOrNode(Shell, finalProps)
      const nextCtx: RenderCtx = { field, ancestors: [...ctx.ancestors, ctx], renderer: this, rules }
      return <rendererCtx.Provider value={nextCtx}>{renderFCOrNode(Shell, finalProps)}</rendererCtx.Provider>
      // return {
      //    rules: rules,
      //    reactNode: renderFCOrNode(Shell, finalProps),
      // }
   }

   debugFinalProps(finalProps: RenderPropsCompiled<any>): void {
      console.log(`[🦊----------->>>>>] `, finalProps.field.path, this.explainSlots(finalProps))
   }

   private explainSlots(slots: RenderProps<any>): Record<string, any> {
      return Object.fromEntries(
         Object.entries(slots).map(([k, v]) => [
            k,
            _isFC(v) && 'type' in v ? (extractComponentName(v.type) ?? v) : v,
         ]),
      )
   }

   utils = {
      renderFCOrNode: renderFCOrNode,
      renderFCOrNodeWithWrapper: renderFCOrNodeWithWrapper,
   }
}

// #region 'window' mixin
// Renderer is injected, to help with using csuite in other codebases.
window.RENDERER = {
   Render: RenderUI,
}

function isBool(x: unknown): x is boolean {
   return typeof x === 'boolean'
}

// fieldRenderers: WeakMap<Field, RenderXXX<any>> = new WeakMap()
// getFieldRenderer<FIELD extends Field>(field: FIELD): RenderXXX<FIELD> {
//    let proc = this.fieldRenderers.get(field)
//    if (proc == null) {
//       proc = new RenderXXX(this, field)
//       this.fieldRenderers.set(field, proc)
//    }
//    return proc
// }

/** all fields in document */
// get allFields(): Field[] {
//    const fields: Field[] = []
//    this.rootField.traverseAllDepthFirst((field) => {
//       fields.push(field)
//    })
//    return fields
// }

// get allFieldRenderers(): RenderXXX<Field>[] {
//    return this.allFields.map((field) => this.getFieldRenderer(field))
// }

// get allRules(): RuleEntry[] {
//    return this.allFieldRenderers
//       .flatMap((proc) => proc.final.rulesForSubtree)
//       .concat(defaultRulesV2)
//       .sort((a, b) => a.priority - b.priority)
// }
