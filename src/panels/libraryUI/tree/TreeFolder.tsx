import { readdirSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import { basename } from 'path'
import { TreeItem } from 'react-complex-tree'
import { shouldSkip } from 'src/cards/shouldSkip'
import { asRelativePath } from 'src/utils/fs/pathUtils'
import { ITreeEntry, TreeEntryAction } from './TreeEntry'

export class TreeFolder implements ITreeEntry, TreeItem<TreeFolder> {
    get index(){return `path#${this.path}`} //prettier-ignore
    get entry(): Promise<TreeItem<TreeFolder>> { return Promise.resolve(this) } // prettier-ignore
    get data(): TreeFolder { return this } // prettier-ignore
    get name() { return basename(this.path) } // prettier-ignore
    get children(): RelativePath[] {
        const files = readdirSync(this.path)
        return files //
            .filter((e) => !shouldSkip(e))
            .map((file) => asRelativePath(`path#${this.path}/${file}`))
    }
    isFolder = true

    get actions(): TreeEntryAction[] {
        if (this.path === 'library/Installed')
            return [
                //
                { name: 'Add Draft', icon: 'add', onClick: () => {}, mode: 'full' },
            ]
        return []
    }
    // prettier-ignore
    get icon() {
        if (this.path === 'library/installed')            return <span className='material-symbols-outlined text-red-500'>get_app</span>
        if (this.path === 'library/local')                return <span className='material-symbols-outlined text-blue-500'>privacy_tip</span>
        if (this.path === 'library/built-in')             return <span className='material-symbols-outlined text-green-500'>apps</span>
        if (this.path === 'library/sdk-examples')         return <span className='material-symbols-outlined text-green-500'>live_help</span>
        return <span className='material-symbols-outlined'>folder</span>
    }
    // get iconExpanded() {}
    constructor(public path: string) {
        makeAutoObservable(this)
    }
    // getChildren = (): RelativePath[] => {
    //     const files = readdirSync(this.path)
    //     return files.map((file) => asRelativePath(`${this.path}/${file}`))
    // }
}
