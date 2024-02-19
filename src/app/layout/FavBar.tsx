import type { CushyAppL } from 'src/models/CushyApp'

import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { AppIllustrationUI } from 'src/cards/fancycard/AppIllustrationUI'
import { DraftIllustrationUI } from 'src/cards/fancycard/DraftIllustration'
import { FormUI } from 'src/controls/FormUI'
import { PanelHeaderSmallUI } from 'src/panels/PanelHeader'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { useSt } from 'src/state/stateContext'
import { TreeUI } from 'src/panels/libraryUI/tree/xxx/TreeUI'
import { runInAction } from 'mobx'

export const FavBarUI = observer(function FavBarUI_(p: {
    //
    direction?: 'row' | 'column'
}) {
    const st = useSt()
    const conf = st.sideBarConf
    const size = conf.fields.size.value
    const sizeStr = size + 'px'
    return (
        <>
            <div
                //
                tw='relative flex overflow-auto'
                style={{ flexDirection: p.direction, width: `${size + 8}px` }}
            >
                <div tw='absolute inset-0 overflow-auto bg-base-300 flex-1 overflow-auto'>
                    <PanelHeaderSmallUI>
                        <FormUI form={conf} />
                    </PanelHeaderSmallUI>
                    <div tw='flex flex-col items-center'>
                        <div
                            tw={['btn btn-square', conf.fields.tree.value && 'btn-primary']}
                            style={{ width: sizeStr, height: sizeStr }}
                            onClick={() =>
                                runInAction(() => {
                                    conf.fields.tree.value = !conf.fields.tree.value
                                    conf.fields.apps.value = false
                                })
                            }
                        >
                            <span style={{ fontSize: sizeStr }} className='material-symbols-outlined'>
                                folder_open
                            </span>
                        </div>
                        <div
                            tw={['btn btn-square', conf.fields.apps.value && 'btn-primary']}
                            style={{ width: sizeStr, height: sizeStr }}
                            onClick={() =>
                                runInAction(() => {
                                    conf.fields.tree.value = false
                                    conf.fields.apps.value = !conf.fields.apps.value
                                })
                            }
                        >
                            <span style={{ fontSize: sizeStr }} className='material-symbols-outlined'>
                                apps
                            </span>
                        </div>
                        {/* <div tw='italic text-sm text-center'>fav apps</div> */}
                        {st.favoriteApps.map((app) => (
                            <div tw='pt-1' key={app.id}>
                                <RevealUI showDelay={0} trigger='hover' placement='right'>
                                    <div tw='rounded' style={{ border: `1px solid oklch(var(--s))` }}>
                                        <AppIllustrationUI size={sizeStr} app={app} tw='bor' />
                                    </div>
                                    <AppDraftsQuickListUI app={app} />
                                </RevealUI>
                            </div>
                        ))}
                        <hr />
                        {/* <div tw='italic text-sm text-center'>fav drafts</div> */}
                        {st.favoriteDrafts.map((draft) => (
                            <div tw='pt-1' key={draft.id}>
                                <RevealUI trigger='hover' placement='right'>
                                    <div tw='rounded' style={{ border: `1px solid oklch(var(--a))` }}>
                                        <DraftIllustrationUI
                                            onClick={() => draft.openOrFocusTab()}
                                            size={sizeStr}
                                            draft={draft}
                                        />
                                    </div>
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
            </div>
            {conf.fields.tree.value && (
                <div tw='relative w-96 flex flex-col overflow-auto'>
                    <div tw='absolute insert-0 w-96'>
                        <TreeUI autofocus shortcut='mod+2' title='File Explorer' tw='overflow-auto' treeView={st.tree2View} />
                    </div>
                </div>
            )}
            {conf.fields.apps.value && (
                <div tw='relative w-96 flex flex-col overflow-auto'>
                    <div tw='absolute insert-0 w-96'>
                        <TreeUI autofocus shortcut='mod+1' title='Apps and Drafts' tw='overflow-auto' treeView={st.tree1View} />
                    </div>
                </div>
            )}
        </>
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
