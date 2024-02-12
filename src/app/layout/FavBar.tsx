import type { CushyAppL } from 'src/models/CushyApp'

import { observer } from 'mobx-react-lite'
import { AppIllustrationUI } from 'src/cards/fancycard/AppIllustrationUI'
import { DraftIllustrationUI } from 'src/cards/fancycard/DraftIllustration'
import { PanelHeaderSmallUI } from 'src/panels/PanelHeader'
import { GalleryControlsUI } from 'src/panels/Panel_Gallery'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { useSt } from 'src/state/stateContext'

export const FavBarUI = observer(function FavBarUI_(p: {
    //
    direction?: 'row' | 'column'
}) {
    const st = useSt()
    return (
        <div tw='flex gap-1' style={{ flexDirection: p.direction }}>
            <PanelHeaderSmallUI>
                <GalleryControlsUI />
            </PanelHeaderSmallUI>

            <div tw='italic text-sm text-center'>fav apps</div>
            {st.favoriteApps.map((app) => (
                <RevealUI trigger='hover' placement='rightStart'>
                    <AppIllustrationUI size='4rem' app={app} />
                    <AppDraftsQuickListUI app={app} />
                </RevealUI>
            ))}
            <hr />
            <div tw='italic text-sm text-center'>fav drafts</div>
            {st.favoriteDrafts.map((draft) => (
                <RevealUI trigger='hover' placement='rightStart'>
                    <DraftIllustrationUI onClick={() => draft.openOrFocusTab()} size='4rem' draft={draft} />
                    <div>
                        <div tw='text-xs'>{draft.app.name}</div>
                        <div tw='text-xs'>{draft.data.title}</div>
                    </div>
                </RevealUI>
            ))}
        </div>
    )
})

export const AppDraftsQuickListUI = observer(function AppDraftsQuickListUI_(p: { app: CushyAppL }) {
    const app = p.app
    return (
        <div>
            <div tw='flex'>
                <div tw='btn btn-sm w-full' onClick={() => app.setFavorite(!app.isFavorite)}>
                    <span tw={[app.isFavorite ? 'text-yellow-500' : null]} className='material-symbols-outlined'>
                        star
                    </span>
                    <div>{app.name}</div>
                </div>
            </div>
            <div tw='grid grid-cols-3'>
                {p.app.drafts.map((draft) => (
                    <div key={draft.id}>
                        <DraftIllustrationUI onClick={() => draft.openOrFocusTab()} size='4rem' draft={draft} />
                    </div>
                ))}
            </div>
        </div>
    )
})
