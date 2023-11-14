import { observer } from 'mobx-react-lite'
import { ActionEntryUI, ActionPackUI } from '../cards/CardPicker2UI'
import { useSt } from '../state/stateContext'

export const Panel_DeckList = observer(function ActionPicker2UI_(p: {}) {
    const st = useSt()
    const library = st.library
    return (
        <>
            {/* FAVORITES */}
            {library.allFavorites.length ? (
                <div
                    tw=' bg-gray-800 cursor-pointer items-center gap-1  hover:bg-gray-800  flex justify-between'
                    onClick={() => (library.favoritesFolded = !library.favoritesFolded)}
                >
                    <div>
                        <span style={{ fontSize: '2rem' }} tw='text-yellow-500' className='material-symbols-outlined'>
                            star
                        </span>
                    </div>
                    <div tw='flex-grow'>
                        <div>Favorites</div>
                    </div>
                    <div>{library.favoritesFolded ? '▸' : '▿'}</div>
                </div>
            ) : null}
            {library.favoritesFolded ? null : library.allFavorites.map((af) => <ActionEntryUI key={af.relPath} card={af} />)}
            {/* INSTALLED */}
            <div tw='flex flex-col'>
                {library.decksSorted.map((pack) => (
                    <ActionPackUI key={pack.folderRel} deck={pack} />
                ))}
            </div>
        </>
    )
})
