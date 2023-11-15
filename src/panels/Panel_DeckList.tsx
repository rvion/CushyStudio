import { observer } from 'mobx-react-lite'
import { AppEntryUI, ActionPackUI } from '../cards/CardPicker2UI'
import { useSt } from '../state/stateContext'

export const Panel_DeckList = observer(function ActionPicker2UI_(p: {}) {
    const st = useSt()
    const library = st.library
    return (
        <>
            {/* FAVORITES */}
            {library.allFavorites.length ? (
                <div
                    tw=' bg-base-200 cursor-pointer items-center gap-1  hover:bg-base-300  flex justify-between'
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
            {library.favoritesFolded ? null : library.allFavorites.map((af) => <AppEntryUI key={af.relPath} card={af} />)}
            {/* INSTALLED */}
            <div tw='flex flex-col'>
                {library.decksSorted.map((pack) => (
                    <ActionPackUI key={pack.folderRel} deck={pack} />
                ))}
            </div>
        </>
    )
})
