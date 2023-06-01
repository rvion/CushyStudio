import type { StepL } from 'src/models/Step'

import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { GraphUI } from './GraphUI'

export const StepUI = observer(function StepUI_(p: { step: StepL }) {
    const step = p.step
    return (
        <Fragment>
            aaa
            <GraphUI graph={step.outputGraph.item} />
        </Fragment>
    )
})
