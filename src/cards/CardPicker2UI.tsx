import type { LibraryFile } from 'src/cards/CardFile'
import type { Package } from './Pkg'

import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { useSt } from '../state/stateContext'
import { PkgHeaderUI } from './PkgHeaderUI'
import { AppIllustrationUI } from './fancycard/AppIllustrationUI'
import { AppPath } from './CardPath'
import { RevealUI } from 'src/rsuite/RevealUI'

export const PkgUI = observer(function ActionPackUI_(p: { deck: Package }) {
    const pkg: Package = p.deck

    return (
        <div tw='flex-grow' key={pkg.folderRel}>
            <PkgHeaderUI pkg={pkg} />
            {pkg.folded ? null : (
                <div tw='flex flex-col gap-0.5'>
                    {pkg.apps.map((af) => (
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
export const AppEntryUI = observer(function AppEntryUI_(p: { app: LibraryFile }) {
    const st = useSt()
    const app = p.app
    return (
        <div
            tw='hover:bg-base-200 flex gap-2 cursor-pointer'
            onClick={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
                const actionPath = app.relPath
                st.layout.openAppInMainPanel(actionPath)
                // st.layout.openAppInNewPanel(actionPath)
            }}
        >
            <div tw='pl'>
                <ActionFavoriteBtnUI app={app} size='1.3rem' />
            </div>
            <AppIllustrationUI card={app} size='1.5rem' />
            <div tw='overflow-hidden text-base-content whitespace-nowrap overflow-ellipsis'>{app.displayName}</div>
        </div>
    )
})

export const ActionFavoriteBtnUI = observer(function ActionFavoriteBtnUI_(p: { size: string; app: LibraryFile }) {
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
                    className='material-symbols-outlined text-yellow-500 hover:text-red-500'
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
