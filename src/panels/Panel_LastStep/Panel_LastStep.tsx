import { observer } from 'mobx-react-lite'

import { useSt } from '../../state/stateContext'

export const Panel_LastStep = observer(function StepListUI_(p: {}) {
    const st = useSt()
    const lastStep = st.db.step.last()
    if (lastStep == null) return null
    return (
        <div className='flex flex-col'>
            {/* <StepHeaderUI step={lastStep} /> */}
            {/* <StepOutputsBodyV1UI step={lastStep} /> */}
        </div>
    )
})
