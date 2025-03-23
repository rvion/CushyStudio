import type { RenderPropsCompiled } from '../presenters/RenderPropsCompiled'

import { observer } from 'mobx-react-lite'

import { renderFCOrNode, renderFCOrNodeWithWrapper } from '../../csuite/utils/renderFCOrNode'

// SHELL SIMPLE
export const ShellSimpleUI = observer(function ShellSimple(p: RenderPropsCompiled) {
   const field = p.field
   return (
      <div>
         <div tw='row'>
            {renderFCOrNode(p.Title, { field })}
            {renderFCOrNodeWithWrapper(p.Header, p, p.ContainerForHeader, {
               className: p.classNameAroundBodyAndHeader ?? undefined,
               field,
            })}
         </div>
         {renderFCOrNodeWithWrapper(p.Body, p, p.ContainerForBody, {
            className: p.classNameAroundBodyAndHeader ?? undefined,
         })}
      </div>
   )
})
