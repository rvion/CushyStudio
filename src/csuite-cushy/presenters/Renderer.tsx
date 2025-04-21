import type { Field, FL_FieldPath, FL_FieldPathNice } from '../../csuite/model/Field'
import type { RenderProps } from './RenderProps'
import type { RenderPropsCompiled } from './RenderPropsCompiled'
import type { ReactNode } from 'react'

import { FieldSelector } from '../../csuite/selector/selector'
import { bang } from '../../csuite/utils/bang'
import { extractComponentName } from '../../csuite/utils/extractComponentName'
import { mergeDefined } from '../../csuite/utils/mergeDefined'
import {
   _isFC,
   type FCOrNode,
   renderFCOrNode,
   renderFCOrNodeWithWrapper,
} from '../../csuite/utils/renderFCOrNode'
import { normalizePattern, toRawFieldSelector } from './normalizePattern'
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
type FlattenableRule<FIELD extends Field = Field> =
   | undefined           // 1 == null
   | null                // 2 == null
   | RenderProps<FIELD>  // 3 typeof === 'object'
   | RenderRuleFn<FIELD> // 4 typeof === 'function'
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

   static normalizeRule(
      /** field adding the rule */
      field: Field,

      /** rule definrion */
      intent: FlattenableRule,

      // prefixForNestedSelector = '',
   ) {
      const out: RenderRuleFlat<Field>[] = []
      type QueueItem = { rule: FlattenableRule; prefixForNestedSelector: string }
      const queue: QueueItem[] = [
         {
            rule: intent,
            prefixForNestedSelector: ``,
            // prefixForNestedSelector: `#${field.zUid}`,
         },
      ]

      // step 2.
      let max = 100
      while (queue.length > 0 && max--) {
         const entry: QueueItem = queue.shift()!
         let rule = entry.rule
         // console.log(`[🤠] ${100 - max} with (${entry.prefixForNestedSelector})`)

         // 1, 2 (null / undefined)
         if (rule == null) continue

         // 3 (object ==> renderProps)
         if (typeof rule === 'object' && !Array.isArray(rule)) {
            rule = [{ at: field, props: rule, /* addedBy: field, */ priority: 99 }] // => 5
         }

         // 4 (function ==> renderRule)
         if (typeof rule === 'function') {
            rule = this._evalRenderRuleFn(field, rule, entry.prefixForNestedSelector) // => 5
         }

         // 5
         if (Array.isArray(rule)) {
            for (const subrule of rule) {
               const newRule: RenderRuleFlat<Field> = this.removeUndefs({
                  at: subrule.at,
                  propsFlat: subrule.props,
                  // addedBy: subrule.addedBy,
                  priority: subrule.priority,
               })
               out.push(newRule)
               if (subrule.props.rules != null) {
                  const prefixForNestedSelector = toRawFieldSelector(newRule.at)
                  queue.push({ rule: subrule.props.rules, prefixForNestedSelector })
               }
            }
            continue
         }

         // we should have it a continue here already
         throw new Error(`rulesDef is not an array or a function`)
      }

      return out
   }

   private static _evalRenderRuleFn(
      //
      field: Maybe<Field>,
      uiFn: RenderRuleFn<any>,
      prefixForNestedSelector: string,
   ): RenderRule<Field>[] {
      if (field == null) throw new Error('form not loaded yet')

      const extraRules: RenderRule<any>[] = []
      const OUT: RenderProps = {}

      function set<F extends Z.Field>(...props: RenderRule_asList<F>): void
      function set<F extends Z.Field>(prop: RenderProps<any>): void
      function set(...props: any[]) {
         // self rule
         if (props.length === 1) {
            Object.assign(OUT, props[0])
            // 🍿 extraRules.push({ at: field, props: props[0], addedBy: field, priority: 99 })
            extraRules.push({
               at: `#${field?.zUid}`,
               // at: field,
               props: props[0],
               // addedBy: field,
               priority: 99,
            })
         }
         // child rule
         else {
            const extraRule = convertShortRule(props as RenderRule_asList<Field>)
            const childSelector = normalizePattern(extraRule.at, prefixForNestedSelector)
            extraRules.push({ ...extraRule, at: childSelector })
         }
      }

      uiFn(field, set)
      return extraRules
   }

   private static removeUndefs<T extends object>(obj: T): T {
      for (const key in obj) {
         if (obj[key] === undefined) {
            delete obj[key]
         }
      }
      return obj
   }

   /**
    * MAIN METHOD TO RENDER A FIELD
    * this method is both for humans (calling render on field root)
    * and for fields rendering their childern
    */
   render<FIELD extends Field>(
      //
      field: FIELD,
      renderProps: RenderProps<FIELD>,
      ctx: RenderCtx<FIELD>,
   ): ReactNode {
      const { nextCtx, Shell, finalProps } = this.render_<FIELD>(field, renderProps, ctx)
      return <rendererCtx.Provider value={nextCtx}>{renderFCOrNode(Shell, finalProps)}</rendererCtx.Provider>
   }

   /**
    * helper to define rules as variables without importing types
    * nor manually annotating them
    */
   static rule<RULE extends FlattenableRule<Field>>(initialRules: RULE): RULE {
      return initialRules
   }

   /**
    * Helper to test the renderer engine
    * not using react, but traversing all fields depth first
    * and building a list of all props for every field
    */
   renderTest<FIELD extends Field>(
      /** field entrypoing */
      field: Field,
      initialRules?: FlattenableRule<FIELD>,
   ): { at: FL_FieldPathNice; props: RenderProps<Field> }[] {
      const rules: RenderRuleFlat<Field>[] =
         initialRules != null ? Renderer.normalizeRule(field, initialRules) : []

      const rootCtx: RenderCtx = {
         parent: null,
         ancestors: [],
         renderer: this,
         rules,
      }
      const out: { at: FL_FieldPathNice; props: any }[] = []
      const ctxIn = new WeakMap<Field, RenderCtx>()

      field.zTraverseDepthFirst((f) => {
         const ctx = f.zParent ? bang(ctxIn.get(f.zParent)) : rootCtx
         const { nextCtx, Shell, finalProps } = this.render_<Field>(f, {}, ctx)
         ctxIn.set(f, nextCtx)

         const {
            //useless
            field,
            presenter,
            // those are still here only to avoid creating new JS object
            // but sub-rules have been flatten already
            rules,
            // what we care about
            ...testProps
         } = finalProps

         if (Object.keys(testProps).length === 0) return
         out.push({ at: f.zPathNice, props: testProps })
      })
      return out
   }

   static getVisualAncestors(ctx: RenderCtx<any>): Field[] {
      const out = ctx.ancestors.slice(1).map((c) => bang(c.parent))
      if (ctx.parent != null) out.push(ctx.parent)
      return out
   }
   render_<FIELD extends Field>(
      //
      field: FIELD,
      renderProps: RenderProps<FIELD>,
      ctx: RenderCtx<FIELD>,
   ): {
      nextCtx: RenderCtx
      Shell: FCOrNode<RenderPropsCompiled<FIELD>>
      finalProps: RenderPropsCompiled<FIELD>
   } {
      const debug = false // field.path === '...'
      // ------------------------------------------------------------------------
      // massive optimization here; just support arbitrary nested arrays
      // and ache the object so we never spread stuff
      const rules: RenderRuleFlat<Field>[] = [
         ...ctx.rules,
         ...Renderer.normalizeRule(field, field.zConfig.uiui),
         ...Renderer.normalizeRule(field, renderProps),
      ]

      // ------------------------------------------------------------------------
      // override parents if need be
      const ancestors = Renderer.getVisualAncestors(ctx)
      const virtualParents: Map<Field, Field> = new Map<Field, Field>()
      for (let i = 0; i < ancestors.length - 1; i++) {
         const parent_ = ancestors[i]!
         const child_ = ancestors[i + 1]!
         if (child_.zParent !== parent_) virtualParents.set(child_, parent_)
      }
      if (ctx.parent && ctx.parent !== field.zParent) virtualParents.set(field, ctx.parent)
      // const directParent_ = ancestors[ancestors.length - 1]?.parent
      // if (directParent_ && field.zParent !== directParent_) virtualParents.set(field, directParent_)
      // if (virtualParents.size > 0)
      //    console.log(`[      🟢 >] rendering ${field.path} at ${getVisualPath(ctx)}`, virtualParents)

      // ------------------------------------------------------------------------
      let slots: RenderProps<FIELD> = {}
      // eval rule from config
      // if (field.config.uiui != null) xxx.evalRule(field.config.uiui, RENDER_PRIORITY_UIUI)
      for (const rule of rules) {
         const isMatching = FieldSelector.match(rule.at, field, virtualParents)
         // if (field.zPath === '$.c.kkk.t1' && normalizePattern(rule.at) === 'c.') {
         //    this.debugVirtualParents(virtualParents)
         //    console.log(`[🤠] 🔴1`, FieldSelector.match(rule.at, field))
         //    console.log(`[🤠] 🔴2`, FieldSelector.match(rule.at, field, virtualParents))
         //    console.log(`[🤠] 🔴3 ${Object.keys(virtualParents).length}`)
         //    // `[🤠] rule: "${field.zPath}" matches "${normalizePattern(rule.at)}" ${isMatching ? '🟢' : '🔴'}`,
         // }
         if (isMatching) {
            const newSlots = rule.propsFlat as RenderProps<FIELD>
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
      const nextCtx: RenderCtx = {
         parent: field,
         ancestors: [...ctx.ancestors, ctx],
         renderer: this,
         rules,
      }
      const out = { nextCtx, Shell, finalProps }
      return out
   }

   debugVirtualParents(virtualParents: Map<Field, Field>): void {
      console.log(`[🦊] virtual parents = { `)
      for (const [child, parent] of virtualParents.entries()) {
         console.log(`[🦊]    ${child.zPath}.parent --is-> ${parent.zPath}`)
      }
      console.log(`[🦊] } `)
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
const window_ = globalThis as any as typeof window
window_.RENDERER = {
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
