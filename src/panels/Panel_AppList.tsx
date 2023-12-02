import { observer } from 'mobx-react-lite'
import SortableList, { SortableItem } from 'react-easy-sort'
import { AppEntryInvalidUI, AppEntryUI, PkgUI } from '../cards/CardPicker2UI'
import { useSt } from '../state/stateContext'
import { DraftEntryUI } from './Panel_FullScreenLibrary'
import { PkgHeaderStyle } from 'src/cards/AppListStyles'

export const Panel_AppList = observer(function Panel_AppList_(p: {}) {
    const st = useSt()
    const library = st.library
    return (
        <>
            <div tw='flex w-full'>
                <button tw='btn btn-sm btn-active flex-grow' onClick={() => st.toggleFullLibrary()}>
                    <span className='material-symbols-outlined'>view_list</span>
                    Library
                </button>
                <button tw='btn btn-sm' onClick={() => library.decksSorted.forEach((d) => (d.folded = true))}>
                    <span className='material-symbols-outlined'>minimize</span>
                </button>
            </div>

            {/* DRAFTS */}
            {st.allOpenDrafts.items.length > 0 ? (
                <div
                    tw={[
                        //
                        PkgHeaderStyle,
                        'cursor-pointer items-center gap-1 flex justify-between',
                    ]}
                    onClick={() => (st.draftsFolded = !st.draftsFolded)}
                >
                    <div>
                        <span
                            //
                            style={{ fontSize: '2rem' }}
                            tw='text-primary'
                            className='material-symbols-outlined'
                        >
                            dynamic_form
                        </span>
                    </div>
                    <div tw='flex-1 text-base-content font-bold'>Drafts</div>
                    <div>{st.draftsFolded ? '▸' : '▿'}</div>
                </div>
            ) : null}
            {st.draftsFolded ? null : ( //
                <div>
                    {st.allOpenDrafts.items.map((draft) => {
                        return <DraftEntryUI key={draft.id} draft={draft} />
                    })}
                </div>
            )}

            {/* FAVORITES */}
            {library.allFavorites.length > 0 ? (
                <div
                    tw={[
                        //
                        PkgHeaderStyle,
                        'cursor-pointer items-center gap-1 flex justify-between',
                    ]}
                    onClick={() => (library.favoritesFolded = !library.favoritesFolded)}
                >
                    <div>
                        <span
                            //
                            style={{ fontSize: '2rem' }}
                            tw='text-yellow-500'
                            className='material-symbols-outlined'
                        >
                            star
                        </span>
                    </div>
                    <div tw='flex-1 text-base-content font-bold'>Favorites</div>
                    <div>{library.favoritesFolded ? '▸' : '▿'}</div>
                </div>
            ) : null}
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
