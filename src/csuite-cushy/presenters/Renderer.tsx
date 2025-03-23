import type { RenderCtx } from './RenderCtx'
import type { RenderProps } from './RenderProps'
import type { RenderPropsCompiled } from './RenderPropsCompiled'
import type { RenderRule } from './RenderRule'
import type { ReactNode } from 'react'

import { Field } from '../../csuite/model/Field'
import { extractComponentName } from '../../csuite/utils/extractComponentName'
import { mergeDefined } from '../../csuite/utils/mergeDefined'
import { _isFC, renderFCOrNode, renderFCOrNodeWithWrapper } from '../../csuite/utils/renderFCOrNode'
import { defaultRulesV2 } from './RenderDefaultsKey'
import { RenderUI } from './RenderUI'

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

   /**
    * MAIN METHOD TO RENDER A FIELD
    * this method is both for humans (calling render on field root)
    * and for fields rendering their childern
    */
   render<FIELD extends Field>(ctx: RenderCtx<FIELD>): ReactNode {
      const { field, ancestors, uiconf } = ctx
      // console.log(`[🦊🟢 1] rendering ${field.path} at ${getVisualPath(ctx)}`, uiconf.shouldShowHiddenFields)

      const debug = false // field.path === '$.linkedFromChannel.val'
      const rules: RenderRule<Field>[] = [
         //
         ...defaultRulesV2,
         ...ancestors.flatMap((prevCtx) => prevCtx.field.config.uiui?.rules ?? []),
         ...ancestors.flatMap((prevCtx) => prevCtx.uiconf.rules ?? []),
         ...(field.config.uiui?.rules ?? []),
         ...(uiconf.rules ?? []),
         { uiconf: field.config.uiui ?? {}, selector: true },
         { uiconf, selector: true },
      ]

      // override parents if need be
      const virtualParents: Map<Field, Field> = new Map<Field, Field>()
      for (let i = 0; i < ancestors.length - 1; i++) {
         const parent_ = ancestors[i]!.field
         const child_ = ancestors[i + 1]!.field
         if (child_.parent !== parent_) virtualParents.set(child_, parent_)
      }
      const directParent_ = ancestors[ancestors.length - 1]?.field
      if (directParent_ && field.parent !== directParent_) virtualParents.set(field, directParent_)
      let slots: RenderProps<FIELD> = {}
      // eval rule from config
      // if (field.config.uiui != null) xxx.evalRule(field.config.uiui, RENDER_PRIORITY_UIUI)
      for (const rule of rules) {
         // only attempt to apply rules defined by parents
         // ⏸️ if (rule.addedBy !== null && !field.path.startsWith(rule.addedBy.path)) continue

         // starts from this, and ensures the result contains the field.
         // we probably want contains in many place.
         const selector = rule.selector

         // prettier-ignore
         const isMatching =
            isBool(selector) ? selector
            : selector instanceof Field ? selector === field
            : field.matches(selector, virtualParents)

         // if (debug) {
         //    console.log(
         //       `[🦊] ${field.pathExt}`,
         //       isMatching ? '🟢' : '🔴',
         //       isBool(rule.selector) ? rule.selector : rule.selector.selector,
         //       typeof rule.uiconf !== 'function' ? this.explainSlots(rule.uiconf) : '<function...>',
         //    )
         // }
         if (isMatching) {
            const newSlots = rule.uiconf as RenderProps<FIELD>
            // const newSlots =
            //    typeof rule.uiconf === 'function' //
            //       ? (rule.uiconf({ field }) as RenderProps<FIELD>)
            //       : (rule.uiconf as RenderProps<FIELD>)
            if (newSlots != null && Object.keys(newSlots).length > 0) {
               slots = mergeDefined(slots, newSlots)
            }
         }
      }
      // console.log(`[🦊🟢 2] rendering ${field.path} at ${getVisualPath(ctx)}`, slots.shouldShowHiddenFields)

      // ⏸️ override `Body` if `chidlren` is specified
      // ⏸️ const layout = slots.layout
      // ⏸️ if (layout != null) {
      // ⏸️    slots.Body = createElement(QuickForm, { field, items: layout(field) })
      // ⏸️ }

      // console.log(`[🔴🦊SHELL]`, slots.Shell)
      const Shell =
         typeof slots.Shell === 'string' //
            ? UY.Shell[slots.Shell]
            : (slots.Shell ?? UY.Shell.Default)

      // console.log(`[🤠] slots.ShellName`, slots.ShellName, field.path, Shell === catalog.Shell.Inline)
      if (!Shell) throw new Error('Shell is not defined')

      // COMPILED
      const finalProps: RenderPropsCompiled<FIELD> = { field, presenter: this, ...slots }

      if (debug) this.debugFinalProps(finalProps)
      // if (field.path === '$.latent.b.image.resize') this.debugFinalProps(finalProps)
      // console.log(`[🤠] Shell for ${field.path} is `, Shell)
      // console.log(`[🦊] slots for`, field.path, slots)
      return renderFCOrNode(Shell, finalProps)
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
