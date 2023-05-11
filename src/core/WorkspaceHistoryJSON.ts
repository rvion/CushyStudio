import { MessageFromExtensionToWebview } from 'src/types/MessageFromExtensionToWebview'

export type FileMetadata = {
    [key: string]: any
}

export type WorkspaceHistoryJSON = {
    fileMetadata: { [path: string]: FileMetadata }
    folders: { [path: string]: string[] }
    msgs: { at: number; msg: MessageFromExtensionToWebview }[]
}

export const newWorkspaceHistory = (): WorkspaceHistoryJSON => ({
    fileMetadata: {},
    folders: {},
    msgs: [],
})
