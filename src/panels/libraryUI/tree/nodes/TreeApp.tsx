import { observer } from 'mobx-react-lite'
import { CushyAppL } from 'src/models/CushyApp'
import { STATE } from 'src/state/state'
import { AppFavoriteBtnUI } from '../../CardPicker2UI'
import { ITreeEntry, TreeEntryAction } from '../TreeEntry'

export class TreeApp implements ITreeEntry {
    app: CushyAppL
    constructor(
        //
        public st: STATE,
        public id: string,
        public appID: CushyAppID, // public app: CushyAppL,
    ) {
        this.app = st.db.cushy_apps.getOrThrow(appID)
    }

    get name() { return `${this.app.name}`; } // prettier-ignore
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

    children = (): string[] => this.app.drafts.map((draft) => `draft#${draft.id}`)

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
