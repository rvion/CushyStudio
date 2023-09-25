import type { LiveInstance } from '../db/LiveInstance'
import type { ImageID, ImageL } from './Image'

import { LiveCollection } from '../db/LiveCollection'

export type FolderID = Branded<string, 'FolderUID'>
export const asFolderID = (s: string): FolderID => s as any as FolderID

export type FolderT = {
    id: FolderID
    name?: string
    imageUIDs?: ImageID[]
}

export interface FolderL extends LiveInstance<FolderT, FolderL> {}
export class FolderL {
    images = new LiveCollection<ImageL>(this, 'folderID', 'images')
}

// const x = 0 as any as FolderL
// const y: FolderT = x
