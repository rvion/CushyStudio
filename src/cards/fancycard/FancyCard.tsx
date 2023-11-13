import { observer } from 'mobx-react-lite'

import { Tag } from 'rsuite'
import { CardFile } from '../CardFile'
import { Deck } from '../Deck'

import { ActionFavoriteBtnUI } from '../CardPicker2UI'
import { GithubUserUI } from '../GithubAvatarUI'
import { CardIllustrationUI } from './CardIllustrationUI'
import './FancyCard.css' // Assuming the CSS is written in this file
import { useSt } from 'src/state/stateContext'

export type CardStyle = 'A' | 'B' | 'C' | 'D'

export const FancyCardUI = observer(function FancyCardUI_(p: {
    //
    deck: Deck
    style: CardStyle
    card: CardFile
    active?: boolean
}) {
    const card = p.card
    const st = useSt()
    return (
        <div
            onClick={p.card.openLastDraftAsCurrent}
            style={{ border: '1px solid #494949' }}
            tw={[
                //
                'p-1 w-96',
                `card STYLE_${p.style}`,
                p.active ? 'active' : 'not-active',
                'cursor-pointer',
            ]}
        >
            <div tw='flex items-center font-bold flex-grow text-blue-300' style={{ fontSize: '1rem' }}>
                <ActionFavoriteBtnUI card={card} />
                <div tw='whitespace-nowrap overflow-hidden overflow-ellipsis pt-1'>{card.displayName}</div>
            </div>
            <div tw='flex'>
                <CardIllustrationUI card={card} size='10rem' />
                <div tw='flex-grow flex flex-col ml-1'>
                    <div>
                        {(card.manifest.categories ?? []).map((i, ix) => (
                            <Tag key={ix}>{i}</Tag>
                        ))}
                    </div>
                    <div style={{ height: '5rem' }} tw='m-1 flex-grow text-sm'>
                        {card.description}
                    </div>
                    <GithubUserUI username={card.deck.githubUserName} showName size='1.2rem' tw='text-gray-300' />
                </div>
            </div>
        </div>
    )
})
