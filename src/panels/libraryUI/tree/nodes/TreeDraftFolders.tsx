import type { DraftL } from 'src/models/Draft'
import type { STATE } from 'src/state/state'
import type { ITreeElement, ITreeEntry } from '../TreeEntry'
import type { TreeNode } from '../xxx/TreeNode'
import type { VirtualFolder } from '../../VirtualHierarchy'

import { basename } from 'pathe'
import { TreeDraft } from './TreeDraft'

export class TreeDraftFolder implements ITreeEntry<VirtualFolder> {
    constructor(
        //
        public st: STATE,
        public vf: VirtualFolder,
    ) {}

    get name() {
        return `${basename(this.vf.folderPath)}`
    }
    get icon() { return <span className='material-symbols-outlined text-yellow-700'>folder</span> } // prettier-ignore
    get iconExpanded() { return <span className='material-symbols-outlined text-yellow-700'>folder_open</span> } // prettier-ignore
    onPrimaryAction = (n: TreeNode) => n.toggle()
    children = (): ITreeElement<any>[] => {
        const vh = this.vf.vh
        return [
            ...vh.getSubFolders(this.vf.folderPath).map(
                (folderPath): ITreeElement<VirtualFolder> => ({
                    ctor: TreeDraftFolder,
                    key: folderPath,
                    props: { vh: vh, folderPath },
                }),
            ),
            ...vh.getItemsInFolder(this.vf.folderPath).map(
                (draft): ITreeElement<DraftL> => ({
                    ctor: TreeDraft,
                    key: draft.id,
                    props: draft,
                }),
            ),
        ]
    }
}
