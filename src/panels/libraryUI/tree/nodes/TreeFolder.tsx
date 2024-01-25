import { readdirSync, statSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import { basename } from 'pathe'
import { shouldSkip } from 'src/cards/shouldSkip'
import { asRelativePath } from 'src/utils/fs/pathUtils'
import { ITreeElement, ITreeEntry, TreeEntryAction } from '../TreeEntry'
import { TreeNode } from '../xxx/TreeNode'
import { STATE } from 'src/state/state'
import { TreeFile } from './TreeFile'

export class TreeFolder implements ITreeEntry<RelativePath> {
    constructor(public st: STATE, public path: RelativePath) {
        makeAutoObservable(this)
    }
    get id(){return `path#${this.path}`} //prettier-ignore
    get name() { return basename(this.path) } // prettier-ignore

    children(): ITreeElement<RelativePath>[] {
        const files = readdirSync(this.path)
        const xxx: ITreeElement<RelativePath>[] = files //
            .filter((e) => !shouldSkip(e))
            .map((file) => {
                const relPath = asRelativePath(`${this.path}/${file}`)
                const x: ITreeElement<RelativePath> = {
                    ctor: (st: STATE, path: RelativePath) => {
                        const stats = statSync(path)
                        const isFolder = stats.isDirectory()
                        return isFolder //
                            ? new TreeFolder(st, path)
                            : new TreeFile(st, path)
                    },
                    key: file,
                    props: relPath,
                }
                return x
            })
        console.log(xxx)
        return xxx
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
