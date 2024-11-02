import type { PanelCaptioningState } from './PanelCaptioningUI'

import { createContext, useContext } from 'react'

export const PanelCaptioningCtx = createContext<PanelCaptioningState | null>(null)

export function useCaptioningState(): PanelCaptioningState {
   const pcs = useContext(PanelCaptioningCtx)
   if (pcs == null) throw new Error('missing PanelCaptioningState in context')
   return pcs
}
