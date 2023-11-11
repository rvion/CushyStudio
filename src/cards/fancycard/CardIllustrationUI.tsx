import { observer } from 'mobx-react-lite'
import React from 'react'
import { useSt } from 'src/state/stateContext'
import { CardFile } from '../CardFile'

export const CardIllustrationUI = observer(function CardIllustrationUI_(p: { card: CardFile; size: string }) {
    const st = useSt()
    return (
        <img
            loading='lazy'
            tw='rounded m-2 '
            style={{ width: p.size, height: p.size, objectFit: 'contain' }}
            src={p.card.illustrationPathWithFileProtocol}
            alt='card illustration'
            onClick={() => {
                st.currentDraft = p.card.getLastDraft()
            }}
        />
    )
})
