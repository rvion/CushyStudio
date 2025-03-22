import type { RenderPropsCompiled } from '../presenters/RenderPropsCompiled'

import { observer } from 'mobx-react-lite'

// BODY ONLY

export const ShellBodyOnlyUI = observer(function ShellBodyOnlyUI(p: RenderPropsCompiled) {
   const field = p.field
   const utils = p.presenter.utils
   return utils.renderFCOrNodeWithWrapper(p.Header, p, p.ContainerForHeader, {
      className: p.classNameAroundBodyAndHeader ?? undefined,
      field,
   })
})
