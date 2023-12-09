import { ITreeEntry, TreeEntry } from './TreeEntry'
import { TreeItem } from 'react-complex-tree'

export class TreeRoot implements ITreeEntry, TreeItem<TreeEntry> {
    index = '#root'
    constructor() {
        this.data = this
        this.entry = Promise.resolve(this)
    }

    entry: Promise<TreeItem<TreeEntry>>
    data: TreeRoot
    name = 'Root item'
    children = [
        //
        '#favorites',
        'path#library/built-in',
        'path#library/local',
        'path#library/installed',
        'path#library/sdk-examples',
    ]
}
