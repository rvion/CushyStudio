import type { RenderPropsCompiled } from '../presenters/RenderPropsCompiled'

import { renderFCOrNode, renderFCOrNodeWithWrapper } from '../../csuite/utils/renderFCOrNode'

// HEADER ONLY

export const ShellHeaderOnlyUI = obs(function ShellHeaderOnlyUI(p: RenderPropsCompiled) {
   const field = p.field
   return <>FUCK{renderFCOrNode(p.Header, p)}</>
   return renderFCOrNodeWithWrapper(p.Header, p, p.ContainerForHeader, {
      className: p.classNameAroundBodyAndHeader ?? undefined,
      field,
   })
})
