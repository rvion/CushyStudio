import type { DraftL } from 'src/models/Draft'
import type { STATE } from 'src/state/state'
import { DraftFavoriteBtnUI } from '../../CardPicker2UI'
import type { ITreeEntry, TreeEntryAction } from '../TreeEntry'

export class TreeDraft implements ITreeEntry {
    get name() { return `${this.draft.name}` } // prettier-ignore
    constructor(
        //
        public st: STATE,
        public draft: DraftL,
    ) {}

    isFolder = false
    canRename = true
    onPrimaryAction = () => this.draft.openOrFocusTab()
    // icon = (<span>✨</span>)
    get icon() {
        return (
            this.draft.data.illustration ?? //
            this.draft.app?.illustrationPathWithFileProtocol ??
            ''
        )
        // return <span className='material-symbols-outlined'>Draft</span>
    }

    extra = () => <DraftFavoriteBtnUI draft={this.draft} />

    actions: TreeEntryAction[] = [
        {
            name: 'add Draft',
            icon: 'play_arrow',
            mode: 'small',
            onClick: () => {
                this.draft.AWAKE()
                this.draft.start()
            },
        },
        {
            name: 'add Draft',
            icon: 'close',
            mode: 'small',
            onClick: () => this.draft.delete(),
        },
    ]
}
