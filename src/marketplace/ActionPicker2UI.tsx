import type { ActionFile } from 'src/marketplace/ActionFile'
import type { ActionPack } from './ActionPack'

import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { useSt } from '../front/FrontStateCtx'
import { ActionPackStatusUI } from './ActionPackStatusUI'
import { ActionPackStarsUI } from './ActionPackStarsUI'

export const ActionPicker2UI = observer(function ActionPicker2UI_(p: {}) {
    const st = useSt()
    const tb = st.toolbox
    return (
        <>
            {/* FAVORITES */}
            {tb.allFavorites.map((af) => (
                <ActionEntryUI key={af.relPath} af={af} />
            ))}
            {/* INSTALLED */}
            <div tw='flex flex-col'>
                {tb.packsSorted.map((pack) => (
                    <ActionPackUI key={pack.folderRel} pack={pack} />
                ))}
            </div>
        </>
    )
})

export const ActionPackUI = observer(function ActionPackUI_(p: { pack: ActionPack }) {
    const pack = p.pack
    return (
        <div tw='m-2 flex-grow' key={pack.folderRel}>
            <ActionPackHeaderUI pack={pack} />
            {pack.folded ? null : (
                <div>
                    {pack.actions.map((af) => (
                        <ActionEntryUI key={af.relPath} af={af} />
                    ))}
                </div>
            )}
        </div>
    )
})
export const ActionEntryUI = observer(function ActionEntryUI_(p: { af: ActionFile }) {
    const st = useSt()
    const af = p.af
    const pack = af.pack
    return (
        <div
            //
            tw='pl-4 hover:bg-gray-900 flex gap-2 cursor-pointer'
            style={{ borderTop: '1px solid #161616' }}
            key={af.absPath}
            onClick={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
                const actionPath = af.relPath
                st.layout.addAction(actionPath)
            }}
        >
            {/* <span className='material-symbols-outlined'>keyboard_arrow_right</span> */}
            <img style={{ width: '1rem', height: '1rem' }} src={pack?.logo ?? ''}></img>
            <div>{af.namePretty}</div>
            <div tw='ml-auto'>
                <ActionFavoriteBtnUI af={af} />
            </div>
        </div>
    )
})

export const ActionPackHeaderUI = observer(function ActionPackHeaderUI_(p: { pack: ActionPack }) {
    const pack = p.pack
    return (
        <div
            tw='cursor-pointer flex items-center gap-1 bg-gray-800 hover:bg-gray-800 p-0.5'
            onClick={() => (pack.folded = !pack.folded)}
        >
            <img tw='rounded' style={{ height: `2rem` }} src={pack.logo} alt='pack logo' />
            <div tw='flex-grow'>
                <div tw='flex'>
                    <div>
                        <div tw='font-bold text-sm'>{pack.name}</div>
                        <div tw='text-sm text-gray-400 flex justify-between w-full'>by {pack.githubUserName}</div>
                    </div>
                    <div className='flex-grow'></div>
                    <div>
                        {pack.BUILT_IN ? <div tw='text-gray-600'>built-in</div> : <ActionPackStatusUI pack={pack} />}
                        <ActionPackStarsUI tw='float-right' pack={pack} />
                    </div>
                </div>
            </div>
        </div>
    )
})

export const ActionFavoriteBtnUI = observer(function ActionFavoriteBtnUI_(p: { af: ActionFile }) {
    const af = p.af
    return (
        <Fragment>
            {af.isFavorite ? (
                <div
                    onClick={(ev) => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        af.setFavorite(false)
                    }}
                >
                    <span style={{ color: '#562152' }} className='material-symbols-outlined'>
                        favorite
                    </span>
                </div>
            ) : (
                <div
                    onClick={(ev) => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        af.setFavorite(true)
                    }}
                >
                    <span tw='text-gray-800 hover:text-red-500' className='material-symbols-outlined'>
                        favorite_border
                    </span>
                </div>
            )}
        </Fragment>
    )
})
