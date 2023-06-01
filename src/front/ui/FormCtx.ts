import type { StepL } from 'src/models/Step'

import React from 'react'
import { ActionL } from 'src/models/Action'

export const formContext = React.createContext<ActionL | null>(null)

export const useForm = (): ActionL => {
    const step = React.useContext(formContext)
    if (step == null) throw new Error('step not provided')
    return step
}
