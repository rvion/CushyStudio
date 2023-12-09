import { makeAutoObservable } from 'mobx'
import { basename } from 'path'
import { TreeItem, TreeItemIndex } from 'react-complex-tree'
import { LibraryFile } from 'src/cards/LibraryFile'
import { asAppPath, isAppPath } from 'src/cards/asAppPath'
import { STATE } from 'src/state/state'
import { ITreeEntry, TreeEntryAction } from './TreeEntry'
import { AppIllustrationUI } from 'src/cards/fancycard/AppIllustrationUI'

export class TreeFile implements ITreeEntry, TreeItem<TreeFile> {
    // get index(){return `path#${this.path}`} //prettier-ignore
    get entry(): Promise<TreeItem<TreeFile>> { return Promise.resolve(this) } // prettier-ignore
    get data(): TreeFile { return this } // prettier-ignore
    actions: TreeEntryAction[] = [
        {
            name: 'add Draft',
            icon: 'add',
            mode: 'small',
            onClick: () => {
                if (this.app == null) return
                this.app.createDraft()
            },
        },
    ]
    get name() { return basename(this.path) } // prettier-ignore
    onSelect = () => {
        if (this.data == null) return
    }
    get children(): TreeItemIndex[] {
        // console.log(`[👙] aaaa`)
        if (this.app == null) return []
        return this.app.drafts.map((d) => `draft#${d.id}`)
    }
    isFolder = true
    get icon() {
        if (this.app) return <AppIllustrationUI size='1.3rem' app={this.app} />
        return <span>❓</span>
        // if (this.path === 'library/Installed') return <span className='material-symbols-outlined'>get_app</span>
        // if (this.path === 'library/Local') return <span className='material-symbols-outlined'>privacy_tip</span>
        // if (this.path === 'library/CushyStudio') return <span className='material-symbols-outlined'>home</span>
        // return <span className='material-symbols-outlined'>home</span>
    }
    app: Maybe<LibraryFile> = null
    constructor(
        //
        public st: STATE,
        public index: TreeItemIndex,
        public path: RelativePath,
    ) {
        console.log(`[👙] `, index, path)
        if (isAppPath(path)) this.app = st.library.fileIndex.get(path)
        makeAutoObservable(this)
    }
    // getChildren = (): RelativePath[] => {
    //     const files = readdirSync(this.path)
    //     return files.map((file) => asRelativePath(`${this.path}/${file}`))
    // }
}
