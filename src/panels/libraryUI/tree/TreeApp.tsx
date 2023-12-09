import { nanoid } from 'nanoid'
import { TreeItem } from 'react-complex-tree'
import { LibraryFile } from 'src/cards/LibraryFile'
import { ITreeEntry, TreeEntry, TreeEntryAction } from './TreeEntry'
import { CompiledApp } from 'src/models/CushyApp'

export class TreeApp implements ITreeEntry, TreeItem<TreeApp> {
    get index() { return `app#${this.uid}`; } // prettier-ignore
    get name() { return `❌ ${this.app.name}`; } // prettier-ignore
    get entry(): Promise<TreeItem<TreeEntry>> { return Promise.resolve(this) } // prettier-ignore
    get data(): TreeApp { return this } // prettier-ignore
    isFolder = false
    icon = (<span className='material-symbols-outlined'>Draft</span>)

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

    constructor(
        //

        public app: CompiledApp,
        public uid = nanoid(),
    ) {}
}
