import type { ActionT } from '../models/Action'
import type { ConfigT } from '../models/Config'
import type { FolderT } from '../models/Folder'
import type { GraphT } from '../models/Graph'
import type { ImageT } from '../models/Image'
import type { ProjectT } from '../models/Project'
import type { PromptT } from '../models/Prompt'
import type { SchemaT } from '../models/Schema'
import type { StepT } from '../models/Step'
import type { Indexed } from './LiveDB'

export type LiveStore = {
    configs?: Indexed<ConfigT>
    schemas?: Indexed<SchemaT>
    statuses?: Indexed<{ id: string }>
    // ???
    msgs?: Indexed<{ id: string }>
    // global
    actions?: Indexed<ActionT>
    folders?: Indexed<FolderT>
    images?: Indexed<ImageT>
    // project
    projects?: Indexed<ProjectT>
    steps?: Indexed<StepT>
    prompts?: Indexed<PromptT>
    graphs?: Indexed<GraphT>
}

export type TableName = keyof LiveStore
