import { FrontFlow } from './FrontFlow'

import React from 'react'

export const flowContext = React.createContext<FrontFlow | null>(null)

export const useFlow = (): FrontFlow => {
    const flow = React.useContext(flowContext)
    if (flow == null) throw new Error('missing flow in context')
    return flow
}
