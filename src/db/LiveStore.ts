import type { Indexed } from './LiveDB'

import type { GraphT } from '../models/Graph'
import type { ImageT } from '../models/Image'
import type { ProjectT } from '../models/Project'
import type { PromptT } from '../models/Prompt'
import type { SchemaT } from '../models/Schema'
import type { StepT } from '../models/Step'
import type { DraftT } from 'src/models/Draft'

export const schemaVersion = 1337 as const

export type LiveStore = {
    schemaVersion: typeof schemaVersion
    projects?: Indexed<ProjectT>
    schemas?: Indexed<SchemaT>
    prompts?: Indexed<PromptT>
    images?: Indexed<ImageT>
    graphs?: Indexed<GraphT>
    drafts?: Indexed<DraftT>
    steps?: Indexed<StepT>
}

export type TableName = keyof LiveStore
