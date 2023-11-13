import type { CardFile } from 'src/cards/CardFile'
import type { Deck } from './Deck'

import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { useSt } from '../state/stateContext'
import { DeckHeaderUI } from './DeckHeaderUI'
import { CardIllustrationUI } from './fancycard/CardIllustrationUI'

export const ActionPackUI = observer(function ActionPackUI_(p: { deck: Deck }) {
    const deck: Deck = p.deck
    return (
        <div tw='my-0.5 flex-grow' key={deck.folderRel}>
            <DeckHeaderUI deck={deck} />
            {deck.folded ? null : (
                <div tw='flex flex-col gap-0.5'>
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
            tw='hover:bg-gray-900 flex gap-2 cursor-pointer'
            // style={{ borderTop: '1px solid #161616' }}
            key={card.absPath}
            onClick={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
                const actionPath = card.relPath
                st.layout.addCard(actionPath)
            }}
        >
            <div tw='pl-3'>
                <ActionFavoriteBtnUI card={card} />
            </div>
            <CardIllustrationUI card={card} size={'2rem'} />
            <div tw='overflow-hidden whitespace-nowrap overflow-ellipsis'>{card.displayName}</div>
        </div>
    )
})

export const ActionFavoriteBtnUI = observer(function ActionFavoriteBtnUI_(p: { card: CardFile }) {
    const af = p.card
    return (
        <Fragment>
            {af.isFavorite ? (
                <span
                    onClick={(ev) => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        af.setFavorite(false)
                    }}
                    //
                    style={{ fontSize: '1.5rem' }}
                    className='material-symbols-outlined text-yellow-500'
                >
                    star
                </span>
            ) : (
                <span
                    onClick={(ev) => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        af.setFavorite(true)
                    }}
                    style={{ fontSize: '1.5rem' }}
                    tw='hover:text-yellow-500 text-gray-500'
                    className='material-symbols-outlined'
                >
                    star
                </span>
            )}
        </Fragment>
    )
})
