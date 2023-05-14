import type { FromExtension_ActionStart, MessageFromExtensionToWebview } from '../types/MessageFromExtensionToWebview'
import type { ActionDefinitionID, ExecutionID } from 'src/back/ActionDefinition'
import type { FrontState } from './FrontState'
import type { Branded } from '../utils/types'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { MessageGroupper } from './UIGroupper'

export type FlowID = Branded<string, 'FlowID'>

export const asFlowID = (s: string): FlowID => s as any

export class FrontFlow {
    groupper: MessageGroupper
    history: MessageFromExtensionToWebview[] = []
    actions = new Map<ExecutionID, ActionFront>()

    actionStarted = (msg: FromExtension_ActionStart) => {
        const actionFront = new ActionFront(this, msg.actionID, msg.executionID)
        this.actions.set(msg.executionID, actionFront)
    }

    constructor(
        //
        public workspace: FrontState,
        public id: FlowID = asFlowID(nanoid()),
    ) {
        this.groupper = new MessageGroupper(this.workspace, () => this.history)
        makeAutoObservable(this)
    }
}

export class ActionFront {
    done: boolean = false
    constructor(
        //
        public flow: FrontFlow,
        public actionID: ActionDefinitionID,
        public executionID: ExecutionID,
    ) {}
}
