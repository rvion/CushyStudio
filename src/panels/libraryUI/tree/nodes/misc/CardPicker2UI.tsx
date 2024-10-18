import type { CushyAppL } from '../../../../../models/CushyApp'
import type { DraftL } from '../../../../../models/Draft'

import { observer } from 'mobx-react-lite'

export const AppFavoriteBtnUI = observer(function AppFavoriteBtnUI_(p: {
    //
    size?: string
    app: CushyAppL
}) {
    return (
        <AppFavoriteBtnCustomUI //
            get={() => p.app.isFavorite}
            set={(v) => p.app.setFavorite(v)}
            size={p.size}
        />
    )
})

export const DraftFavoriteBtnUI = observer(function DraftFavoriteBtnUI_(p: {
    //
    size?: string
    draft: DraftL
}) {
    return (
        <AppFavoriteBtnCustomUI //
            get={() => p.draft.isFavorite}
            set={(v) => p.draft.setFavorite(v)}
            size={p.size}
        />
    )
})

export const AppFavoriteBtnCustomUI = observer(function AppFavoriteBtnCustomUI_(p: {
    //
    size?: string
    get: () => boolean
    set: (v: boolean) => void
}) {
    const size = p.size ?? '1.3rem'
    const isFavorite = p.get()
    if (isFavorite)
        return (
            <span
                style={{ fontSize: size }}
                tw={[
                    //
                    'material-symbols-outlined',
                    'cursor-pointer',
                    'text-yellow-500 hover:text-red-500',
                ]}
                onClick={(ev) => {
                    ev.preventDefault()
                    ev.stopPropagation()
                    p.set(false)
                }}
                //
            >
                star
            </span>
        )
    return (
        <span
            tw={[
                //
                'material-symbols-outlined',
                'cursor-pointer',
                'text-gray-500 hover:text-yellow-500',
            ]}
            style={{ fontSize: size }}
            onClick={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
                p.set(true)
            }}
        >
            star
        </span>
    )
})
