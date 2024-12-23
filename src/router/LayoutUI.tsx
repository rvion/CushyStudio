import type { CushyLayoutManager } from './Layout'

import * as FL from 'flexlayout-react'
import { Layout } from 'flexlayout-react'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'

import { TabsetPlaceholderUI } from './TabsetPlaceholderUI'

export const LayoutUI = observer(function LayoutUI_(p: { layout: CushyLayoutManager }) {
   const layout = p.layout
   console.log('[💠] Rendering Layout')
   return (
      <Layout //
         // 🔴 never re-use panels is probably the wrong fix;
         // we could/should/will make something better/faster/stronger.
         key={layout.perspective.id}
         ref={layout.layoutRef}
         model={layout.model}
         factory={layout.factory}
         onTabSetPlaceHolder={TabsetPlaceholderUI}
         /* This is more responsive and better for stuff like the gallery, where you may want to match the size of the panel to the size of the images.
          * Click => Dragging => Unclick is very annoying when you want something a specific way and need to see the changes quickly. */
         realtimeResize
         onAuxMouseClick={(node, event) => {
            // Middle Mouse to close tab
            if (event.button == 1 && node instanceof FL.TabNode) {
               if (node.isEnableClose()) {
                  layout.closeTab(node.getId())
               }
            }
         }}
         onModelChange={(model) => {
            runInAction(() => {
               const tabset = layout.getActiveOrFirstTabset_orThrow()
               layout.currentTabSet = tabset
               layout.currentTab = tabset?.getSelectedNode()
               layout.currentTabID = layout.currentTab?.getId()
            })
            layout.recordVisit(layout.currentTabSet?.getId() ?? '--', layout.currentTabID ?? '--')
            layout.perspective.update({
               layout: model.toJson(),
            })
            // layout.saveCurrentPerspectiveAsDefault()
         }}
      />
   )
})
