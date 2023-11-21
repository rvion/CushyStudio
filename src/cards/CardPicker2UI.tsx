import type { CardFile } from 'src/cards/CardFile'
import type { Package } from './Deck'

import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { useSt } from '../state/stateContext'
import { DeckHeaderUI } from './DeckHeaderUI'
import { CardIllustrationUI } from './fancycard/AppIllustrationUI'

export const ActionPackUI = observer(function ActionPackUI_(p: { deck: Package }) {
    const deck: Package = p.deck
    return (
        <div tw='flex-grow' key={deck.folderRel}>
            <DeckHeaderUI deck={deck} />
            {deck.folded ? null : (
                <div tw='flex flex-col gap-0.5'>
                    {deck.apps.map((af) => (
                        <AppEntryUI key={af.relPath} card={af} />
                    ))}
                </div>
            )}
        </div>
    )
})

export const AppEntryUI = observer(function ActionEntryUI_(p: { card: CardFile }) {
    const st = useSt()
    const card = p.card
    return (
        <div
            //
            tw='hover:bg-base-200 flex gap-2 cursor-pointer'
            key={card.absPath}
            onClick={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
                const actionPath = card.relPath
                st.layout.addCard(actionPath)
            }}
        >
            <div tw='pl-3'>
                <ActionFavoriteBtnUI card={card} size='1.3rem' />
            </div>
            <CardIllustrationUI card={card} size='1.5rem' />
            <div tw='overflow-hidden text-base-content whitespace-nowrap overflow-ellipsis'>{card.displayName}</div>
        </div>
    )
})

export const ActionFavoriteBtnUI = observer(function ActionFavoriteBtnUI_(p: { size: string; card: CardFile }) {
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
                    style={{ fontSize: p.size }}
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
                    style={{ fontSize: p.size }}
                    tw='hover:text-yellow-500 text-gray-500'
                    className='material-symbols-outlined'
                >
                    star
                </span>
            )}
        </Fragment>
    )
})
