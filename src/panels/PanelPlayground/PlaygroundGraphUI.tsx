import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'

import { Button } from '../../csuite/button/Button'
import { DrawWorkflowUI } from '../../widgets/graph/DrawWorkflowUI'

export const PlaygroundGraphUI = observer(function PlaygroundGraphUI_(p: {}) {
   const workflow = cushy.db.comfy_workflow.last()!
   const form = cushy.graphConf
   const update = (): void => void workflow.RUNLAYOUT(cushy.autolayoutOpts)
   useEffect(update, [JSON.stringify(cushy.autolayoutOpts), workflow.id])

   return (
      <div tw='h-full'>
         <div tw='flex items-center gap-1'>
            <Button onClick={update}>update</Button>
            {form.renderAsConfigBtn({ title: 'Graph Conf' })}
         </div>
         {form.UI()}
         <DrawWorkflowUI //
            spline={form.value.spline}
            workflow={workflow}
         />
      </div>
   )
})
