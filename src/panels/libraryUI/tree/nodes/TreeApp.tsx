import type { DraftL } from 'src/models/Draft'
import type { STATE } from 'src/state/state'
import type { ITreeElement, ITreeEntry, TreeEntryAction } from '../TreeEntry'
import type { TreeNode } from '../xxx/TreeNode'
import type { CushyAppL } from 'src/models/CushyApp'
import type { VirtualFolder } from '../../VirtualHierarchy'

import { observer } from 'mobx-react-lite'
import { AppFavoriteBtnUI } from '../../CardPicker2UI'
import { makeAutoObservable } from 'mobx'
import { TreeDraft } from './TreeDraft'
import { TreeDraftFolder } from './TreeDraftFolders'

export class TreeApp implements ITreeEntry {
    app?: Maybe<CushyAppL>
    constructor(
        //
        public st: STATE,
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
        if (!n.isOpen) n.open()
        if (this.app.drafts.length > 0) return
        this.app.createDraft()
    }

    children = (): ITreeElement<any>[] => {
        const app = this.app
        if (app == null) return []
        const vh = app.subFolderStructure
        return [
            ...vh.getTopLevelFolders().map(
                (folderPath): ITreeElement<VirtualFolder> => ({
                    ctor: TreeDraftFolder,
                    key: folderPath,
                    props: { vh, folderPath },
                }),
            ),
            ...vh.topLevelItems.map((draft): ITreeElement<DraftL> => ({ ctor: TreeDraft, key: draft.id, props: draft })),
        ]
    }

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
