import { observer } from 'mobx-react-lite'
import { Slider } from 'src/rsuite/shims'
import { useSt } from '../state/stateContext'
import { StepOutputsV2UI } from 'src/outputs/StepOutputsV2UI'
import { GalleryControlsUI } from './Panel_Gallery'
import { FieldAndLabelUI } from 'src/widgets/misc/FieldAndLabelUI'

export const Panel_Outputs = observer(function Panel_Outputs_(p: {}) {
    const st = useSt()
    const steps = st.db.steps.getLastN(st.__TEMPT__maxStepsToShow)
    return (
        <div className='flex flex-col'>
            {/* <FieldAndLabelUI label='Show Last'> */}
            <div className='flex'>
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
            {/* </FieldAndLabelUI> */}
            {/* </Panel> */}
            <div className='flex flex-col-reverse flex-grow' style={{ overflow: 'auto' }}>
                {steps.map((step) => (
                    // <InView key={step.id} as='div' onChange={(inView, entry) => {}}>
                    <StepOutputsV2UI key={step.id} step={step} />
                    // </InView>
                ))}
            </div>
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
