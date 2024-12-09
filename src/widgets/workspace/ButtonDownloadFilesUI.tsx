import type { ComfyWorkflowL } from '../../models/ComfyWorkflow'

import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'

export const ButtonDownloadFilesUI = observer(function ButtonDownloadFilesUI_(p: {
   //
   graph: ComfyWorkflowL | ComfyWorkflowID
}) {
   const graphOrGraphID = p.graph
   const graph =
      typeof graphOrGraphID === 'string' //
         ? cushy.db.comfy_workflow.getOrThrow(graphOrGraphID)
         : graphOrGraphID

   return (
      <div tw='flex items-center gap-2'>
         <Button look='primary' icon='mdiCloudDownload' size='sm' onClick={graph.menuAction_downloadWorkflow}>
            Download ComfyUI Workflow
         </Button>
         <Button look='ghost' icon='mdiCloudDownload' size='sm' onClick={graph.menuAction_downloadPrompt}>
            Download ComfyUI PROMPT
         </Button>
      </div>
   )
})
