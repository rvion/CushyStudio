import { observer } from 'mobx-react-lite'
import SortableList, { SortableItem } from 'react-easy-sort'
import { useSt } from '../state/stateContext'
import { AppEntryInvalidUI, AppEntryUI, PkgUI } from './libraryUI/CardPicker2UI'
import { DraftEntryUI } from './libraryUI/DraftEntryUI'
import { DraftsHeaderUI } from './libraryUI/DraftsHeaderUI'
import { FavoriteHeaderUI } from './libraryUI/FavoriteHeaderUI'
import { LibraryHeaderUI } from './libraryUI/LibraryHeaderUI'
import { Tree3 } from './libraryUI/tree/tree3'
import { nanoid } from 'nanoid'

export const Panel_AppList = observer(function Panel_AppList_(p: {}) {
    const st = useSt()
    const library = st.library
    return (
        <div tw='flex flex-grow flex-col overflow-auto'>
            <LibraryHeaderUI />
            <Tree3 key={nanoid()} />
            {/* <div tw='flex flex-col'>
                {library.decksSorted.map((pack) => (
                    <PkgUI key={pack.folderRel} deck={pack} />
                ))}
            </div> */}
            {/* DRAFTS */}
            {/* {st.allOpenDrafts.items.length > 0 ? <DraftsHeaderUI /> : null}
            {st.draftsFolded ? null : ( //
                <div tw={['overflow-auto']}>
                    {st.allOpenDrafts.items.map((draft) => {
                        return <DraftEntryUI key={draft.id} draft={draft} />
                    })}
                </div>
            )} */}
            {/* FAVORITES */}
            {/* <hr /> */}
            {/* Favorites */}
            {/* <FavoriteHeaderUI />
            {library.favoritesFolded ? null : (
                <SortableList onSortEnd={library.moveFavorite} className='list' draggedItemClassName='dragged'>
                    {library.allFavorites.map((fav, ix) => (
                        <SortableItem key={fav.appPath}>
                            <div>
                                {fav.app ? ( //
                                    <AppEntryUI key={fav?.appPath} app={fav.app} />
                                ) : (
                                    <AppEntryInvalidUI appPath={fav.appPath} />
                                )}
                            </div>
                        </SortableItem>
                    ))}
                </SortableList>
            )} */}
        </div>
    )
})
