import { STATE } from 'src/state/state'
import { ITreeEntry } from '../TreeEntry'

export class TreeFavorite implements ITreeEntry {
    id = '#favorites'
    isFolder = true
    icon = (<span className='material-symbols-outlined text-yellow-500'>star</span>)
    name = 'Favorites'
    constructor(public st: STATE) {}
    children = (): string[] => {
        return this.st.library.allFavorites.map((appID) => `favorite#${appID}`)
    }
}
