import type { LiveInstance } from '../db/LiveInstance'
import type { ImageID } from './Image'
import type { Tagged } from 'src/utils/types'

export type FolderUID = Tagged<string, 'FolderUID'>
export type FolderT = {
    id: FolderUID
    name?: string
    imageUIDs?: ImageID[]
}

export interface FolderL extends LiveInstance<FolderT, FolderL> {}
export class FolderL {}

// const x = 0 as any as FolderL
// const y: FolderT = x
