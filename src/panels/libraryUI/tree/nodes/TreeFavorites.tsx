import { STATE } from 'src/state/state'
import { ITreeEntry, TreeEntry } from '../TreeEntry'
import { TreeItem, TreeItemIndex } from 'react-complex-tree'

export class TreeFavorite implements ITreeEntry {
    id = '#favorites'
    get data(): TreeFavorite { return this } // prettier-ignore
    isFolder = true
    icon = (<span className='material-symbols-outlined text-yellow-500'>star</span>)
    name = 'Favorites'
    constructor(public st: STATE) {}

    children = (): string[] => {
        return this.st.library.allFavorites.map((appID) => `favorite#${appID}`)
    }
}
