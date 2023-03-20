import { createContext, useContext } from 'react'
import { CushyLayout } from './CushyLayoutUI'

export const CushyLayoutContext = createContext<CushyLayout | null>(null)

export const useLayout = () => {
    const st = useContext(CushyLayoutContext)
    if (st == null) throw new Error('no layout context')
    return st
}
