import type { STATE } from 'src/state/state'
import type { ITreeElement, ITreeEntry } from '../TreeEntry'
import type { DraftL } from 'src/models/Draft'

import { TreeApp } from './TreeApp'
import { TreeDraft } from './TreeDraft'
import { CushyAppL } from 'src/models/CushyApp'
import { TreeNode } from '../xxx/TreeNode'

export class TreeFavoriteApps implements ITreeEntry {
    isFolder = true
    icon = (<span className='material-symbols-outlined text-yellow-500'>star</span>)
    name = 'Favorite Apps'
    constructor(public st: STATE, p: {}) {}
    onPrimaryAction = (n: TreeNode) => n.toggle()
    children = (): ITreeElement<CushyAppID>[] => {
        return this.st.favoriteApps.map((app): ITreeElement<CushyAppID> => ({ ctor: TreeApp, key: app.id, props: app.id }))
    }
}

export class TreeFavoriteDrafts implements ITreeEntry {
    isFolder = true
    icon = (<span className='material-symbols-outlined text-blue-500'>star</span>)
    name = 'Favorite Drafts'
    constructor(public st: STATE, p: {}) {}
    onPrimaryAction = (n: TreeNode) => n.toggle()
    children = (): ITreeElement<DraftL>[] => {
        return this.st.favoriteDrafts.map((draft): ITreeElement<DraftL> => ({ ctor: TreeDraft, key: draft.id, props: draft }))
    }
}

export class TreeDrafts implements ITreeEntry {
    isFolder = true
    icon = (<span className='material-symbols-outlined text-blue-500'>palette</span>)
    name = 'All Drafts'
    constructor(public st: STATE, p: {}) {}
    onPrimaryAction = (n: TreeNode) => n.toggle()
    children = (): ITreeElement<DraftL>[] => {
        return this.st.allDrafts.items.map((draft): ITreeElement<DraftL> => ({ ctor: TreeDraft, key: draft.id, props: draft }))
    }
}

export class TreeApps implements ITreeEntry {
    isFolder = true
    icon = (<span className='material-symbols-outlined text-yellow-500'>palette</span>)
    name = 'All Apps'
    constructor(public st: STATE, p: {}) {}
    onPrimaryAction = (n: TreeNode) => n.toggle()
    children = (): ITreeElement<CushyAppID>[] => {
        return this.st.allApps.items.map((app): ITreeElement<CushyAppID> => ({ ctor: TreeApp, key: app.id, props: app.id }))
    }
}
