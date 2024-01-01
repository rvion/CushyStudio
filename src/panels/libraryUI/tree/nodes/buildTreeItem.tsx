import type { DraftL } from 'src/models/Draft'
import type { ITreeEntry, TreeEntry, TreeItemID } from '../TreeEntry'
import type { STATE } from 'src/state/state'

import { statSync } from 'fs'
import { asCushyAppID } from 'src/db/TYPES.gen'
import { asRelativePath } from 'src/utils/fs/pathUtils'
import { TreeApp } from './TreeApp'
import { TreeDraft } from './TreeDraft'
import { TreeError } from './TreeError'
import { TreeFavorite } from './TreeFavorites'
import { TreeFile } from './TreeFile'
import { TreeFolder } from './TreeFolder'
// import { TreeRoot } from './TreeRoot'
import { observable } from 'mobx'

export const buildTreeItem = (
    //
    st: STATE,
    itemId: TreeItemID,
): ITreeEntry => {
    if (typeof itemId !== 'string') {
        throw new Error(`[🔴] itemId must be string`)
    }
    // // ----------------
    // if (itemId === '#root') {
    //     return new TreeRoot()
    // }
    // ----------------
    if (itemId === '#apps') {
        return observable({
            id: '#apps',
            name: 'Apps',
            icon: <span className='material-symbols-outlined'>play_arrow</span>,
            children: () => st.db.cushy_apps.findAll().map((app) => `app#${app.id}`),
        })
    }
    // ----------------
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
        // console.log(`[🌲] << item`, path)

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
