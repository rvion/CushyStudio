import { TreeItem, TreeItemIndex } from 'react-complex-tree'
import { CushyAppL } from 'src/models/CushyApp'
import { STATE } from 'src/state/state'
import { ITreeEntry, TreeEntry, TreeEntryAction } from './TreeEntry'
import { AppFavoriteBtnUI } from '../CardPicker2UI'
import { observer } from 'mobx-react-lite'

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

    get name() { return `${this.app.name}`; } // prettier-ignore
    get entry(): Promise<TreeItem<TreeEntry>> { return Promise.resolve(this) } // prettier-ignore
    get data(): TreeApp { return this } // prettier-ignore
    isFolder = true
    get icon() {
        return this.app.illustrationPathWithFileProtocol
        // return <span className='material-symbols-outlined'>Draft</span>
    }

    onPrimaryAction = () => {
        if (this.app == null) return
        if (this.app.drafts.length > 0) return
        this.app.createDraft()
    }

    get children(): TreeItemIndex[] {
        return this.app.drafts.map((draft) => `draft#${draft.id}`)
    }
    extra = (<TreeApp_BtnFavUI entry={this} />)
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

export const TreeApp_BtnFavUI = observer(function TreeApp_BtnFavUI_(p: { entry: TreeApp }) {
    return <AppFavoriteBtnUI app={p.entry.app} />
})
