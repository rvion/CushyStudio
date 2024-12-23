import type { DraftL } from '../../models/Draft'

import React from 'react'

export const draftContext = React.createContext<DraftL | null>(null)

export const useDraft = (): DraftL => {
   const step = React.useContext(draftContext)
   if (step == null) throw new Error('missing Draft in context')
   return step
}

export const useDraftOrNull = (): Maybe<DraftL> => {
   return React.useContext(draftContext)
}
