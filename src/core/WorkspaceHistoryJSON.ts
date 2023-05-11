import type { MessageFromExtensionToWebview } from 'src/types/MessageFromExtensionToWebview'
import type { FolderUID, ImageUID } from './GeneratedImageSummary'

export type FileMetadata = {
    [key: string]: any
}

export type CushyFolderMetadata = { name?: string; imageUIDs?: ImageUID[] }
export type CushyFileMetadata = { star?: number; folder?: FolderUID }

export type CushyDBData = {
    /** default: 100 */
    config: { previewSize?: number }
    files: { [fileUID: ImageUID]: CushyFileMetadata }
    folders: { [folderUId: FolderUID]: CushyFolderMetadata }
    msgs: { at: number; msg: MessageFromExtensionToWebview }[]
}

export const newWorkspaceHistory = (): CushyDBData => ({
    config: {},
    files: {},
    folders: { best: {} },
    msgs: [],
})
