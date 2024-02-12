import { observer } from 'mobx-react-lite'
import { CushyAppL } from 'src/models/CushyApp'
import { DraftL } from 'src/models/Draft'
import { AppIllustrationUI } from './AppIllustrationUI'
import { useImageDrop } from 'src/widgets/galleries/dnd'
import { useSt } from 'src/state/stateContext'

export const DraftIllustrationUI = observer(function DraftIllustrationUI_(p: {
    className?: string
    onClick?: () => void
    draft: Maybe<DraftL>
    revealAppIllustrationOnHover?: boolean
    size: string
}) {
    const st = useSt()
    const [dropStyle, dropRef] = useImageDrop(st, (img) => {
        if (p.draft == null) return
        img.useAsDraftIllustration(p.draft)
    })

    // 1. no draft
    const draft = p.draft
    if (draft == null)
        return (
            <div
                //
                tw='bg-error text-error-content'
                style={{ height: p.size }}
            >
                ERROR
            </div>
        )

    // 2. draft with no specific illustration
    if (draft.data.illustration == null) {
        return (
            <div style={dropStyle} ref={dropRef} className='DROP_IMAGE_HANDLER'>
                <AppIllustrationUI app={draft.app} size={p.size} />
            </div>
        )
    }

    // 3. show illustration on top
    return (
        <div style={dropStyle} ref={dropRef} className='relative DROP_IMAGE_HANDLER'>
            {p.revealAppIllustrationOnHover ? ( //
                <div tw='absolute opacity-0 hover:opacity-100' style={{ transition: 'opacity 0.2s' }}>
                    <AppIllustrationUI app={draft.app} size={p.size} />
                </div>
            ) : null}
            <img
                // onError={(ev) => {
                // TODO 2024-01-25 rvion: make it so wiping images doesn't break drafts too much
                // }}
                className={p.className}
                loading='lazy'
                tw={['bg-base-300', 'rounded', p.onClick ? 'cursor-pointer' : null]}
                style={{ width: p.size, height: p.size, objectFit: 'contain', imageRendering: 'pixelated' }}
                src={draft.data.illustration}
                alt='draft illustration'
                onClick={p.onClick}
            />
        </div>
    )
})
