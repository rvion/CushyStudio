import { TreeItem, TreeItemIndex } from 'react-complex-tree'
import { CushyAppL } from 'src/models/CushyApp'
import { STATE } from 'src/state/state'
import { ITreeEntry, TreeEntry, TreeEntryAction } from './TreeEntry'

export class TreeApp implements ITreeEntry, TreeItem<TreeApp> {
    app: CushyAppL
    constructor(
        //
        public st: STATE,
        public index: TreeItemIndex,
        public appID: CushyAppID, // public app: CushyAppL,
    ) {
        this.app = st.db.cushy_apps.getOrThrow(appID)
    }

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
}
