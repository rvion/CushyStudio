import { observer } from 'mobx-react-lite'
import { LibraryFile } from '../CardFile'

export const AppIllustrationUI = observer(function AppIllustrationUI_(p: {
    className?: string
    onClick?: () => void
    card: LibraryFile
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
            className={p.className}
            loading='lazy'
            tw={[
                //
                'rounded',
                p.onClick ? 'cursor-pointer' : null,
                // 'animate-in zoom-in duration-100',
            ]}
            style={{ width: p.size, height: p.size, objectFit: 'contain', imageRendering: 'pixelated' }}
            src={p.card.illustrationPathWithFileProtocol}
            alt='card illustration'
            onClick={p.onClick}
        />
    )
})
