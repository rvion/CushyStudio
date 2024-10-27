import type { STATE } from './state'

import React from 'react'

export const stContext = React.createContext<STATE | null>(null)

export const useSt = (): STATE => {
   const st = React.useContext(stContext)
   if (st == null) throw new Error('stContext not provided')
   return st
}
