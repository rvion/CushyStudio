import type { LiveInstance } from '../db/LiveInstance'

import { TableFields } from 'src/db2/_createTable'
import { StepL } from './Step'

export type MediaTextID = Branded<string, { TextUID: true }>

export interface MediaTextT extends TableFields {
    id: MediaTextID
    createdAt: number
    updatedAt: number
    kind: 'text' | 'markdown' | 'html'
    content: string
    stepID?: Maybe<StepID>
}

export interface MediaTextL extends LiveInstance<MediaTextT, MediaTextL> {}
export class MediaTextL {
    get step(): Maybe<StepL> {
        return this.db.steps.get(this.data.stepID)
    }
}
