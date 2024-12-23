import type { CompiledRenderProps } from '../presenters/RenderTypes'

import { observer } from 'mobx-react-lite'

// SHELL SIMPLE
export const ShellSimpleUI = observer(function ShellSimple(p: CompiledRenderProps) {
   const field = p.field
   const utils = p.presenter.utils
   return (
      <div>
         <div tw='row'>
            {utils.renderFCOrNode(p.Title, { field })}
            {utils.renderFCOrNodeWithWrapper(p.Header, p, p.ContainerForHeader, {
               className: p.classNameAroundBodyAndHeader ?? undefined,
               field,
            })}
         </div>
         {utils.renderFCOrNodeWithWrapper(p.Body, p, p.ContainerForBody, {
            className: p.classNameAroundBodyAndHeader ?? undefined,
         })}
      </div>
   )
})
