import type { RenderPropsCompiled } from '../presenters/RenderPropsCompiled'

import { observer } from 'mobx-react-lite'

import { renderFCOrNodeWithWrapper } from '../../csuite/utils/renderFCOrNode'

export const ShellInputOnly = observer(function ShellInputOnly(p: RenderPropsCompiled) {
   const field = p.field
   return (
      <div tw='row' className={p.className ?? undefined}>
         {renderFCOrNodeWithWrapper(p.Header, p, p.ContainerForHeader, {
            className: p.classNameAroundBodyAndHeader ?? undefined,
            field,
         })}
      </div>
   )
})
