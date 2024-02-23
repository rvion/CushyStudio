import type { VirtualFolder } from '../../VirtualHierarchy'
import type { ITreeElement, ITreeEntry } from '../TreeEntry'
import type { TreeNode } from '../xxx/TreeNode'
import type { DraftL } from 'src/models/Draft'
import type { STATE } from 'src/state/state'

import { basename } from 'pathe'

import { TreeDraft } from './TreeDraft'

export class TreeDraftFolder implements ITreeEntry<VirtualFolder<DraftL>> {
    constructor(
        //
        public st: STATE,
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
