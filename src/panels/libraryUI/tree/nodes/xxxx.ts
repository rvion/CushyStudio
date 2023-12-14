import { statSync } from 'fs'
import { asCushyAppID } from 'src/db/TYPES.gen'
import { DraftL } from 'src/models/Draft'
import { asRelativePath } from 'src/utils/fs/pathUtils'
import { TreeEntry } from '../TreeEntry'
import { TreeApp } from './TreeApp'
import { TreeDraft } from './TreeDraft'
import { TreeError } from './TreeError'
import { TreeFavorite } from './TreeFavorites'
import { TreeFile } from './TreeFile'
import { TreeFolder } from './TreeFolder'
import { TreeRoot } from './TreeRoot'
import { STATE } from 'src/state/state'

export const getTreeItem = (st: STATE, itemId: string): TreeEntry => {
    if (typeof itemId !== 'string') {
        throw new Error(`[🔴] itemId must be string`)
    }
    // ----------------
    if (itemId === '#root') {
        return new TreeRoot()
    }
    if (itemId === '#favorites') {
        return new TreeFavorite(st)
    }
    // ----------------
    if (itemId.startsWith('favorite#')) {
        const appID = asCushyAppID(itemId.slice('favorite#'.length))
        return new TreeApp(st, itemId, appID)
    }
    if (itemId.startsWith('app#')) {
        return new TreeApp(st, itemId, asCushyAppID(itemId.slice('app#'.length)))
    }
    if (itemId.startsWith('draft#')) {
        const draftId = itemId.slice('draft#'.length)
        const draft: Maybe<DraftL> = st.db.drafts.get(draftId)
        if (!draft) return new TreeError(`Draft ${draftId} not found`)
        return new TreeDraft(st, draft)
    }

    if (itemId.startsWith('path#')) {
        const path = asRelativePath(itemId.slice('path#'.length))
        console.log(`[🌲] << item`, path)

        // 1. folder----------
        const stats = statSync(path)
        const isFSFolder = stats.isDirectory()
        if (isFSFolder) return new TreeFolder(path)

        // 2. file -----------
        return new TreeFile(st, itemId, path)
    }
    console.log(`[👙] `, `file ${itemId} not found`)
    return new TreeError(`file ${itemId} not found`)
}
