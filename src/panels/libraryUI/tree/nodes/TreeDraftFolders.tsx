import type { ITreeElement, ITreeEntry } from '../../../../csuite/tree/TreeEntry'
import type { TreeNode } from '../../../../csuite/tree/TreeNode'
import type { VirtualFolder } from '../../../../csuite/tree/VirtualHierarchy'
import type { DraftL } from '../../../../models/Draft'

import { basename } from 'pathe'

import { TreeDraft } from './TreeDraft'

export class TreeDraftFolder implements ITreeEntry<VirtualFolder<DraftL>> {
    get st() { return cushy } // prettier-ignore
    constructor(
        //
        public vf: VirtualFolder<DraftL>,
    ) {}

    get name() {
        return `${basename(this.vf.folderPath)}`
    }
    get icon() { return <span className='material-symbols-outlined text-yellow-700'>folder</span> } // prettier-ignore
    get iconExpanded() { return <span className='material-symbols-outlined text-yellow-700'>folder_open</span> } // prettier-ignore
    onPrimaryAction = (n: TreeNode) => n.toggle()
    children = (): ITreeElement<any>[] => {
        const vh = this.vf.vh
        const subFolders = vh
            .getSubFolders(this.vf.folderPath)
            .sort()
            .map(
                (folderPath): ITreeElement<VirtualFolder<DraftL>> => ({
                    ctor: TreeDraftFolder,
                    key: folderPath,
                    props: { vh: vh, folderPath },
                }),
            )
        const subFiles = vh
            .getItemsInFolder(this.vf.folderPath)
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
