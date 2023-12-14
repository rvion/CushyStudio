import { ITreeEntry, TreeEntry } from '../TreeEntry'
import { TreeItem } from 'react-complex-tree'

export class TreeRoot implements ITreeEntry {
    id = '#root'

    constructor() {
        this.data = this
    }

    data: TreeRoot
    name = 'Root item'
    children = () => [
        //
        '#favorites',
        'path#library/built-in',
        'path#library/local',
        'path#library/installed',
        'path#library/sdk-examples',
    ]
}
