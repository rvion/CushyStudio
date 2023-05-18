import type { ActionRef } from '../core/KnownWorkflow'
import type { Maybe } from '../utils/types'
import type { FrontFlow } from './FrontFlow'
import type { ActionEndStatus } from '../types/MessageFromExtensionToWebview'
import { ActionDefinitionID, ExecutionID, asExecutionID } from '../back/ActionDefinition'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { FormState } from '../ui/FormState'

/**
 * a class made to follow an action execution,
 * from conception (check a few actions before picking the right onw)
 * thought filling the form
 * to completion
 * */
export class ActionFront {
    locked: boolean = false

    done: ActionEndStatus | false = false
    currentActionRef: Maybe<ActionRef> = null
    formState: FormState

    constructor(
        //
        public flow: FrontFlow,
        public actionID: Maybe<ActionDefinitionID> = null,
        public executionID: ExecutionID = asExecutionID(nanoid()),
    ) {
        this.formState = new FormState(this.flow.st)
        this.flow.actions.set(this.executionID, this)
        makeAutoObservable(this)
    }

    // focusAction = (action: ActionRef) => {
    //     if (this.locked) throw new Error(`can't focus on action ${action.id} because action ${this.actionID} has already started`)
    //     if (this.currentActionRef?.id === action.id) return console.log(`already focused on action ${action.id}`)
    //     this.actionID = action.id
    //     this.currentActionRef = action
    //     // this.formState = new FormState(this.flow.st, action.form)
    // }

    start = () => {
        if (this.actionID == null) return console.log(`can't start action without actionID`)
        const formValue = this.formState?.value
        if (formValue == null) return console.log(`can't start action ${this.actionID} without form value`)
        this.locked = true

        // fake action start because we don't want to wait
        this.flow.history.push({
            type: 'action-start',
            flowID: this.flow.id,
            actionID: this.actionID,
            executionID: this.executionID,
            data: formValue,
            uid: nanoid(),
        })

        // request action start
        // this.flow.st.sendMessageToExtension({
        //     type: 'run-action',
        //     flowID: this.flow.id,
        //     actionID: this.actionID,
        //     executionID: this.executionID,
        //     data: formValue,
        // })
        this.flow.draft = new ActionFront(this.flow)
        // this.flow.history.push({})
    }
}
