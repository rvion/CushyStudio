import type { CardFile } from 'src/cards/CardFile'
import type { Package } from './Deck'

import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { useSt } from '../state/stateContext'
import { DeckHeaderUI } from './DeckHeaderUI'
import { CardIllustrationUI } from './fancycard/AppIllustrationUI'
import { AppPath } from './CardPath'
import { RevealUI } from 'src/rsuite/RevealUI'

export const ActionPackUI = observer(function ActionPackUI_(p: { deck: Package }) {
    const deck: Package = p.deck
    return (
        <div tw='flex-grow' key={deck.folderRel}>
            <DeckHeaderUI deck={deck} />
            {deck.folded ? null : (
                <div tw='flex flex-col gap-0.5'>
                    {deck.apps.map((af) => (
                        <AppEntryUI key={af.relPath} app={af} />
                    ))}
                </div>
            )}
        </div>
    )
})

export const AppEntryInvalidUI = observer(function AppEntryInvalidUI_(p: { appPath: AppPath }) {
    const st = useSt()
    return (
        <div tw='hover:bg-base-200 flex gap-2 cursor-pointer'>
            <div tw='pl-3'>
                <span
                    onClick={(ev) => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        st.library.removeFavoriteByPath(p.appPath)
                        // app.setFavorite(false)
                    }}
                    //
                    // style={{ fontSize: p.size }}
                    className='material-symbols-outlined text-red-500'
                >
                    star
                </span>
            </div>
            <RevealUI>
                <div tw='overflow-hidden italic opacity-50 hover:opacity-100 text-red-500 whitespace-nowrap overflow-ellipsis'>
                    {p.appPath}
                </div>
                <div>App not found</div>
            </RevealUI>
        </div>
    )
})
export const AppEntryUI = observer(function AppEntryUI_(p: { app: CardFile }) {
    const st = useSt()
    const app = p.app
    return (
        <div
            tw='hover:bg-base-200 flex gap-2 cursor-pointer'
            onClick={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
                const actionPath = app.relPath
                st.layout.addCard(actionPath)
            }}
        >
            <div tw='pl-3'>
                <ActionFavoriteBtnUI app={app} size='1.3rem' />
            </div>
            <CardIllustrationUI card={app} size='1.5rem' />
            <div tw='overflow-hidden text-base-content whitespace-nowrap overflow-ellipsis'>{app.displayName}</div>
        </div>
    )
})

export const ActionFavoriteBtnUI = observer(function ActionFavoriteBtnUI_(p: { size: string; app: CardFile }) {
    const app = p.app
    return (
        <Fragment>
            {app.isFavorite ? (
                <span
                    onClick={(ev) => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        app.setFavorite(false)
                    }}
                    //
                    style={{ fontSize: p.size }}
                    className='material-symbols-outlined text-yellow-500'
                >
                    star
                </span>
            ) : (
                <span
                    onClick={(ev) => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        app.setFavorite(true)
                    }}
                    style={{ fontSize: p.size }}
                    tw='hover:text-yellow-500 text-gray-500'
                    className='material-symbols-outlined'
                >
                    star
                </span>
            )}
        </Fragment>
    )
})
