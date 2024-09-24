import type { Presenter } from './Presenter'

import { createContext, useContext } from 'react'

export const PresenterCtx = createContext<Presenter | null>(null)

export const usePresenter = (): Presenter => {
    const val = useContext(PresenterCtx)
    if (val == null) throw new Error('missing editor in current widget react contexts')
    return val
}
