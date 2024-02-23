import React from 'react'

import { DraftL } from 'src/models/Draft'

export const draftContext = React.createContext<DraftL | null>(null)

export const useDraft = (): DraftL => {
    const step = React.useContext(draftContext)
    if (step == null) throw new Error('missing Draft in context')
    return step
}
