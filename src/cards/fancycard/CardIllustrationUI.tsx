import { observer } from 'mobx-react-lite'
import { CardFile } from '../CardFile'

export const CardIllustrationUI = observer(function CardIllustrationUI_(p: {
    onClick?: () => void
    card: CardFile
    size: string
}) {
    const x = p.card.illustrationPathWithFileProtocol
    // return null
    if (x.startsWith('<svg'))
        return (
            <div
                //
                style={{ height: p.size }}
                dangerouslySetInnerHTML={{ __html: x }}
            ></div>
        )

    return (
        <img
            loading='lazy'
            tw={['rounded', p.onClick ? 'cursor-pointer' : null]}
            style={{ width: p.size, height: p.size, objectFit: 'contain', imageRendering: 'pixelated' }}
            src={p.card.illustrationPathWithFileProtocol}
            alt='card illustration'
            onClick={p.onClick}
        />
    )
})
