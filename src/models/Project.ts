import type { PossibleActionFile } from 'src/back/PossibleActionFile'
import type { RelativePath } from 'src/utils/fs/BrandedPaths'
import type { LiveInstance } from '../db/LiveInstance'
import type { GraphID, GraphL } from './Graph'
import type { SchemaL } from './Schema'
import type { ToolID, ToolL } from './Tool'

import { LiveRef } from '../db/LiveRef'
import { LiveRefOpt } from '../db/LiveRefOpt'

export type ProjectID = Branded<string, 'ProjectID'>
export const asProjectID = (s: string): ProjectID => s as any

export type ProjectT = {
    id: ProjectID
    createdAt: number
    updatedAt: number
    name: string
    rootGraphID: GraphID
    activeToolID?: ToolID
    actionFile?: RelativePath
    // currentToolID
    // rootStepID: StepID
}

/** a thin wrapper around a single Project somewhere in a .ts file */
export interface ProjectL extends LiveInstance<ProjectT, ProjectL> {}
export class ProjectL {
    rootGraph = new LiveRef<this, GraphL>(this, 'rootGraphID', 'graphs')

    // _config
    // getConfig() {}
    activeTool = new LiveRefOpt<this, ToolL>(this, 'activeToolID', 'tools')

    get activeFile(): Maybe<PossibleActionFile> {
        if (this.data.actionFile == null) return null
        return this.st.toolbox.filesMap.get(this.data.actionFile)
    }

    focusActionFile(paf: PossibleActionFile): void {
        this.update({ actionFile: paf.relPath })
    }

    focusTool(tool: ToolL): void {
        this.update({ activeToolID: tool.id })
        if (tool.focusedDraft.item == null) {
            tool.createDraft(this).focus()
        }
    }
    get schema(): SchemaL {
        return this.db.schema
    }
}
