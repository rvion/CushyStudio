// import type { LibraryFile } from 'src/cards/LibraryFile'
// import type { Package } from '../../cards/Pkg'

import { observer } from 'mobx-react-lite'

// import { FoldIconUI } from 'src/cards/FoldIconUI'
import { SQLITE_false, SQLITE_true } from 'src/db/SQLITE_boolean'
// import { AppIllustrationUI } from '../../cards/fancycard/AppIllustrationUI'
// import { useSt } from '../../state/stateContext'
// import { AppEntryStyle } from './AppListStyles'
// import { DraftEntryUI } from './DraftEntryUI'
import { CushyAppL } from 'src/models/CushyApp'
import { DraftL } from 'src/models/Draft'

// import { PkgHeaderUI } from './PkgHeaderUI'

// export const PkgUI = observer(function ActionPackUI_(p: { deck: Package }) {
//     const pkg: Package = p.deck

//     return (
//         <div tw='flex-grow' key={pkg.folderRel}>
//             <PkgHeaderUI pkg={pkg} />
//             {pkg.folded ? null : (
//                 <div tw='flex flex-col gap-0.5'>
//                     {pkg.files.map((af) => (
//                         <AppEntryUI key={af.relPath} app={af} />
//                     ))}
//                 </div>
//             )}
//         </div>
//     )
// })

// export const AppEntryInvalidUI = observer(function AppEntryInvalidUI_(p: { appPath: RelativePath }) {
//     const st = useSt()
//     return (
//         <div tw={[AppEntryStyle, 'flex gap-2 cursor-pointer']}>
//             <div tw='pl-3'>
//                 <span
//                     onClick={(ev) => {
//                         ev.preventDefault()
//                         ev.stopPropagation()
//                         st.library.removeFavoriteByPath(p.appPath)
//                         // app.setFavorite(false)
//                     }}
//                     //
//                     // style={{ fontSize: p.size }}
//                     className='material-symbols-outlined text-red-500'
//                 >
//                     star
//                 </span>
//             </div>
//             <RevealUI>
//                 <div tw='overflow-hidden italic opacity-50 hover:opacity-100 text-red-500 whitespace-nowrap overflow-ellipsis'>
//                     {p.appPath}
//                 </div>
//                 <div>App not found</div>
//             </RevealUI>
//         </div>
//     )
// })
// export const AppEntryUI = observer(function AppEntryUI_(p: { app: LibraryFile }) {
//     const st = useSt()
//     const app = p.app
//     return (
//         <div>
//             <div
//                 tw={[AppEntryStyle, 'flex gap-2 items-center cursor-pointer ml-1']}
//                 onClick={(ev) => {
//                     ev.preventDefault()
//                     ev.stopPropagation()
//                     const actionPath = app.relPath
//                     st.layout.openAppInMainPanel(actionPath)
//                     // st.layout.openAppInNewPanel(actionPath)
//                 }}
//             >
//                 <AppIllustrationUI app={app} size='1.5rem' />
//                 <div tw='text-base-content flex-grow single-line-ellipsis'>{app.displayName}</div>
//                 <AppFavoriteBtnUI app={app} size='1rem' />
//                 <FoldIconUI />
//             </div>
//             {app.drafts.map((draft) => (
//                 <DraftEntryUI key={draft.id} draft={draft} />
//             ))}
//         </div>
//     )
// })

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
                'hover:text-yellow-500 text-gray-500',
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
