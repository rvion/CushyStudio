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
    // const importedFrom
    // prettier-ignore
    const color = (() => {
        const tw='px-1 py-0.5 overflow-hidden text-ellipsis block whitespace-nowrap'
        const maxWidth= st.library.imageSize
        if (card.absPath.endsWith('.ts'))   return <span tw={[tw]} style={{maxWidth, background: '#1976d2'}}>Cushy Action</span>
        if (card.absPath.endsWith('.json')) return <span tw={[tw]} style={{maxWidth, background: '#8e24aa'}}>ComfyUI Workflow JSON</span>
        if (card.absPath.endsWith('.png'))  return <span tw={[tw]} style={{maxWidth, background: '#3949ab'}}>ComfyUI Workflow Image</span>
    })()

    return (
        <div
            onClick={p.card.openLastDraftAsCurrent}
            style={{
                background: '#2d2d2d',
                border: '1px solid #343434',
                // width: '11rem',
            }}
            tw={[
                //
                'p-0.5',
                `card STYLE_${p.style}`,
                p.active ? 'active' : 'not-active',
                'cursor-pointer',
            ]}
        >
            <div tw='flex items-start flex-grow' style={{ fontSize: '1rem' }}>
                {st.library.showFavorites ? <ActionFavoriteBtnUI card={card} size={'1.5rem'} /> : null}
                <div style={{ width: st.library.imageSize, height: '3rem' }} tw='overflow-hidden overflow-ellipsis pt-1'>
                    {card.displayName}
                </div>
            </div>

            <div tw='flex'>
                <CardIllustrationUI card={card} size={st.library.imageSize} />
                {st.library.showDescription ? (
                    <div tw='flex-grow flex flex-col ml-1 w-44'>
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
                ) : null}
            </div>
            {color}
        </div>
    )
})
