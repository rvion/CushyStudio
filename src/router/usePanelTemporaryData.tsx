import type { PanelURI } from './PanelState'

import { useMemo } from 'react'

import { usePanel } from './usePanel'

/** stuff there will get garbage asap */

export const temporaryStore = new Map<PanelURI, any>()
/** quick hacky way to allocate some temporary data from any page */

export const usePanelTemporaryData = <T extends any>(initFn: () => T): T => {
    const panel = usePanel()
    const data = useMemo(() => {
        const prev = temporaryStore.get(panel.uri)
        if (prev) return prev
        const next = initFn()
        temporaryStore.set(panel.uri, next)
        return next
    }, [])

    return data
}
