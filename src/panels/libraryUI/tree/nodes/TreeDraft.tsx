import { nanoid } from 'nanoid'
import { TreeItem } from 'react-complex-tree'
import { ITreeEntry, TreeEntry, TreeEntryAction } from '../TreeEntry'
import { DraftL } from 'src/models/Draft'
import { STATE } from 'src/state/state'

export class TreeDraft implements ITreeEntry {
    get id() { return `draft#${this.draft.id}` } // prettier-ignore
    get name() { return `${this.draft.name}` } // prettier-ignore
    isFolder = false
    canRename = true
    onPrimaryAction = () => {
        this.st.currentDraft = this.draft
    }
    icon = (<span>✨</span>)
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
    ]
    constructor(
        //
        public st: STATE,
        public draft: DraftL,
    ) {
        this.data = this
    }
}
