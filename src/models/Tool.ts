import type { AbsolutePath } from '../utils/fs/BrandedPaths'
import type { FormDefinition } from '../core/Requirement'
import type { LiveInstance } from '../db/LiveInstance'
import type { DraftID, DraftL } from './Draft'
import type { ProjectL } from './Project'

import { LiveCollection } from '../db/LiveCollection'
import { deepCopyNaive } from '../utils/ComfyUtils'
import { LiveRefOpt } from '../db/LiveRefOpt'

export type ToolID = Branded<string, 'FlowDefinitionID'>
export const asToolID = (s: string): ToolID => s as any

export type ToolT = {
    id: ToolID
    owner: string
    createdAt: number
    updatedAt: number
    priority: number
    name: string
    file: AbsolutePath
    form?: Maybe<FormDefinition>
    codeTS?: string
    codeJS?: string
    focusedDraftID?: Maybe<DraftID> // 🔴
}

// export type ToolUIBlock =
//     { type: 'group', children: ToolUIBlock[] }
//     | { type: 'input', key: string, req: any }
/** a thin wrapper around a single action somewhere in a .cushy.ts file */
export interface ToolL extends LiveInstance<ToolT, ToolL> {}
export class ToolL {
    get name() { return this.data.name } // prettier-ignore
    drafts = new LiveCollection(this, 'toolID', 'drafts')

    focusedDraft = new LiveRefOpt<this, DraftL>(this, 'focusedDraftID', 'drafts')

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
            params: deepCopyNaive(fromDraft?.params ?? {}),
        })
        console.log('🔴', draft.id)
        this.update({ focusedDraftID: draft.id })
        return draft
    }
}
