import type { StepL } from '../../models/Step'

import React from 'react'

export const stepContext = React.createContext<StepL | null>(null)

export const useStep = (): StepL => {
    const step = React.useContext(stepContext)
    if (step == null) throw new Error('step not provided')
    return step
}
