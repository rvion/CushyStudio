import { observer } from 'mobx-react-lite'
import { CushyAppL } from 'src/models/CushyApp'
import { STATE } from 'src/state/state'
import { AppFavoriteBtnUI } from '../../CardPicker2UI'
import { ITreeEntry, TreeEntryAction } from '../TreeEntry'
import { TreeNode } from '../xxx/TreeNode'
import { makeAutoObservable } from 'mobx'

export class TreeApp implements ITreeEntry {
    app?: Maybe<CushyAppL>
    constructor(
        //
        public st: STATE,
        public id: string,
        public appID: CushyAppID, // public app: CushyAppL,
    ) {
        this.app = st.db.cushy_apps.get(appID)
        makeAutoObservable(this)
    }

    get name() { return `${this.app?.name??'❌'}`; } // prettier-ignore
    isFolder = true
    get icon() {
        return this.app?.illustrationPathWithFileProtocol ?? ''
        // return <span className='material-symbols-outlined'>Draft</span>
    }

    onPrimaryAction = (n: TreeNode) => {
        if (this.app == null) return
        if (!n.opened) n.open()
        if (this.app.drafts.length > 0) return
        this.app.createDraft()
    }

    children = (): string[] => this.app?.drafts.map((draft) => `draft#${draft.id}`) ?? []

    extra = () => (
        <>
            {this.app?.isLoadedInMemory ? <span className='material-symbols-outlined text-green-500'>memory</span> : null}
            <TreeApp_BtnFavUI entry={this} />
        </>
    )
    actions: TreeEntryAction[] = [
        {
            name: 'add Draft',
            icon: 'add',
            mode: 'small',
            onClick: (node) => {
                if (this.app == null) return
                this.app.createDraft()
                node.open()
            },
        },
    ]
}

export const TreeApp_BtnFavUI = observer(function TreeApp_BtnFavUI_(p: { entry: TreeApp }) {
    if (p.entry.app == null) return null
    return <AppFavoriteBtnUI app={p.entry.app} />
})
