import type { CushyAppL } from 'src/models/CushyApp'

import { observer } from 'mobx-react-lite'
import { AppIllustrationUI } from 'src/cards/fancycard/AppIllustrationUI'
import { DraftIllustrationUI } from 'src/cards/fancycard/DraftIllustration'
import { PanelHeaderSmallUI } from 'src/panels/PanelHeader'
import { GalleryControlsUI } from 'src/panels/Panel_Gallery'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { useSt } from 'src/state/stateContext'
import { useState } from 'react'

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

            <div //Panel Content
                tw='p-2'
            >
                <div tw='italic text-sm text-center'>fav apps</div>
                {st.favoriteApps.map((app) => (
                    <div tw='pt-1'>
                        <RevealUI trigger='hover' placement='rightStart'>
                            <AppIllustrationUI size='4rem' app={app} />
                            <AppDraftsQuickListUI app={app} />
                        </RevealUI>
                    </div>
                ))}
                <hr />
                <div tw='italic text-sm text-center'>fav drafts</div>
                {st.favoriteDrafts.map((draft) => (
                    <div tw='pt-1'>
                        <RevealUI trigger='hover' placement='rightStart'>
                            <DraftIllustrationUI onClick={() => draft.openOrFocusTab()} size='4rem' draft={draft} />
                            <div className='MENU-ROOT'>
                                <div className='MENU-HEADER'>
                                    <div //Container
                                        tw='flex bg-base-200 p-1 rounded w-full'
                                    >
                                        <AppIllustrationUI size='2rem' app={draft.app} />
                                        <div tw='flex-1 text-xs text-center self-center p-2'>{draft.app.name}</div>
                                    </div>
                                </div>
                                <div className='MENU-CONTENT'>
                                    <div //Container
                                        tw='flex-column bg-base-300 p-1 rounded text-center items-center'
                                    >
                                        <div tw='text-xs'>{draft.data.title}</div>
                                        <div tw='flex self-center text-center justify-center p-1'>
                                            <DraftIllustrationUI size='12rem' draft={draft} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </RevealUI>
                    </div>
                ))}
            </div>
        </div>
    )
})

export const AppDraftsQuickListUI = observer(function AppDraftsQuickListUI_(p: { app: CushyAppL }) {
    const app = p.app

    const [filterText, setFilterText] = useState<string>('')

    const filteredApps =
        filterText === ''
            ? app.drafts
            : app.drafts.filter((draft) => {
                  return draft.name.toLowerCase().indexOf(filterText) != -1
              })

    return (
        <div className='MENU-ROOT'>
            <div className='MENU-HEADER'>
                <div tw='btn btn-sm flex-0' onClick={() => app.setFavorite(!app.isFavorite)}>
                    <span
                        tw={[app.isFavorite ? 'text-yellow-500' : null] + ' peer-hover:text-red-500'}
                        className='material-symbols-outlined'
                    >
                        star
                    </span>
                </div>
                <div tw='flex-1 flex-grow text-center bg-base-200 justify-center content-center border-l border-r border-base-100 pt-1'>
                    {app.name}
                </div>
                <div onClick={() => app.createDraft()} tw='btn btn-sm'>
                    <div>
                        <span tw='material-symbols-outlined'>add</span>
                    </div>
                </div>
            </div>
            <div className='MENU-CONTENT' tw='flex-col flex gap-1 max-w-md'>
                {app.description ? (
                    <div //Description
                        tw='flex-1 rounded p-1 italic text-sm'
                    >
                        {app.description}
                    </div>
                ) : (
                    <></>
                )}
                <div //App Grid Container
                    tw='flex-col bg-base-300 p-2 rounded'
                >
                    <div //Filter Input
                        tw='flex rounded pb-2'
                    >
                        <input
                            tw='input-sm w-full bg-base-200 rounded rounded-r-none border border-base-200 border-r-base-300 outline-none focus:border-primary'
                            value={filterText}
                            onChange={(ev) => setFilterText(ev.currentTarget.value)}
                            placeholder='Filter Drafts'
                        ></input>
                        <button
                            tw='btn btn-sm text-center items-center self-center snap-center bg-base-200 p-1'
                            onClick={(ev) => setFilterText('')}
                        >
                            <span className='material-symbols-outlined'>cancel</span>
                        </button>
                    </div>
                    <div //App Grid Container
                        tw='grid grid-cols-3 gap-2 max-h-96 overflow-scroll'
                    >
                        {filteredApps.map((draft) => (
                            <div tw='flex brightness-95 cursor-pointer hover:brightness-110 bg-base-200 rounded-md border-base-100 border p-1 justify-center'>
                                <div key={draft.id} onClick={() => draft.openOrFocusTab()}>
                                    <div tw='flex self-center text-center justify-center p-1'>
                                        <DraftIllustrationUI size='8rem' draft={draft} />
                                    </div>
                                    <div tw='text-center text-sm truncate overflow-clip max-w-32'>{draft.name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
})
