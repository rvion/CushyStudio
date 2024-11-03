import type { ITreeEntry } from '../../../../csuite/tree/TreeEntry'

import { nanoid } from 'nanoid'

export class TreeError implements ITreeEntry {
   get id(): string { return `error#${this.uid}` } // prettier-ignore
   get name(): string { return `❌ ${this.title}` } // prettier-ignore
   isFolder: boolean = false
   icon = (<span className='material-symbols-outlined'>Error</span>)
   constructor(
      public title: string,
      public uid = nanoid(),
   ) {}
}
