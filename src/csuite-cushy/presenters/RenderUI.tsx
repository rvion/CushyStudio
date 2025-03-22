import type { Field } from '../../csuite/model/Field'
import type { RenderProps } from './RenderProps'
import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { type RenderCtx, rendererCtx, useRendererCtx } from './RenderCtx'
import { renderDefaultKey } from './RenderDefaultsKey'
import { Renderer } from './Renderer'

export const RenderUI = observer(function RenderUI_({
   field,
   ...uiconf
}: { field: Field } & RenderProps<any>): ReactNode {
   let prevCtx: RenderCtx | null = useRendererCtx()
   // console.log(`[🤠🟢22] `, uiconf)
   // case 1. top level
   if (prevCtx == null) {
      // do not remove this line; it allow to invalidate default rules during dev
      // only registered for the root field
      const mobxHack = renderDefaultKey.version

      // if presenter is full, we create it and inject it in future context
      const renderer = new Renderer(field)
      const ctx: RenderCtx = { field, uiconf, ancestors: [], renderer }
      return <rendererCtx.Provider value={ctx}>{renderer.render(ctx)}</rendererCtx.Provider>
   }

   // case 2. sub field
   const renderer: Renderer = prevCtx.renderer
   const ancestors: RenderCtx[] = [...prevCtx.ancestors, prevCtx]
   const ctx: RenderCtx = { field, uiconf, ancestors, renderer }
   return <rendererCtx.Provider value={ctx}>{renderer.render(ctx)}</rendererCtx.Provider>
})
