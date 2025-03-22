import type { Field } from '../../csuite/model/Field'
import type React from 'react'
import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { presentedCtx, presenterCtx, usePresentedOrNull, usePresenterOrNull } from './RenderCtx'
import { renderDefaultKey } from './RenderDefaultsKey'
import { Presenter } from './Renderer'

export const RenderUI = observer(function RenderUI_({
   field,
   rule,
   ...p
}: { field: Field } & RENDERER.FieldRenderArgs<any>): ReactNode {
   let presenter = usePresenterOrNull()
   let ancestors = usePresentedOrNull()

   // case 1. top level
   if (presenter == null) {
      // do not remove this line; it allow to invalidate default rules during dev
      // only registered for the root field
      const mobxHack = renderDefaultKey.version

      // if presenter is full, we create it and inject it in future context
      const presenter = new Presenter(field)
      // prettier-ignore
      return (
         <presenterCtx.Provider value={presenter}>
            <presentedCtx.Provider value={[field, ancestors]}>
               {presenter.render(field, rule, p)}
            </presentedCtx.Provider>
         </presenterCtx.Provider>
      )
   }

   // case 2. sub field
   return (
      <presentedCtx.Provider value={[field, ancestors]}>
         {presenter.render(field, rule, p)}
      </presentedCtx.Provider>
   )
})
