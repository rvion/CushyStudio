import type { STATE } from 'src/state/state'
import type { ITreeElement, ITreeEntry } from '../TreeEntry'
import type { DraftL } from 'src/models/Draft'

import { TreeApp } from './TreeApp'
import { TreeDraft } from './TreeDraft'

export class TreeFavorite implements ITreeEntry {
    isFolder = true
    icon = (<span className='material-symbols-outlined text-yellow-500'>star</span>)
    name = 'Favorites'
    constructor(public st: STATE, p: {}) {}
    children = (): ITreeElement<CushyAppID>[] => {
        return this.st.library.allFavorites.map(
            (appID): ITreeElement<CushyAppID> => ({ ctor: TreeApp, key: appID, props: appID }),
        )
    }
}

export class TreeDrafts implements ITreeEntry {
    isFolder = true
    icon = (<span className='material-symbols-outlined text-blue-500'>palette</span>)
    name = 'Drafts'
    constructor(public st: STATE, p: {}) {}
    children = (): ITreeElement<DraftL>[] => {
        return this.st.allOpenDrafts.items.map(
            (draft): ITreeElement<DraftL> => ({ ctor: TreeDraft, key: draft.id, props: draft }),
        )
    }
}
