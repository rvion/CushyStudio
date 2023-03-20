import type { CushyLayout } from './CushyLayoutUI'

import { createContext, useContext } from 'react'

export const CushyLayoutContext = createContext<CushyLayout | null>(null)

export const useLayout = () => {
    const st = useContext(CushyLayoutContext)
    if (st == null) throw new Error('no layout context')
    return st
}
