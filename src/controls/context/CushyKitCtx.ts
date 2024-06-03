import type { CushyKit } from './CushyKit'

import { createContext, useContext } from 'react'

export const CushyKitCtx = createContext<CushyKit>({
    clickAndSlideMultiplicator: 1,
    showWidgetUndo: true,
    showWidgetMenu: true,
    showWidgetDiff: true,
    showToggleButtonBox: false,
})

export const useCushyKit = (): CushyKit => useContext(CushyKitCtx)
