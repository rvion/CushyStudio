import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'

import { PanelHeaderUI } from '../PanelHeader'
import { FormUI } from 'src/controls/FormUI'
import { SpacerUI } from 'src/controls/widgets/spacer/SpacerUI'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { DrawWorkflowUI } from 'src/widgets/graph/DrawWorkflowUI'

export const PlaygroundGraphUI = observer(function PlaygroundGraphUI_(p: {}) {
    const workflow = cushy.db.comfy_workflow.last()!
    // const form = CushyFormManager.useForm((ui) => ({
    //     spline: ui.float({ min: 0.5, max: 4, default: 2 }),
    //     vsep: ui.int({ min: 0, max: 100, default: 20 }),
    //     hsep: ui.int({ min: 0, max: 100, default: 20 }),
    // }))
    const form = cushy.graphConf
    // const fv = form.value
    const update = () => workflow.RUNLAYOUT(cushy.autolayoutOpts)
    useEffect(update, [JSON.stringify(cushy.autolayoutOpts), workflow.id])

    return (
        <div tw='h-full'>
            <PanelHeaderUI>
                <div tw='btn btn-sm' onClick={update}>
                    update
                </div>
                <SpacerUI />
                <RevealUI
                    content={() => (
                        <div style={{ width: '500px' }}>
                            <FormUI form={form} />
                        </div>
                    )}
                >
                    <div>config</div>
                </RevealUI>
            </PanelHeaderUI>
            <DrawWorkflowUI spline={form.value.spline} workflow={workflow} />
        </div>
    )
})
