import type { Field } from '../../../csuite/model/Field'

import React, { useContext } from 'react'

export const ShowMoreSeenCtx = React.createContext<Maybe<Set<Field>>>(null)
export const useShowMoreSeen = (): Set<Field> => {
    return useContext(ShowMoreSeenCtx) ?? new Set()
}
