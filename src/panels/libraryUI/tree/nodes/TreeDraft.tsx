import type { ITreeEntry, TreeEntryAction } from '../../../../csuite/tree/TreeEntry'
import type { DraftL } from '../../../../models/Draft'
import type { STATE } from '../../../../state/state'

import { DraftFavoriteBtnUI } from './misc/CardPicker2UI'

export class TreeDraft implements ITreeEntry {
   get name(): string {
      return `${this.draft.name}`
   }

   get st(): STATE {
      return cushy
   }

   constructor(public draft: DraftL) {}

   isFolder = false
   canRename = true

   onPrimaryAction = (): void => this.draft.openOrFocusTab()

   // icon = (<span>✨</span>)
   get icon(): string {
      return (
         this.draft.data.illustration ?? //
         this.draft.app?.illustrationPathWithFileProtocol ??
         ''
      )
      // return <span className='material-symbols-outlined'>Draft</span>
   }

   delete = (): boolean => {
      this.draft.delete({})
      return true
   }
   extra = (): JSX.Element => <DraftFavoriteBtnUI draft={this.draft} />
   actions: TreeEntryAction[] = [
      {
         name: 'add Draft',
         icon: 'play_arrow',
         mode: 'small',
         onClick: (): void => {
            this.draft.AWAKE()
            this.draft.start({})
         },
      },
      {
         name: 'add Draft',
         icon: 'close',
         mode: 'small',
         onClick: () => this.draft.delete({}),
      },
   ]
}
