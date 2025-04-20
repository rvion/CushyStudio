import type { Field } from '../../csuite/model/Field'
import type { RenderRuleFlat } from './RenderRule'

import { createContext, useContext } from 'react'

import { Renderer } from './Renderer'

export type RenderCtx<FIELD extends Field = Field> = {
   /** field we're currently rendering */
   parent: FIELD | null

   /** renderProps specified for curent field */
   // renderProps: RenderProps<FIELD>

   /** instance of the renderer in ctx */
   renderer: Renderer

   /** in `root` to `leaf` order, stopping at field's visual parent */
   ancestors: RenderCtx[]

   /** all rules injected by ancestors, */
   rules: RenderRuleFlat<Field>[]
}

// context for the presenter (render orchestrator, stateful per top-level <field.UI />)
export const rendererCtx = createContext<RenderCtx | null>(null)

export const useRendererCtx = (): RenderCtx | null => {
   return useContext(rendererCtx)
}

// export const getVisualPath = (field: Field): string => {
//    const base = getVisualPath()
//    return `${base}->${field.path}`
// }

export const getVisualPath = (ctx: RenderCtx<Field> | null = useRendererCtx()): string => {
   if (ctx == null) return 'not in a rendering context'
   return Renderer.getVisualAncestors(ctx)
      .map((i) => i.zMountKey)
      .join('->')
   // return [
   //    //
   //    ...ctx.ancestors.map((i) => i.parent?.zMountKey),
   //    ctx.parent?.zMountKey,
   // ]
   //    .filter(Boolean)
   //    .join('->')
}
