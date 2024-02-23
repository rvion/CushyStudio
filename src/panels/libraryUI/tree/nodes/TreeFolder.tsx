import type { ITreeElement, ITreeEntry, TreeEntryAction } from '../TreeEntry'
import type { STATE } from 'src/state/state'

import { readdirSync, statSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import { basename } from 'pathe'

import { TreeNode } from '../xxx/TreeNode'
import { TreeFile } from './TreeFile'
import { shouldSkip } from 'src/cards/shouldSkip'
import { asRelativePath } from 'src/utils/fs/pathUtils'

export class TreeFolder implements ITreeEntry<RelativePath> {
    constructor(public st: STATE, public path: RelativePath) {
        makeAutoObservable(this)
    }
    get id(){return `path#${this.path}`} //prettier-ignore
    get name() { return basename(this.path) } // prettier-ignore

    children(): ITreeElement<RelativePath>[] {
        const files = readdirSync(this.path)
        const subFolders: ITreeElement<RelativePath>[] = []
        const subFiles: ITreeElement<RelativePath>[] = []
        for (const file of files) {
            if (shouldSkip(file)) continue
            const relPath = asRelativePath(`${this.path}/${file}`)
            const stats = statSync(relPath)
            const isFolder = stats.isDirectory()
            if (isFolder) subFolders.push({ ctor: TreeFolder, key: file, props: relPath })
            else subFiles.push({ ctor: TreeFile, key: file, props: relPath })
        }
        return [
            //
            ...subFolders.sort((a, b) => a.key.localeCompare(b.key)),
            ...subFiles.sort((a, b) => a.key.localeCompare(b.key)),
        ]
    }

    isFolder = true

    onPrimaryAction = (n: TreeNode) => {
        n.toggle()
    }

    get actions(): TreeEntryAction[] {
        if (this.path === 'library/installed')
            return [{ name: 'Find More...', icon: 'cloud_download', onClick: () => {}, mode: 'full' }]
        if (this.path === 'library/local') return [{ name: 'create...', icon: 'add', onClick: () => {}, mode: 'full' }]
        return []
    }
    get icon() { return <span className='material-symbols-outlined text-yellow-700'>folder</span> } // prettier-ignore
    get iconExpanded() { return <span className='material-symbols-outlined text-yellow-700'>folder_open</span> } // prettier-ignore

    // prettier-ignore
    // get icon() {
    //     // if (this.path === 'library/installed')            return <span className='material-symbols-outlined text-red-500'>get_app</span>
    //     // if (this.path === 'library/local')                return <span className='material-symbols-outlined text-blue-500'>privacy_tip</span>
    //     // if (this.path === 'library/built-in')             return <span className='material-symbols-outlined text-green-500'>apps</span>
    //     // if (this.path === 'library/sdk-examples')         return <span className='material-symbols-outlined text-green-500'>live_help</span>
    //     return <span className='material-symbols-outlined text-base-300'>folder</span>
    // }
}
