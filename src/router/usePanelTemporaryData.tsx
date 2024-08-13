import { useMemo } from 'react'

import { PanelID } from './PanelState'
import { usePanel } from './usePanel'

/** stuff there will get garbage asap */

export const temporaryStore = new Map<PanelID, any>()
/** quick hacky way to allocate some temporary data from any page */

export const usePanelTemporaryData = <T extends any>(initFn: () => T): T => {
    const panel = usePanel()
    const data = useMemo(() => {
        const prev = temporaryStore.get(panel.id)
        if (prev) return prev
        const next = initFn()
        temporaryStore.set(panel.id, next)
        return next
    }, [])

    return data
}
