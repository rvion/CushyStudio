import type { RenderPropsCompiled } from '../presenters/RenderPropsCompiled'

import { renderFCOrNode } from '../../csuite/utils/renderFCOrNode'

export const ShellInputOnly = obs(function ShellInputOnly(p: RenderPropsCompiled) {
   const field = p.field
   return (
      <div tw='row' className={p.className ?? undefined}>
         {renderFCOrNode(
            p.Header,
            p,
            renderFCOrNode(p.ContainerForHeader, {
               className: p.classNameAroundBodyAndHeader ?? undefined,
               field,
            }),
         )}
      </div>
   )
})
