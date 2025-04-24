import type { RenderPropsCompiled } from '../presenters/RenderPropsCompiled'

import { renderFCOrNodeWithWrapper } from '../../csuite/utils/renderFCOrNode'

// BODY ONLY

export const ShellBodyOnlyUI = obs(function ShellBodyOnlyUI(p: RenderPropsCompiled) {
   const field = p.field
   return renderFCOrNodeWithWrapper(p.Header, p, p.ContainerForHeader, {
      className: p.classNameAroundBodyAndHeader ?? undefined,
      field,
   })
})
