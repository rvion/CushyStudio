import type { UnifiedCanvas } from './states/UnifiedCanvas'

import { createContext, useContext } from 'react'

export const UnifiedCanvasCtx = createContext<UnifiedCanvas | null>(null)

export const useUnifiedCanvas = (): UnifiedCanvas => {
    const val = useContext(UnifiedCanvasCtx)
    if (val == null) throw new Error('missing unified canvasin react context')
    return val
}
