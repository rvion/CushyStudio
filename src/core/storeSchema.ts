// import type { MessageFromExtensionToWebview } from 'src/types/MessageFromExtensionToWebview'
// import type { ImageT, ImageID } from '../db/_Image'
// import type { ComfySchemaJSON } from 'src/types/ComfySchemaJSON'
// import type { ActionRef } from './KnownWorkflow'
// import { FolderUID, FolderT } from '../models/Folder'

// export type FileMetadata = {
//     [key: string]: any
// }

// export type CushySpace = {
//     name: string
//     messages: { [uid: string]: MessageFromExtensionToWebview[] }
// }

// export type CushyDBData = {
//     /** default: 100 */
//     config: { previewSize?: number }

//     // models
//     files: { [fileUID: ImageID]: ImageT }
//     folders: { [folderUId: FolderUID]: FolderT }
//     msgs: { [id: string]: MessageFromExtensionToWebview }
//     actions: { [actionUID: string]: ActionRef }
//     scopes: { [spaceID: string]: CushySpace }
//     serverStatus: 'connected' | 'disconnected'
//     schema: ComfySchemaJSON
// }

// export const newWorkspaceHistory = (): CushyDBData => ({
//     // config
//     config: {},
//     // status
//     serverStatus: 'disconnected',
//     // models
//     files: {},
//     folders: {},
//     scopes: {},
//     msgs: {},
//     schema: {},
//     actions: {},
// })
