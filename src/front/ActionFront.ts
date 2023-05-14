import type { ActionRef } from 'src/core/KnownWorkflow'
import type { Maybe } from 'src/utils/types'
import type { FrontFlow } from './FrontFlow'
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
    started: boolean = false
    done: boolean = false
    currentActionRef: Maybe<ActionRef> = null
    formState: Maybe<FormState> = null

    constructor(
        //
        public flow: FrontFlow,
        public actionID: Maybe<ActionDefinitionID> = null,
        public executionID: ExecutionID = asExecutionID(nanoid()),
    ) {
        makeAutoObservable(this)
    }

    focusAction = (action: ActionRef) => {
        if (this.currentActionRef?.id === action.id) return console.log(`already focused on action ${action.id}`)
        this.actionID = action.id
        this.currentActionRef = action
        this.formState = new FormState(this.flow.st, action.form)
    }

    start = () => {
        if (this.actionID == null) return console.log(`can't start action without actionID`)
        const formValue = this.formState?.value
        if (formValue == null) return console.log(`can't start action ${this.actionID} without form value`)
        this.started = true
        this.flow.st.sendMessageToExtension({
            type: 'run-action',
            flowID: this.flow.id,
            actionID: this.actionID,
            executionID: this.executionID,
            data: this.formState?.value,
        })
        this.flow.draft = new ActionFront(this.flow)
        // this.flow.history.push({})
    }
}
