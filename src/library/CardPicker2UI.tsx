import type { CardFile } from 'src/library/CardFile'
import type { Deck } from './Deck'

import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { CreateDeckBtnUI } from 'src/front/ui/layout/GithubAppBarInputUI'
import { useSt } from '../front/FrontStateCtx'
import { DeckHeaderUI } from './DeckHeaderUI'

export const ActionPicker2UI = observer(function ActionPicker2UI_(p: {}) {
    const st = useSt()
    const tb = st.library
    return (
        <>
            <CreateDeckBtnUI />
            {/* FAVORITES */}
            {tb.allFavorites.length && (
                <div
                    tw='cursor-pointer items-center gap-1  hover:bg-gray-800 p-0.5 flex justify-between'
                    onClick={() => (tb.favoritesFolded = !tb.favoritesFolded)}
                >
                    <div>Favorite Cards</div>
                    <div>{tb.favoritesFolded ? '▸' : '▿'}</div>
                </div>
            )}
            {tb.favoritesFolded ? null : tb.allFavorites.map((af) => <ActionEntryUI key={af.relPath} af={af} />)}
            {/* INSTALLED */}
            <div tw='flex flex-col'>
                {tb.packsSorted.map((pack) => (
                    <ActionPackUI key={pack.folderRel} pack={pack} />
                ))}
            </div>
        </>
    )
})

export const ActionPackUI = observer(function ActionPackUI_(p: { pack: Deck }) {
    const pack = p.pack
    return (
        <div tw='my-0.5 flex-grow' key={pack.folderRel}>
            <DeckHeaderUI pack={pack} />
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
export const ActionEntryUI = observer(function ActionEntryUI_(p: { af: CardFile }) {
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

export const ActionFavoriteBtnUI = observer(function ActionFavoriteBtnUI_(p: { af: CardFile }) {
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
