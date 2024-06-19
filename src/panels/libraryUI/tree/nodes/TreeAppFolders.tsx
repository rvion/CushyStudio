import type { ITreeElement, ITreeEntry } from '../../../../csuite/tree/TreeEntry'
import type { TreeNode } from '../../../../csuite/tree/TreeNode'
import type { VirtualFolder } from '../../../../csuite/tree/VirtualHierarchy'
import type { CushyAppL } from '../../../../models/CushyApp'

import { basename } from 'pathe'

import { TreeApp } from './TreeApp'

export class TreeAppFolder implements ITreeEntry<VirtualFolder<CushyAppL>> {
    get st() { return cushy } // prettier-ignore
    constructor(public vf: VirtualFolder<CushyAppL>) {}

    get name() {
        return `${basename(this.vf.folderPath)}`
    }
    get icon() { return <span className='material-symbols-outlined text-yellow-700'>folder</span> } // prettier-ignore
    get iconExpanded() { return <span className='material-symbols-outlined text-yellow-700'>folder_open</span> } // prettier-ignore

    onPrimaryAction = (n: TreeNode) => n.toggle()
    children = (): ITreeElement<any>[] => {
        const vh = this.st.virtualAppHierarchy
        const subFolders = vh
            .getSubFolders(this.vf.folderPath)
            .sort()
            .map(
                (folderPath): ITreeElement<VirtualFolder<CushyAppL>> => ({
                    ctor: TreeAppFolder,
                    key: folderPath,
                    props: { folderPath, vh },
                }),
            )
        const subFiles = vh
            .getItemsInFolder(this.vf.folderPath)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((app): ITreeElement<CushyAppID> => ({ ctor: TreeApp, key: app.id, props: app.id }))
        return [...subFolders, ...subFiles]
    }
}
