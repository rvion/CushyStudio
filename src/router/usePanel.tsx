import type { PanelState } from './PanelState'

import React from 'react'

export const panelContext = React.createContext<PanelState | null>(null)

/**
 * THIS IS A KEY HOOK OF CushyStudio
 * it returns a stable helper instance that allow various things like
 *   - manipulate panel props
 *   - access panel position
 *   - allocate persistent resources
 *   -
 */
export const usePanel = <PROPS extends object = any>(): PanelState<PROPS> => {
    const data = React.useContext(panelContext)
    if (data == null) throw new Error('❌ usePanel has been called not in a Panel')
    return data
}
