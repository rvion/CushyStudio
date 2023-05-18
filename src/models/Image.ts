import type { Tagged } from 'src/utils/types'
import type { FolderUID, FolderL, FolderT } from './Folder'
import type { LiveInstance } from '../db/LiveInstance'

export type ImageID = Tagged<string, 'ImageUID'>
export interface ImageT {
    id: ImageID
    //
    comfyRelativePath?: string
    comfyURL?: string
    //
    localAbsolutePath?: string
    localURL?: string
    //
    star?: number
    folder?: FolderUID
}

export interface ImageL extends LiveInstance<ImageT, ImageL> {}
export class ImageL {
    get test1() {
        return 'a123'
    }

    test2 = () => 'b123'
    moveTo(folder: FolderL) {
        this.update({ folder: folder.id })
    }
}
