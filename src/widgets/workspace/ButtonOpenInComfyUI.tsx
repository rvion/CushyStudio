import type { ComfyWorkflowL } from '../../models/ComfyWorkflow'

import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'

export const ButtonOpenInComfyUI = observer(function ButtonOpenInComfyUI_(p: {
   graph: ComfyWorkflowL | ComfyWorkflowID
}) {
   const graphOrGraphID = p.graph
   const graph =
      typeof graphOrGraphID === 'string' //
         ? cushy.db.comfy_workflow.getOrThrow(graphOrGraphID)
         : graphOrGraphID

   return (
      <div tw='flex items-center gap-2'>
         Open:
         <Button icon='mdiOpenInNew' look='ghost' size='sm' onClick={graph.menuAction_openInTab}>
            open in ComfyUI Tab
         </Button>
         <Button icon='mdiFullscreen' look='ghost' size='sm' onClick={graph.menuAction_openInFullScreen}>
            open in ComfyUI FULL
         </Button>
      </div>
   )
})
