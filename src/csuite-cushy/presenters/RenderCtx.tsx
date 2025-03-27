import type { Field } from '../../csuite/model/Field'
import type { Renderer } from './Renderer'
import type { RenderProps } from './RenderProps'

import { createContext, useContext } from 'react'

export type RenderCtx<FIELD extends Field = Field> = {
   /** field we're currently rendering */
   field: FIELD

   /** display conf for curent field */
   uiconf: RenderProps<FIELD>

   /** instance of the renderer in ctx */
   renderer: Renderer

   /** in `root` to `leaf` order, stopping at field's visual parent */
   ancestors: RenderCtx[]
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
   return [
      //
      ...ctx.ancestors.map((i) => i.field.ϟmountKey),
      ctx.field.ϟmountKey,
   ].join('->')
}
