import { observable } from 'mobx'

import { PanelState } from './PanelState'

// export const PanelStateById = new Map<string, PanelState>()

export const PanelStateByNode = observable(new Map<string, PanelState>())
