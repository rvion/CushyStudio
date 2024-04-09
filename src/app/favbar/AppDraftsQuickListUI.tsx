import type { CushyAppL } from '../../models/CushyApp'

import { observer } from 'mobx-react-lite'
import { useState } from 'react'

import { DraftIllustrationUI } from '../../cards/fancycard/DraftIllustration'

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
                ) : null}
                <div //App Grid Container
                    tw='flex-col bg-base-300 p-2 rounded'
                >
                    <div //Filter Input
                        tw='flex rounded pb-2'
                    >
                        <input
                            tw='input-sm  bg-base-200 rounded rounded-r-none border border-base-200 border-r-base-300 outline-none focus:border-primary'
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
                            <div
                                key={draft.id}
                                tw='flex brightness-95 cursor-pointer hover:brightness-110 bg-base-200 rounded-md border-base-100 border p-1 justify-center'
                            >
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
