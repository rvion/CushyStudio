import type { STATE } from 'src/state/state'
import type { VirtualFolder } from '../../VirtualHierarchy'
import type { ITreeElement, ITreeEntry } from '../TreeEntry'
import type { TreeNode } from '../xxx/TreeNode'

import { basename } from 'pathe'
import { TreeApp } from './TreeApp'

export class TreeAppFolder implements ITreeEntry<VirtualFolder> {
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
        const vh = this.st.virtualAppHierarchy
        return [
            ...vh.getSubFolders(this.vf.folderPath).map(
                (folderPath): ITreeElement<VirtualFolder> => ({
                    ctor: TreeAppFolder,
                    key: folderPath,
                    props: { folderPath, vh },
                }),
            ),
            ...vh
                .getItemsInFolder(this.vf.folderPath)
                .map((app): ITreeElement<CushyAppID> => ({ ctor: TreeApp, key: app.id, props: app.id })),
        ]
    }
}
