import { nanoid } from 'nanoid'
import { TreeItem } from 'react-complex-tree'
import { ITreeEntry, TreeEntry } from './TreeEntry'
import { DraftL } from 'src/models/Draft'
import { STATE } from 'src/state/state'

export class TreeDraft implements ITreeEntry, TreeItem<TreeDraft> {
    get index() { return `draft#${this.draft.id}` } // prettier-ignore
    get name() { return `${this.draft.name}` } // prettier-ignore
    isFolder = false
    canRename = true
    onPrimaryAction = () => {
        this.st.currentDraft = this.draft
    }
    icon = (<span>✨</span>)
    entry: Promise<TreeItem<TreeEntry>>
    data: TreeDraft

    constructor(
        //
        public st: STATE,
        public draft: DraftL,
    ) {
        this.data = this
        this.entry = Promise.resolve(this)
    }
}
