import { observer } from 'mobx-react-lite'
import { Slider } from 'src/rsuite/shims'
import { useSt } from '../state/stateContext'
import { StepOutputsV2UI } from 'src/outputs/StepOutputsV2UI'
import { GalleryControlsUI } from './Panel_Gallery'
import { FieldAndLabelUI } from 'src/widgets/misc/FieldAndLabelUI'
import { OutputPreviewUI } from 'src/outputs/OutputUI'
import { Panel_ViewImage } from './Panel_ViewImage'
import { AppIllustrationUI } from 'src/cards/fancycard/AppIllustrationUI'
import { _formatAsRelativeDateTime } from 'src/updater/_getRelativeTimeString'
import { Dropdown, MenuItem } from 'src/rsuite/Dropdown'

export const Panel_Output = observer(function Panel_Output_(p: {}) {
    const st = useSt()
    const steps = st.db.steps.values.slice(-st.__TEMPT__maxStepsToShow)
    const step = st.db.steps.last()
    return (
        <div tw='flex flex-grow h-full w-full'>
            {/* HISTORY */}
            <div tw='flex flex-col gap-1 overflow-auto'>
                <Dropdown
                    //
                    title='H'
                    startIcon={<span className='material-symbols-outlined'>history</span>}
                >
                    <div tw='text-lg'>History</div>
                    <MenuItem
                        onClick={() => st.layout.FOCUS_OR_CREATE('ComfyUI', {})}
                        label='Comfy'
                        icon={<span className='material-symbols-outlined text-cyan-400'>account_tree</span>}
                    />
                </Dropdown>
                <div tw='flex flex-col-reverse gap-1 overflow-auto'>
                    {steps.map((step) => (
                        <div
                            tw='relative'
                            onClick={() => (st.focusedStepID = step.id)}
                            style={{ width: '3rem', height: '3rem', backgroundColor: 'green' }}
                        >
                            <div tw='absolute'>{_formatAsRelativeDateTime(step.createdAt)}</div>
                            {step.appFile ? (
                                <AppIllustrationUI size='3rem' card={step.appFile} />
                            ) : (
                                <div style={{ width: '3rem', height: '3rem', backgroundColor: 'green' }}></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* OUTPUTS */}
            <div tw='flex flex-col gap-1'>
                <div tw='text-center'>
                    <span className='material-symbols-outlined'>present_to_all</span>
                </div>
                <div tw='flex flex-col-reverse gap-1 overflow-auto'>
                    {step?.data.outputs?.map((output, ix) => (
                        <OutputPreviewUI key={ix} step={step} output={output} />
                    ))}
                </div>
            </div>
            <Panel_ViewImage />
            {/* <div className='flex'>
                    <GalleryControlsUI>
                        <FieldAndLabelUI label='Steps'>
                            <Slider
                                style={{ width: '5rem' }}
                                min={1}
                                max={100}
                                value={st.__TEMPT__maxStepsToShow}
                                onChange={(ev) => (st.__TEMPT__maxStepsToShow = parseInt(ev.target.value, 10))}
                            />
                        </FieldAndLabelUI>
                    </GalleryControlsUI>
                </div>
                <div className='flex flex-col-reverse flex-grow' style={{ overflow: 'auto' }}>
                    {steps.map((step) => (
                        <StepOutputsV2UI step={step} />
                    ))}
                </div> */}
        </div>
    )
})

// export const Panel_LastStep = observer(function StepListUI_(p: {}) {
//     const st = useSt()
//     const lastStep = st.db.steps.last()
//     if (lastStep == null) return null
//     return (
//         <div className='flex flex-col'>
//             {/* <StepHeaderUI step={lastStep} /> */}
//             <StepBodyUI step={lastStep} />
//         </div>
//     )
// })
