import type { RenderPropsCompiled } from '../presenters/RenderPropsCompiled'

import { Frame } from '../../csuite/frame/Frame'
import { renderFCOrNode, renderFCOrNodeWithWrapper } from '../../csuite/utils/renderFCOrNode'

// SHELL SIMPLE
export const ShellInlineUI = obs(function ShellInline(p: RenderPropsCompiled) {
   const field = p.field
   return (
      <Frame row>
         {renderFCOrNode(p.OnTop, { field })}
         {renderFCOrNodeWithWrapper(p.Header, p, p.ContainerForHeader, {
            className: p.classNameAroundBodyAndHeader ?? undefined,
            field,
         })}
         {renderFCOrNodeWithWrapper(p.Body, p, p.ContainerForBody, {
            className: p.classNameAroundBodyAndHeader ?? undefined,
         })}
         {renderFCOrNode(p.OnBottom, { field })}
      </Frame>
   )
})
