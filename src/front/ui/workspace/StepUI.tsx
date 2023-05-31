import type { StepL } from 'src/models/Step'

import { observer } from 'mobx-react-lite'
import { Button } from 'rsuite'
import { ActionPickerUI } from '../flow/ActionPickerUI'
import { ActionUI } from '../widgets/ActionUI'
import { GraphUI } from './GraphUI'
import { Fragment } from 'react'

export const StepUI = observer(function StepUI_(p: { step: StepL }) {
    const step = p.step
    return (
        <Fragment>
            <div className='m-4 ml-8 p-2'>
                <ActionPickerUI step={step} />
                <ActionUI key={step.id} step={step} />
            </div>
            {step.runtime?.graph && <GraphUI graph={step.runtime?.graph} />}
        </Fragment>
    )
})
