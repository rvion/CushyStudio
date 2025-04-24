import type { ComfyWorkflowL } from '../../models/ComfyWorkflow'

import { Button } from '../../csuite/button/Button'

export const ButtonOpenInComfyUI = obs(function ButtonOpenInComfyUI_(p: {
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
         <Button icon={IKONS.mdiOpenInNew} look='ghost' size='sm' onClick={graph.menuAction_openInTab}>
            open in ComfyUI Tab
         </Button>
         <Button
            icon={IKONS.mdiFullscreen}
            look='ghost'
            size='sm'
            onClick={graph.menuAction_openInFullScreen}
         >
            open in ComfyUI FULL
         </Button>
      </div>
   )
})
