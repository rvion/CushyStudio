import { useContext } from 'react'

import { ThemeCtx } from './ThemeCtx'

export const useTheme = () => {
    const ctx = useContext(ThemeCtx)
    return ctx
}
