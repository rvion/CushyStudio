import { nanoid } from 'nanoid'
import { TreeItem } from 'react-complex-tree'
import { ITreeEntry } from '../TreeEntry'

export class TreeError implements ITreeEntry {
    get id() { return `error#${this.uid}` } // prettier-ignore
    get data(): TreeError { return this } // prettier-ignore
    get name() { return `❌ ${this.title}` } // prettier-ignore
    isFolder = false
    icon = (<span className='material-symbols-outlined'>Error</span>)
    constructor(public title: string, public uid = nanoid()) {}
}
