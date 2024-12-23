import type { PanelState } from './PanelState'

import { observable } from 'mobx'

export const PanelStateByNode = observable(new Map<string, PanelState>())
