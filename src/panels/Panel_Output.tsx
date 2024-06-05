import { observer } from 'mobx-react-lite'

import { Status } from '../back/Status'
import { InputNumberUI } from '../controls/widgets/number/InputNumberUI'
import { Button } from '../csuite/button/Button'
import { RevealUI } from '../csuite/reveal/RevealUI'
import { OutputPreviewUI, OutputUI } from '../outputs/OutputUI'
import { StepOutputsHeaderV2UI } from '../outputs/StepOutputsV2UI'
import { useSt } from '../state/stateContext'
import { FieldAndLabelUI } from '../widgets/misc/FieldAndLabelUI'

export const LatentIfLastUI = observer(function LatentIfLastUI_(p: {}) {
    const st = useSt()
    const lastImage = st.db.media_image.last()
    const latent = st.latentPreview
    if (latent == null) return null
    if (lastImage == null || latent.receivedAt > lastImage.createdAt) {
        return (
            <img //
                tw='absolute bottom-0 right-0 shadow-xl z-50'
                style={{
                    //
                    filter: st.project.filterNSFW ? 'blur(50px)' : undefined,
                    width: st.latentSizeStr,
                    height: st.latentSizeStr,
                    objectFit: 'contain',
                }}
                src={latent.url}
                alt='last generated image'
            />
        )
    }
})

export const Panel_Output = observer(function Panel_Output_(p: {}) {
    const st = useSt()
    const selectedStep = st.focusedStepL
    if (selectedStep == null) return null
    // (debg) 🥼 const explain = st.hovered
    // (debg) 🥼     ? 'st.hovered'
    // (debg) 🥼     : st.focusedStepOutput
    // (debg) 🥼     ? 'st.focusedStepOutput'
    // (debg) 🥼     : selectedStep.lastMediaOutput
    // (debg) 🥼     ? `selectedStep(${selectedStep.id}).lastMediaOutput`
    // (debg) 🥼     : st.db.media_image.last()
    // (debg) 🥼     ? 'st.db.media_image.last()'
    // (debg) 🥼     : '❌'
    const out1 = st.hovered ?? st.focusedStepOutput ?? selectedStep.lastMediaOutput ?? st.db.media_image.last()
    const out2 = selectedStep.comfy_workflows.findLast((i) => i.createdAt)
    // const currentlyExecutingGraph = selectedStep.outputWorkflow

    // const workflow = cushy.db.comfy_workflow.last()!
    // const out2
    // const out3 = selectedStep.currentlyExecutingOutput
    // if (1 - 1 === 0) return <RevealTestUI />
    return (
        <>
            <div
                tw={[
                    //
                    'flex flex-col',
                    'flex-grow h-full w-full',
                    'overflow-clip', // Make sure scrollbar doesn't encompass entire panel, only where it makes sense.
                ]}
            >
                {/* {explain} */}
                <SideOutputListUI />
                {/* <MainOutputHistoryUI /> */}
                {/* <div tw='flex-grow flex flex-row relative'> */}
                <div tw={[/* 'animate-in zoom-in-75', */ 'flex flex-grow overflow-auto']}>
                    {/*  */}
                    {out1 && <OutputUI output={out1} />}
                </div>
                <div tw={['absolute bottom-0 z-30']}>{out2 && <OutputUI output={out2} />}</div>
                {/* {out3 && (
                    <div tw={['flex flex-grow overflow-auto top-20 absolute z-20  bg-opacity-80']}>
                        <OutputUI output={out3} />
                    </div>
                )} */}
                <LatentIfLastUI />
                {/* </div> */}
            </div>
        </>
    )
})

export const SideOutputListUI = observer(function SideOutputListUI_(p: {}) {
    const st = useSt()
    const step = st.focusedStepL
    const size = st.historySizeStr
    return (
        <div tw={'flex flex-wrap gap-0.5 p-1 overflow-auto flex-shrink-0  items-center max-h-[50%]'}>
            <RevealUI
                tw='self-start'
                content={() => (
                    <div tw='flex flex-col gap-1 p-2 shadow-xl'>
                        <FieldAndLabelUI label='Output Preview Size (px)'>
                            <InputNumberUI
                                style={{ width: '5rem' }}
                                mode={'int'}
                                min={32}
                                max={200}
                                onValueChange={(next) => (st.historySize = next)}
                                value={st.historySize}
                            />
                        </FieldAndLabelUI>
                        <FieldAndLabelUI label='Latent Size (%)'>
                            <InputNumberUI
                                style={{ width: '5rem' }}
                                mode={'int'}
                                min={3}
                                max={100}
                                onValueChange={(next) => (st.latentSize = next)}
                                value={st.latentSize}
                            />
                        </FieldAndLabelUI>
                    </div>
                )}
            >
                <Button icon='mdiEyeSettings' style={{ width: size, height: size, lineHeight: size }}></Button>
            </RevealUI>
            {step?.finalStatus === Status.Running && (
                <div tw='btn btn-sm btn-outline' onClick={() => st.stopCurrentPrompt()}>
                    STOP
                </div>
            )}
            {step && <StepOutputsHeaderV2UI step={step} />}
            {step?.outputs?.map((output, ix) => <OutputPreviewUI key={ix} step={step} output={output} />)}
        </div>
    )
})
