import type { PanelState } from './PanelState'

import { observable } from 'mobx'

// export const PanelStateById = new Map<string, PanelState>()

export const PanelStateByNode = observable(new Map<string, PanelState>())
