import type { ITreeElement, ITreeEntry } from '../../../../csuite/tree/TreeEntry'
import type { TreeNode } from '../../../../csuite/tree/TreeNode'
import type { VirtualFolder } from '../../../../csuite/tree/VirtualHierarchy'
import type { CushyAppL } from '../../../../models/CushyApp'
import type { DraftL } from '../../../../models/Draft'

import { TreeApp } from './TreeApp'
import { TreeAppFolder } from './TreeAppFolders'
import { TreeDraft } from './TreeDraft'
import { TreeDraftFolder } from './TreeDraftFolders'

export class TreeFavoriteApps implements ITreeEntry {
   isFolder = true
   icon = (<span className='material-symbols-outlined _text-yellow-500'>star</span>)
   name = 'Favorite Apps'
   constructor(p: {}) {}
   onPrimaryAction = (n: TreeNode) => n.toggle()
   children = (): ITreeElement<CushyAppID>[] => {
      return cushy.favoriteApps.map(
         (app): ITreeElement<CushyAppID> => ({ ctor: TreeApp, key: app.id, props: app.id }),
      )
   }
}

export class TreeFavoriteDrafts implements ITreeEntry {
   isFolder = true
   icon = (<span className='material-symbols-outlined _text-blue-500'>star</span>)
   name = 'Favorite Drafts'
   constructor(p: {}) {}
   onPrimaryAction = (n: TreeNode) => n.toggle()
   children = (): ITreeElement<DraftL>[] => {
      return cushy.favoriteDrafts.map(
         (draft): ITreeElement<DraftL> => ({ ctor: TreeDraft, key: draft.id, props: draft }),
      )
   }
}

export class TreeAllDrafts implements ITreeEntry {
   isFolder = true
   icon = (<span className='material-symbols-outlined _text-blue-500'>palette</span>)
   name = 'All Drafts'
   constructor(p: {}) {}
   onPrimaryAction = (n: TreeNode) => n.toggle()
   children = (): ITreeElement<any>[] => {
      const vh = cushy.virtualDraftHierarchy
      const subFolders = vh
         .getTopLevelFolders()
         .sort()
         .map(
            (folderPath): ITreeElement<VirtualFolder<DraftL>> => ({
               ctor: TreeDraftFolder,
               key: folderPath,
               props: { folderPath, vh },
            }),
         )
      const subFiles = vh.topLevelItems
         .sort((a, b) => a.name.localeCompare(b.name))
         .map(
            (draft): ITreeElement<DraftL> => ({
               ctor: TreeDraft,
               key: draft.id,
               props: draft,
            }),
         )
      return [...subFolders, ...subFiles]
   }
}

export class TreeAllApps implements ITreeEntry {
   isFolder = true
   icon = (<span className='material-symbols-outlined _text-yellow-500'>palette</span>)
   name = 'All Apps'
   constructor(p: {}) {}
   onPrimaryAction = (n: TreeNode) => n.toggle()
   children = (): ITreeElement<any>[] => {
      const vh = cushy.virtualAppHierarchy
      return [
         ...vh.getTopLevelFolders().map(
            (folderPath): ITreeElement<VirtualFolder<CushyAppL>> => ({
               ctor: TreeAppFolder,
               key: folderPath,
               props: { folderPath, vh },
            }),
         ),
         ...vh.topLevelItems.map(
            (app): ITreeElement<CushyAppID> => ({ ctor: TreeApp, key: app.id, props: app.id }),
         ),
      ]
   }
}
