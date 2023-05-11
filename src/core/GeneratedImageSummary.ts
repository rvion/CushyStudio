import { Tagged } from 'src/utils/types'

export type ImageUID = Tagged<string, 'ImageUID'>
export interface ImageInfos {
    uid: ImageUID
    //
    comfyRelativePath?: string
    comfyURL?: string
    //
    localAbsolutePath?: string
    localURL?: string
}

export type FolderUID = Tagged<string, 'FolderUID'>
// export interface FolderInfos {
//     uid: FolderUID
//     //
//     name?: string
//     imageUIDs?: ImageUID[]
// }
