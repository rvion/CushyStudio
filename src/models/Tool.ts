import type { AbsolutePath } from '../utils/fs/BrandedPaths'
import type { LiveInstance } from '../db/LiveInstance'
import type { DraftID, DraftL } from './Draft'
import type { ProjectL } from './Project'

import { LiveCollection } from '../db/LiveCollection'
import { deepCopyNaive } from '../utils/ComfyUtils'
import { LiveRefOpt } from '../db/LiveRefOpt'
import { FormBuilder, Requestable } from 'src/controls/InfoRequest'
import { Action, RequestableDict } from 'src/core/Requirement'
import { ManualPromise } from 'src/utils/ManualPromise'
import { Result, ResultFailure, __FAIL, __OK } from 'src/utils/Either'

export type ToolID = Branded<string, 'FlowDefinitionID'>
export const asToolID = (s: string): ToolID => s as any

export type ToolT = {
    id: ToolID
    owner: string
    createdAt: number
    updatedAt: number
    priority: number
    name: string
    description?: string
    file: AbsolutePath
    // form?: Maybe<(fb: FormBuilder) => Requestable>
    // codeTS?: string
    codeJS?: string
    focusedDraftID?: Maybe<DraftID> // 🔴
}

// export type ToolUIBlock =
//     { type: 'group', children: ToolUIBlock[] }
//     | { type: 'input', key: string, req: any }
/** a thin wrapper around a single action somewhere in a .ts file */
export interface ToolL extends LiveInstance<ToolT, ToolL> {}
export class ToolL {
    get name() { return this.data.name } // prettier-ignore

    drafts = new LiveCollection<DraftL>(this, 'toolID', 'drafts')

    focusedDraft = new LiveRefOpt<this, DraftL>(this, 'focusedDraftID', 'drafts')

    /** WIP */
    retrieveAction = (): Result<Action<any>> => {
        // const action = new ManualPromise<Action<Requestable>>()
        // no code
        const codeJS = this.data.codeJS
        if (codeJS == null) return __FAIL('not no code')

        // eval action
        console.log('[🤖] evaluating code')
        const actionsPool: { name: string; action: Action<RequestableDict> }[] = []
        const registerActionFn = (name: string, action: Action<any>): void => {
            actionsPool.push({ name, action })
        }
        const ProjectScriptFn = new Function('action', codeJS)
        ProjectScriptFn(registerActionFn)

        // fst action
        if (actionsPool.length !== 1) return __FAIL('not exactly one action')
        return __OK(actionsPool[0].action)
    }

    /** create a new Draft slot */
    createDraft = (
        pj: ProjectL,
        /** the basis step you'd like to base yourself when creating a new branch */
        fromDraft?: Maybe<{ toolID: ToolID; params: Maybe<any> }>,
    ): DraftL => {
        if (fromDraft?.toolID && fromDraft.toolID !== this.id) throw new Error('🔴')
        const toolID = fromDraft?.toolID ?? this.id
        const draft = this.db.drafts.create({
            toolID: toolID,
            graphID: pj.rootGraph.id,
            title: 'Untitled',
            params: fromDraft && fromDraft.params ? deepCopyNaive(fromDraft.params) : undefined,
        })
        console.log('🔴', draft.id)
        this.update({ focusedDraftID: draft.id })
        return draft
    }
}
