import { observer } from 'mobx-react-lite'
import { CushyAppL } from 'src/models/CushyApp'
import { DraftL } from 'src/models/Draft'
import { AppIllustrationUI } from './AppIllustrationUI'

export const DraftIllustrationUI = observer(function DraftIllustrationUI_(p: {
    className?: string
    onClick?: () => void
    draft: Maybe<DraftL>
    size: string
}) {
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
        return <AppIllustrationUI app={draft.app} size={p.size} />
    }

    // 3. show illustration on top
    return (
        <div className='relative'>
            <div tw='absolute opacity-0 hover:opacity-100' style={{ transition: 'opacity 0.2s' }}>
                <AppIllustrationUI app={draft.app} size={p.size} />
            </div>
            <img
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
