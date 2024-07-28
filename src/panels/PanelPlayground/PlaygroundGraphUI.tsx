import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'

import { Button } from '../../csuite/button/Button'
import { SpacerUI } from '../../csuite/components/SpacerUI'
import { PanelHeaderUI } from '../../csuite/wrappers/PanelHeader'
import { DrawWorkflowUI } from '../../widgets/graph/DrawWorkflowUI'

export const PlaygroundGraphUI = observer(function PlaygroundGraphUI_(p: {}) {
    const workflow = cushy.db.comfy_workflow.last()!
    const form = cushy.graphConf
    const update = () => void workflow.RUNLAYOUT(cushy.autolayoutOpts)
    useEffect(update, [JSON.stringify(cushy.autolayoutOpts), workflow.id])

    return (
        <div tw='h-full'>
            <div tw='flex gap-1 items-center'>
                <Button onClick={update}>update</Button>
                {form.renderAsConfigBtn({ title: 'Graph Conf' })}
            </div>
            {form.render()}
            <DrawWorkflowUI spline={form.value.spline} workflow={workflow} />
        </div>
    )
})
