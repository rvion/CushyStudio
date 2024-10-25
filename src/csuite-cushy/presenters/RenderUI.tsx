import type { Field } from '../../csuite/model/Field'
import type { ReactNode } from 'react'

import { PresenterCtx, usePresenterOrNull } from './RenderCtx'
import { Presenter } from './Renderer'

export const RenderUI = ({ field, p }: { field: Field; p: RENDERER.FieldRenderArgs<any> }): ReactNode => {
   const presenter = usePresenterOrNull() ?? new Presenter()

   return (
      <PresenterCtx.Provider value={presenter}>
         {/*  */}
         {presenter.render(field, p)}
      </PresenterCtx.Provider>
   )
}
