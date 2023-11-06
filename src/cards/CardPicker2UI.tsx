import type { CardFile } from 'src/cards/CardFile'
import type { Deck } from './Deck'

import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { CreateDeckBtnUI } from 'src/widgets/ui/layout/GithubAppBarInputUI'
import { useSt } from '../widgets/FrontStateCtx'
import { DeckHeaderUI } from './DeckHeaderUI'

export const ActionPicker2UI = observer(function ActionPicker2UI_(p: {}) {
    const st = useSt()
    const tb = st.library
    return (
        <>
            <CreateDeckBtnUI />
            {/* FAVORITES */}
            {tb.allFavorites.length ? (
                <div
                    tw='cursor-pointer items-center gap-1  hover:bg-gray-800 p-0.5 flex justify-between'
                    onClick={() => (tb.favoritesFolded = !tb.favoritesFolded)}
                >
                    <div>Favorite Cards</div>
                    <div>{tb.favoritesFolded ? '▸' : '▿'}</div>
                </div>
            ) : null}
            {tb.favoritesFolded ? null : tb.allFavorites.map((af) => <ActionEntryUI key={af.relPath} card={af} />)}
            {/* INSTALLED */}
            <div tw='flex flex-col'>
                {tb.decksSorted.map((pack) => (
                    <ActionPackUI key={pack.folderRel} deck={pack} />
                ))}
            </div>
        </>
    )
})

export const ActionPackUI = observer(function ActionPackUI_(p: { deck: Deck }) {
    const deck: Deck = p.deck
    return (
        <div tw='my-0.5 flex-grow' key={deck.folderRel}>
            <DeckHeaderUI deck={deck} />
            {deck.folded ? null : (
                <div>
                    {deck.cards.map((af) => (
                        <ActionEntryUI key={af.relPath} card={af} />
                    ))}
                </div>
            )}
        </div>
    )
})
export const ActionEntryUI = observer(function ActionEntryUI_(p: { card: CardFile }) {
    const st = useSt()
    const card = p.card
    const pack = card.deck
    return (
        <div
            //
            tw='pl-4 hover:bg-gray-900 flex gap-2 cursor-pointer'
            style={{ borderTop: '1px solid #161616' }}
            key={card.absPath}
            onClick={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
                const actionPath = card.relPath
                st.layout.addCard(actionPath)
            }}
        >
            {/* <span className='material-symbols-outlined'>keyboard_arrow_right</span> */}
            <img style={{ width: '1rem', height: '1rem' }} src={pack?.logo ?? ''}></img>
            <div>{card.displayName}</div>
            <div tw='ml-auto'>
                <ActionFavoriteBtnUI af={card} />
            </div>
        </div>
    )
})

export const ActionFavoriteBtnUI = observer(function ActionFavoriteBtnUI_(p: { af: CardFile }) {
    const af = p.af
    return (
        <Fragment>
            {af.isFavorite ? (
                <div
                    onClick={(ev) => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        af.setFavorite(false)
                    }}
                >
                    <span style={{ color: '#562152' }} className='material-symbols-outlined'>
                        favorite
                    </span>
                </div>
            ) : (
                <div
                    onClick={(ev) => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        af.setFavorite(true)
                    }}
                >
                    <span tw='text-gray-800 hover:text-red-500' className='material-symbols-outlined'>
                        favorite_border
                    </span>
                </div>
            )}
        </Fragment>
    )
})
