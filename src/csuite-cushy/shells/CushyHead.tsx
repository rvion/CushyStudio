import type { CompiledRenderProps } from '../presenters/RenderTypes'
import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { WidgetHeaderContainerUI } from '../../csuite/form/WidgetHeaderContainerUI'

export type CushyHeadProps = CompiledRenderProps & {
   children?: ReactNode
   // asRevealAnchor?: // TODO
}

export const CushyHeadUI = observer(function CushyHead(p: CushyHeadProps) {
   const field = p.field
   const utils = p.presenter.utils
   const interfacePreferences = cushy.preferences.interface.value

   return (
      <WidgetHeaderContainerUI field={field} /* border={'red'} */>
         {/* HEADER LABEL */}
         {p.children}

         {/* HEADER CONTROLS */}
         {utils.renderFCOrNodeWithWrapper(p.Header, p, p.ContainerForHeader, {
            className: p.classNameAroundBodyAndHeader ?? undefined,
            field,
         })}

         {utils.renderFCOrNode(p.UpDownBtn, { field })}
         {utils.renderFCOrNode(p.DeleteBtn, { field })}

         {/* HEADER EXTRA prettier-ignore */}
         {utils.renderFCOrNode(p.Extra, p)}
         {interfacePreferences.widget.showUndo && utils.renderFCOrNode(p.UndoBtn, p)}
         {interfacePreferences.widget.showMenu && utils.renderFCOrNode(p.MenuBtn, p)}
      </WidgetHeaderContainerUI>
   )
})
