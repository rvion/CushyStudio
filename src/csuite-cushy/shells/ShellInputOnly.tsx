import type { RenderPropsCompiled } from '../presenters/RenderPropsCompiled'

import { observer } from 'mobx-react-lite'

export const ShellInputOnly = observer(function ShellInputOnly(p: RenderPropsCompiled) {
   const field = p.field
   const utils = p.presenter.utils
   return (
      <div tw='row' className={p.className ?? undefined}>
         {/* {utils.renderFCOrNode(p.Header, p)} */}
         {utils.renderFCOrNodeWithWrapper(p.Header, p, p.ContainerForHeader, {
            className: p.classNameAroundBodyAndHeader ?? undefined,
            field,
         })}
      </div>
   )
})
