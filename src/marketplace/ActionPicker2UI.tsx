import { observer } from 'mobx-react-lite'
import { ActionFile } from 'src/marketplace/ActionFile'
import { useSt } from '../front/FrontStateCtx'
import { ActionPack } from './ActionPack'
import { ActionPackStatusUI } from './ActionPackStatusUI'
import { Fragment } from 'react'

export const ActionPicker2UI = observer(function ActionPicker2UI_(p: {}) {
    const st = useSt()
    const tb = st.toolbox
    return (
        <>
            {/* FAVORITES */}
            <div tw='p-1 font-bold bg-yellow-900'>Favorites</div>
            {tb.allFavorites.map((af) => (
                <ActionEntryUI key={af.relPath} af={af} />
            ))}
            {/* INSTALLED */}
            <div tw='p-1 font-bold bg-blue-900'>Installed</div>
            <div tw='flex flex-wrap'>
                {tb.packsSorted.map((pack) => {
                    return (
                        <div tw='m-2 flex-grow cursor-pointer' key={pack.folderRel}>
                            <ActionPackHeaderUI pack={pack} />
                            <div>
                                {pack.actions.map((af) => (
                                    <ActionEntryUI key={af.relPath} af={af} />
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
})

export const ActionEntryUI = observer(function ActionEntryUI_(p: { af: ActionFile }) {
    const st = useSt()
    const af = p.af
    const pack = af.pack
    return (
        <div
            //
            tw='pl-4 hover:bg-gray-900 flex gap-2'
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
        <div tw='flex items-center gap-1 bg-gray-800 hover:bg-gray-800 p-0.5'>
            <img tw='rounded' style={{ height: `2rem` }} src={pack.logo} alt='' />
            <div tw='flex-grow'>
                <div tw='flex'>
                    <div>
                        <div tw='font-bold text-sm'>{pack.name}</div>
                        <div tw='text-sm'>by {pack.githubUserName}</div>
                    </div>
                    <div className='flex-grow'></div>
                    {/* {pack.score} */}
                    {pack.BUILT_IN ? <div tw='text-gray-600'>built-in</div> : <ActionPackStatusUI pack={pack} />}
                </div>
                {/* <GithubUserUI
                    textClassName='text-sm'
                    size='1.3rem'
                    tw='ml-auto'
                    username={pack.githubUserName}
                    showName='after'
                /> */}
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
                    <span tw='text-yellow-500' className='material-symbols-outlined'>
                        star
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
                    <span tw='text-gray-700 hover:text-yellow-500' className='material-symbols-outlined'>
                        star
                    </span>
                </div>
            )}
        </Fragment>
    )
})
