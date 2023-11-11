import { observer } from 'mobx-react-lite'
import { CardFile } from '../CardFile'

export const CardIllustrationUI = observer(function CardIllustrationUI_(p: {
    onClick?: () => void
    card: CardFile
    size: string
}) {
    return (
        <img
            loading='lazy'
            tw={['rounded m-2', p.onClick ? 'cursor-pointer' : null]}
            style={{ width: p.size, height: p.size, objectFit: 'contain' }}
            src={p.card.illustrationPathWithFileProtocol}
            alt='card illustration'
            onClick={p.onClick}
        />
    )
})
