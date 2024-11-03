import type { Presenter } from './Renderer'

import { createContext, useContext } from 'react'

export const presenterCtx = createContext<Presenter | null>(null)

export const usePresenter = (): Presenter => {
   const val = useContext(presenterCtx)
   if (val == null) throw new Error('missing editor in current widget react contexts')
   return val
}

export const usePresenterOrNull = (): Presenter | null => {
   return useContext(presenterCtx)
}
