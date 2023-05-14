import type { FromExtension_ActionStart, MessageFromExtensionToWebview } from '../types/MessageFromExtensionToWebview'
import type { ActionDefinitionID, ExecutionID } from 'src/back/ActionDefinition'
import type { FrontState } from './FrontState'
import type { Branded } from '../utils/types'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { MessageGroupper } from './UIGroupper'
import { ActionFront } from './ActionFront'

export type FlowID = Branded<string, 'FlowID'>

export const asFlowID = (s: string): FlowID => s as any

export class FrontFlow {
    groupper: MessageGroupper
    history: MessageFromExtensionToWebview[] = []
    actions = new Map<ExecutionID, ActionFront>()
    draft = new ActionFront(this)

    /**
     * if the front hear about some action it doesn't know
     * it probably means the action has been started by an other front
     * or in a previous session
     */
    getOrCreateAction = (
        //
        actionID: ActionDefinitionID,
        executionID: ExecutionID,
    ) => {
        let action = this.actions.get(executionID)
        if (!action) {
            action = new ActionFront(this, actionID, executionID)
            this.actions.set(executionID, action)
        }
        return action
    }

    actionStarted = (msg: FromExtension_ActionStart) => {
        const actionFront = this.getOrCreateAction(msg.actionID, msg.executionID)
        // 🔴
        // this.actions.set(msg.executionID, actionFront)
    }

    constructor(
        //
        public st: FrontState,
        public id: FlowID = asFlowID(nanoid()),
    ) {
        this.groupper = new MessageGroupper(this.st, () => this.history)
        makeAutoObservable(this)
    }
}
