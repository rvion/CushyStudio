import type { CushyAppL } from 'src/models/CushyApp'

import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { ReactNode, useState } from 'react'

import { AppIllustrationUI } from 'src/cards/fancycard/AppIllustrationUI'
import { DraftIllustrationUI } from 'src/cards/fancycard/DraftIllustration'
import { FormUI } from 'src/controls/FormUI'
import { TreeUI } from 'src/panels/libraryUI/tree/xxx/TreeUI'
import { CreateAppPopupUI } from 'src/panels/Panel_Welcome/CreateAppBtnUI'
import { PanelHeaderUI } from 'src/panels/PanelHeader'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { useSt } from 'src/state/stateContext'
import { SpacerUI } from 'src/controls/widgets/spacer/SpacerUI'

// Could give this an option be collapsible in the future?
/** Re-usable container to keep a consistent style around groups of buttons */
const FavBarContainer = observer(function FavBarContainer_(p: { children?: ReactNode; icon?: string }) {
    return (
        <div // Favorite app container
            tw={['w-full flex flex-col rounded', 'gap-1 bg-base-100 p-1 text-center justify-center items-center', 'text-shadow']}
        >
            {p.icon && (
                <span tw='select-none' className='material-symbols-outlined'>
                    {p.icon}
                </span>
            )}
            {p.children}
        </div>
    )
})

export const FavBarUI = observer(function FavBarUI_(p: {
    //
    direction?: 'row' | 'column'
}) {
    const st = useSt()
    const conf = st.sideBarConf
    const size = conf.fields.size.value
    const appIcons = conf.fields.appIcons
    const sizeStr = size + 'px'
    return (
        <>
            <div
                tw='relative flex flex-col border-primary/10 border-r box-content'
                style={{ flexDirection: p.direction, width: `${size + 18}px`, scrollBehavior: 'inherit' }}
            >
                <div tw='flex flex-col inset-0 bg-base-300 flex-1 select-none overflow-clip'>
                    <PanelHeaderUI>
                        <SpacerUI />
                        <RevealUI tw='WIDGET-FIELD w-full' title='Favorite Bar Options' style={{ width: `${size + 8}px` }}>
                            <div tw='WIDGET-FIELD cursor-default rounded w-full hover:brightness-125 bg-base-200 border border-base-100 items-center justify-center flex text-shadow'>
                                <span className='material-symbols-outlined'>settings</span>
                                <span className='material-symbols-outlined'>expand_more</span>
                            </div>
                            <div tw='p-2 w-72'>
                                <FormUI form={conf} />
                            </div>
                        </RevealUI>
                        <SpacerUI />
                    </PanelHeaderUI>
                    {/* Lot of divs, but it makes it so the scrolling container is rounded on the inside. */}
                    <div tw='hide-vertical-scroll w-full h-full flex flex-col items-center rounded overflow-clip pb-1'>
                        <div
                            tw='hide-vertical-scroll rounded items-center justify-center overflow-clip'
                            style={{ scrollBehavior: 'inherit' }}
                        >
                            <div tw='h-full items-center flex flex-col gap-1'>
                                <FavBarContainer>
                                    <RevealUI tw='hover:brightness-125' placement='popup-lg'>
                                        <span
                                            tw='cursor-default flex'
                                            style={{ fontSize: sizeStr }}
                                            className='material-symbols-outlined'
                                        >
                                            add
                                        </span>
                                        {/* </div> */}
                                        <CreateAppPopupUI />
                                    </RevealUI>
                                    <div
                                        tw='my-0.5 bg-neutral-content rounded-full'
                                        style={{ width: sizeStr, height: '3px' }}
                                    ></div>
                                    <div
                                        tw={[
                                            'flex rounded hover:brightness-125',
                                            conf.fields.tree.value && 'bg-primary text-primary-content text-shadow-inv',
                                        ]}
                                        onClick={() =>
                                            runInAction(() => {
                                                conf.fields.tree.value = !conf.fields.tree.value
                                                conf.fields.apps.value = false
                                            })
                                        }
                                    >
                                        <span style={{ fontSize: sizeStr }} className='material-symbols-outlined'>
                                            {conf.fields.tree.value ? 'folder_open' : 'folder'}
                                        </span>
                                    </div>
                                    <div
                                        tw={[
                                            'rounded hover:brightness-125',
                                            conf.fields.apps.value && 'bg-primary text-primary-content text-shadow-inv',
                                        ]}
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
                                </FavBarContainer>
                                {st.favoriteApps.length > 0 && (
                                    <FavBarContainer icon='apps'>
                                        {st.favoriteApps.map((app) => (
                                            <div
                                                tw='rounded border border-base-300 overflow-clip box-content'
                                                key={app.id}
                                                style={{ width: sizeStr, height: sizeStr }}
                                            >
                                                <RevealUI showDelay={0} trigger='hover' placement='right'>
                                                    <AppIllustrationUI className={'!rounded-none'} size={sizeStr} app={app} />
                                                    <AppDraftsQuickListUI app={app} />
                                                </RevealUI>
                                            </div>
                                        ))}
                                    </FavBarContainer>
                                )}
                                {st.favoriteDrafts.length > 0 && (
                                    <FavBarContainer icon='history_edu'>
                                        {st.favoriteDrafts.map((draft) => (
                                            <div tw='rounded border border-base-300 overflow-clip' key={draft.id}>
                                                <RevealUI className='' trigger='hover' placement='right'>
                                                    <div
                                                        tw='relative cursor-default hover:brightness-125'
                                                        onClick={() => draft.openOrFocusTab()}
                                                    >
                                                        <DraftIllustrationUI
                                                            className={'!rounded-none'}
                                                            size={sizeStr}
                                                            draft={draft}
                                                        />
                                                        {appIcons.value && (
                                                            <div style={{ opacity: appIcons.value * 0.01 }}>
                                                                <AppIllustrationUI
                                                                    size={`${size / 2.5}px`}
                                                                    app={draft.app}
                                                                    className='rounded-full border border-base-300 bg-base-300'
                                                                    tw={['absolute bottom-0.5 right-0.5']}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className='MENU-ROOT'>
                                                        <div className='MENU-HEADER'>
                                                            <div //Container
                                                                tw='flex bg-base-200 p-1 rounded w-full'
                                                            >
                                                                <AppIllustrationUI size='2rem' app={draft.app} />
                                                                <div tw='flex-1 text-xs text-center self-center p-2'>
                                                                    {draft.app.name}
                                                                </div>
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
                                    </FavBarContainer>
                                )}
                            </div>
                        </div>
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
