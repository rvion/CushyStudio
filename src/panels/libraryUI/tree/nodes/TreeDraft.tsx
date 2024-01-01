import { DraftL } from 'src/models/Draft'
import { STATE } from 'src/state/state'
import { ITreeEntry, TreeEntryAction } from '../TreeEntry'

export class TreeDraft implements ITreeEntry {
    get id() { return `draft#${this.draft.id}` } // prettier-ignore
    get name() { return `${this.draft.name}` } // prettier-ignore
    constructor(
        //
        public st: STATE,
        public draft: DraftL,
    ) {
        this.data = this
    }
    isFolder = false
    canRename = true
    onPrimaryAction = () => this.draft.openOrFocusTab()
    // icon = (<span>✨</span>)
    get icon() {
        return this.draft.app?.illustrationPathWithFileProtocol ?? ''
        // return <span className='material-symbols-outlined'>Draft</span>
    }

    data: TreeDraft

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
