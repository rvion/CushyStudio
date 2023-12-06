import { observer } from 'mobx-react-lite'
import SortableList, { SortableItem } from 'react-easy-sort'
import { useSt } from '../state/stateContext'
import { AppEntryInvalidUI, AppEntryUI, PkgUI } from './libraryUI/CardPicker2UI'
import { FavoriteHeaderUI } from './libraryUI/FavoriteHeaderUI'
import { LibraryHeaderUI } from './libraryUI/LibraryHeaderUI'

export const Panel_AppList = observer(function Panel_AppList_(p: {}) {
    const st = useSt()
    const library = st.library
    return (
        <>
            <LibraryHeaderUI />
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
            {library.allFavorites.length > 0 ? <FavoriteHeaderUI /> : null}
            {library.favoritesFolded ? null : ( //
                <SortableList onSortEnd={library.moveFavorite} className='list' draggedItemClassName='dragged'>
                    {library.allFavorites.map((fav, ix) => (
                        //
                        <SortableItem key={fav.appPath}>
                            {/* 👇 wrapper div so SortableItem work */}
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
            )}

            {/* INSTALLED */}
            <div tw='flex flex-col'>
                {library.decksSorted.map((pack) => (
                    <PkgUI key={pack.folderRel} deck={pack} />
                ))}
            </div>
        </>
    )
})
