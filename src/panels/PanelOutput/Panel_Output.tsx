import { observer } from 'mobx-react-lite'

import { Status } from '../../back/Status'
import { Button } from '../../csuite/button/Button'
import { SpacerUI } from '../../csuite/components/SpacerUI'
import { _formatPreviewDate } from '../../csuite/formatters/_formatPreviewDate'
import { Frame } from '../../csuite/frame/Frame'
import { PanelHeaderUI } from '../../csuite/wrappers/PanelHeader'
import { OutputUI } from '../../outputs/OutputUI'
import { Panel, type PanelHeader } from '../../router/Panel'
import { useSt } from '../../state/stateContext'
import { PanelStepsConf } from '../PanelSteps/Panel_StepsConf'
import { StepCardUI } from '../PanelSteps/StepCardUI'
import { LatentIfLastUI } from './LatentIfLastUI'
import { PanelOutputConf } from './PanelOutput_conf'

export const PanelStep = new Panel({
    name: 'Output',
    widget: (): React.FC<PanelStepUI> => PanelStepUI,
    header: (p): PanelHeader => ({ title: 'Output' }),
    def: (): PanelStepUI => ({}),
    category: 'outputs',
    icon: 'mdiFolderPlay',
})

export type PanelStepUI = {
    stepID?: Maybe<StepID>
}

export const PanelStepUI = observer(function PanelStepUI_(p: PanelStepUI) {
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
                // 'overflow-clip', // Make sure scrollbar doesn't encompass entire panel, only where it makes sense.
            ]}
        >
            <PanelHeaderUI // STEP HEADER ======================================================================
                icon={'mdiExitRun'}
            >
                {PanelOutputConf.renderAsConfigBtn({ title: 'Output' })}
                <div>
                    {step.name} {p.stepID == null ? '(latest)' : null}
                </div>
                <SpacerUI />
                <div tw='opacity-50'>{_formatPreviewDate(new Date(step.createdAt))}</div>
            </PanelHeaderUI>

            <div // STEP OUTPUTS ======================================================================
                tw={'flex overflow-auto flex-shrink-0 items-center max-h-[50%] p-0.5'}
            >
                {PanelStepsConf.renderAsConfigBtn()}
                {step?.finalStatus === Status.Running && (
                    <Button look='error' onClick={() => st.stopCurrentPrompt()}>
                        STOP
                    </Button>
                )}
                {step && (
                    <StepCardUI //
                        showTitle={false}
                        showDate={false}
                        step={step}
                    />
                )}
            </div>

            {/* alt 1. hovered or focused output */}
            <div tw={['flex flex-grow overflow-auto']}>
                {/*  */}
                {out1 && <OutputUI output={out1} />}
            </div>

            {/* alt 2. last output created */}
            {/* <div tw={['absolute bottom-0 z-30']}>{out2 && <OutputUI output={out2} />}</div> */}
            <LatentIfLastUI />
        </div>
    )
})
