import { STATE } from 'src/state/state'
import { ITreeEntry, TreeEntry } from './TreeEntry'
import { TreeItem, TreeItemIndex } from 'react-complex-tree'

export class TreeFavorite implements ITreeEntry, TreeItem<TreeFavorite> {
    index = '#favorites'
    get entry(): Promise<TreeItem<TreeFavorite>> { return Promise.resolve(this) } // prettier-ignore
    get data(): TreeFavorite { return this } // prettier-ignore
    isFolder = true
    icon = (<span className='material-symbols-outlined text-yellow-500'>star</span>)
    name = 'Favorites'
    constructor(public st: STATE) {}
    get children(): TreeItemIndex[] {
        return this.st.library.allFavorites.map((app) => `favorite#${app.appPath}`)
    }
}
