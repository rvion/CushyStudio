import type { Branded } from '../utils/types'
import type { FrontState } from './FrontState'

import { nanoid } from 'nanoid'
import { FromExtension_ask, MessageFromExtensionToWebview } from '../types/MessageFromExtensionToWebview'
import { MessageGroupper } from './UIGroupper'
import { makeAutoObservable } from 'mobx'

export type FlowID = Branded<string, 'FlowID'>

export const asFlowID = (s: string): FlowID => s as any

export class FrontFlow {
    groupper: MessageGroupper
    pendingAsk: FromExtension_ask[] = []
    history: MessageFromExtensionToWebview[] = []

    constructor(
        //
        public workspace: FrontState,
        public id: FlowID = asFlowID(nanoid()),
    ) {
        this.groupper = new MessageGroupper(this.workspace, () => this.history)
        makeAutoObservable(this)
    }
}
