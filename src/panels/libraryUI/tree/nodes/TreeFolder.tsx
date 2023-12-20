import { readdirSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import { basename } from 'pathe'
import { shouldSkip } from 'src/cards/shouldSkip'
import { asRelativePath } from 'src/utils/fs/pathUtils'
import { ITreeEntry, TreeEntryAction } from '../TreeEntry'
import { TreeNode } from '../xxx/TreeNode'

export class TreeFolder implements ITreeEntry {
    constructor(public path: string) {
        makeAutoObservable(this)
    }
    get id(){return `path#${this.path}`} //prettier-ignore
    get name() { return basename(this.path) } // prettier-ignore

    children(): RelativePath[] {
        const files = readdirSync(this.path)
        return files //
            .filter((e) => !shouldSkip(e))
            .map((file) => asRelativePath(`path#${this.path}/${file}`))
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
    // prettier-ignore
    get icon() {
        if (this.path === 'library/installed')            return <span className='material-symbols-outlined text-red-500'>get_app</span>
        if (this.path === 'library/local')                return <span className='material-symbols-outlined text-blue-500'>privacy_tip</span>
        if (this.path === 'library/built-in')             return <span className='material-symbols-outlined text-green-500'>apps</span>
        if (this.path === 'library/sdk-examples')         return <span className='material-symbols-outlined text-green-500'>live_help</span>
        return <span className='material-symbols-outlined text-base-300'>folder</span>
    }
}
