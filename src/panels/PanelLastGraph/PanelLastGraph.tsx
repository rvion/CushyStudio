import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { observer } from 'mobx-react-lite'

import { ErrorBoundaryUI } from '../../csuite/errors/ErrorBoundaryUI'
import { Panel, type PanelHeader } from '../../router/Panel'
import { GraphPreviewUI } from '../../widgets/graph/GraphPreviewUI'

export const PanelLastGraph = new Panel({
   name: 'LastGraph',
   widget: (): React.FC<NO_PROPS> => PanelLastGraphUI,
   header: (p): PanelHeader => ({ title: '⏱️ LastGraph' }),
   def: (): NO_PROPS => ({}),
   icon: 'cdiNodes',
   category: 'ComfyUI',
})

export const PanelLastGraphUI = observer(function PanelLastGraphUI_(p: NO_PROPS) {
   const lastGraph = cushy.db.comfy_workflow.last()
   return (
      <div>
         {lastGraph && (
            <ErrorBoundaryUI>
               <GraphPreviewUI graph={lastGraph} />
            </ErrorBoundaryUI>
         )}
      </div>
   )
})
