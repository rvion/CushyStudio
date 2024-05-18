import type { DraftL } from '../../../../models/Draft'
import type { ITreeEntry, TreeEntryAction } from '../TreeEntry'

import { DraftFavoriteBtnUI } from '../../CardPicker2UI'

export class TreeDraft implements ITreeEntry {
    get name() { return `${this.draft.name}` } // prettier-ignore
    get st() { return cushy } // prettier-ignore
    constructor(public draft: DraftL) {}

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

    delete = () => {
        this.draft.delete()
        return true
    }
    extra = () => <DraftFavoriteBtnUI draft={this.draft} />
    actions: TreeEntryAction[] = [
        {
            name: 'add Draft',
            icon: 'play_arrow',
            mode: 'small',
            onClick: () => {
                this.draft.AWAKE()
                this.draft.start({})
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
