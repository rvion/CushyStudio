import { observer } from 'mobx-react-lite'

import { Status } from '../../back/Status'
import { Button } from '../../csuite/button/Button'
import { SpacerUI } from '../../csuite/components/SpacerUI'
import { _formatPreviewDate } from '../../csuite/formatters/_formatPreviewDate'
import { PanelHeaderUI } from '../../csuite/wrappers/PanelHeader'
import { OutputUI } from '../../outputs/OutputUI'
import { useSt } from '../../state/stateContext'
import { PanelStepsConf } from '../Panel_Steps/Panel_StepsConf'
import { StepCardUI } from '../Panel_Steps/StepCardUI'
import { LatentIfLastUI } from './LatentIfLastUI'
import { PanelOutputConf } from './PanelOutput_conf'

export const Panel_Step = observer(function Panel_Step_(p: {
    //
    stepID?: Maybe<StepID>
}) {
    const st = useSt()
    const step =
        p.stepID == null //
            ? cushy.db.step.last()
            : cushy.db.step.get(p.stepID)
    if (step == null) return null
    const out1 = st.hovered ?? st.focusedStepOutput ?? step.lastMediaOutput ?? st.db.media_image.last()
    // const out2 = step.comfy_workflows.findLast((i) => i.createdAt)

    return (
        <div
            tw={[
                //
                'flex flex-col',
                'flex-grow h-full w-full',
                'overflow-clip', // Make sure scrollbar doesn't encompass entire panel, only where it makes sense.
            ]}
        >
            <PanelHeaderUI // STEP HEADER ======================================================================
                title={'Step: ' + p.stepID == null ? 'latest' : `${step.name} ${step.id.slice(0, 5)}`}
                icon={'mdiExitRun'}
            >
                <SpacerUI />
                <div tw='opacity-50'>{_formatPreviewDate(new Date(step.createdAt))}</div>

                {PanelOutputConf.renderAsConfigBtn({ title: 'Output' })}
            </PanelHeaderUI>

            <div // STEP OUTPUTS ======================================================================
                tw={'flex overflow-auto flex-shrink-0 items-center max-h-[50%] p-0.5'}
            >
                {step?.finalStatus === Status.Running && (
                    <Button look='error' onClick={() => st.stopCurrentPrompt()}>
                        STOP
                    </Button>
                )}
                {step && <StepCardUI step={step} />}
                <SpacerUI />
                {PanelStepsConf.renderAsConfigBtn()}
            </div>

            {/* alt 1. hovered or focused output */}
            <div tw={['flex flex-grow overflow-auto']}>{out1 && <OutputUI output={out1} />}</div>

            {/* alt 2. last output created */}
            {/* <div tw={['absolute bottom-0 z-30']}>{out2 && <OutputUI output={out2} />}</div> */}
            <LatentIfLastUI />
        </div>
    )
})
