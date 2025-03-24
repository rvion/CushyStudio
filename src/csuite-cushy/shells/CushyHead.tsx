import type { RenderPropsCompiled } from '../presenters/RenderPropsCompiled'
import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { WidgetHeaderContainerUI } from '../../csuite/form/WidgetHeaderContainerUI'
import { renderFCOrNode, renderFCOrNodeWithWrapper } from '../../csuite/utils/renderFCOrNode'

export type CushyHeadProps = RenderPropsCompiled & {
   children?: ReactNode
   // asRevealAnchor?: // TODO
}

export const CushyHeadUI = observer(function CushyHead(p: CushyHeadProps) {
   const field = p.field
   const interfacePreferences = cushy.preferences.interface.value

   return (
      <WidgetHeaderContainerUI field={field} /* border={'red'} */>
         {/* HEADER LABEL */}
         {p.children}

         {/* HEADER CONTROLS */}
         {renderFCOrNode(
            p.ContainerForHeader,
            {
               className: p.classNameAroundBodyAndHeader ?? undefined,
               field,
            },
            renderFCOrNode(p.OnLeft, p),
            renderFCOrNode(p.Header, p),
            renderFCOrNode(p.OnRight, p),
         )}
         {renderFCOrNode(p.UpDownBtn, p)}
         {renderFCOrNode(p.DeleteBtn, p)}

         {/* HEADER EXTRA prettier-ignore */}
         {renderFCOrNode(p.Extra, p)}
         {interfacePreferences.widget.showUndo && renderFCOrNode(p.UndoBtn, p)}
         {interfacePreferences.widget.showMenu && renderFCOrNode(p.MenuBtn, p)}
      </WidgetHeaderContainerUI>
   )
})
