import type { Field } from '../../csuite/model/Field'
import type { RenderProps } from './RenderProps'
import type { ReactNode } from 'react'

import { type RenderCtx, useRendererCtx } from './RenderCtx'
import { defaultRulesV2, renderDefaultKey } from './RenderDefaultsKey'
import { Renderer } from './Renderer'

export const RenderUI = obs(function RenderUI_({
   field,
   ...renderProps
}: { field: Field } & RenderProps<any>): ReactNode {
   const prevCtx: RenderCtx | null = useRendererCtx()
   // case 1. top level
   if (prevCtx == null) {
      // do not remove this line; it allow to invalidate default rules during dev
      // only registered for the root field
      const mobxHack = renderDefaultKey.version

      // if presenter is full, we create it and inject it in future context
      const renderer = new Renderer(field)
      const rootCtx: RenderCtx = { field, ancestors: [], renderer, rules: defaultRulesV2 }
      return renderer.render(field, rootCtx, renderProps)
   }

   // case 2. sub field
   const renderer: Renderer = prevCtx.renderer
   return renderer.render(field, prevCtx, renderProps)
})
