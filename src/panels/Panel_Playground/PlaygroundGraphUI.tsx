import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'

import { PanelHeaderUI } from '../PanelHeader'
import { CushyFormManager } from 'src/controls/FormBuilder'
import { FormUI } from 'src/controls/FormUI'
import { SpacerUI } from 'src/controls/widgets/spacer/SpacerUI'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { DrawWorkflowUI } from 'src/widgets/graph/DrawWorkflowUI'

export const PlaygroundGraphUI = observer(function PlaygroundGraphUI_(p: {}) {
    const workflow = cushy.db.comfy_workflow.last()!
    const form = CushyFormManager.useForm((ui) => ({
        spline: ui.float({ min: 0.5, max: 4, default: 2 }),
        vsep: ui.int({ min: 0, max: 100, default: 20 }),
        hsep: ui.int({ min: 0, max: 100, default: 20 }),
    }))
    const fv = form.value
    const update = () => workflow.RUNLAYOUT({ node_hsep: fv.hsep, node_vsep: fv.vsep })
    useEffect(update, [fv.hsep, fv.vsep, workflow.id])
    return (
        <div tw='h-full'>
            <PanelHeaderUI>
                <div tw='btn btn-sm' onClick={update}>
                    update
                </div>
                <SpacerUI />
                <RevealUI>
                    <div>config</div>
                    <div style={{ width: '500px' }}>
                        <FormUI form={form} />
                    </div>
                </RevealUI>
            </PanelHeaderUI>
            <DrawWorkflowUI spline={form.value.spline} workflow={workflow} />
        </div>
    )
})
