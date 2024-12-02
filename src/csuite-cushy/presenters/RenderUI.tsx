import type { Field } from '../../csuite/model/Field'
import type { ReactNode } from 'react'

import { presenterCtx, usePresenterOrNull } from './RenderCtx'
import { Presenter } from './Renderer'

export const RenderUI = ({ field, ...p }: { field: Field } & RENDERER.FieldRenderArgs<any>): ReactNode => {
   const presenter = usePresenterOrNull() ?? new Presenter(field)

   return (
      <presenterCtx.Provider value={presenter}>
         {/*  */}
         {presenter.render(field, p)}
      </presenterCtx.Provider>
   )
}
