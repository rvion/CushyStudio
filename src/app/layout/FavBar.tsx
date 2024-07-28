import type { CushyAppL } from '../../models/CushyApp'

import { observer } from 'mobx-react-lite'
import { ReactNode, useState } from 'react'
import { fileURLToPath } from 'url'

import { AppIllustrationUI } from '../../cards/fancycard/AppIllustrationUI'
import { DraftIllustrationUI } from '../../cards/fancycard/DraftIllustration'
import { Button } from '../../csuite/button/Button'
import { Frame } from '../../csuite/frame/Frame'
import { CachedResizedImage } from '../../csuite/image/CachedResizedImageUI'
import { RevealUI } from '../../csuite/reveal/RevealUI'
import { PanelHeaderUI } from '../../csuite/wrappers/PanelHeader'
import { CreateAppPopupUI } from '../../panels/PanelWelcome/CreateAppBtnUI'
import { useSt } from '../../state/stateContext'

// Could give this an option be collapsible in the future?
/** Re-usable container to keep a consistent style around groups of buttons */
const FavBarContainer = observer(function FavBarContainer_(p: { children?: ReactNode; icon?: string }) {
    return (
        <div // Favorite app container
            tw={['w-full flex flex-col rounded', 'gap-1  p-1 text-center justify-center items-center', 'text-shadow']}
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
    const conf = st.favbar
    if (!conf.value.visible) return null
    const size = conf.fields.size.value
    const appIcons = conf.fields.appIcons
    const sizeStr = size + 'px'
    return (
        <>
            <Frame
                base={cushy.theme.value.appbar ?? { contrast: 0.3 }}
                tw='relative flex flex-col border-primary/10 border-r box-content overflow-hidden'
                style={{ flexDirection: p.direction, width: `${size + 18}px`, scrollBehavior: 'inherit' }}
            >
                <div tw='flex flex-col inset-0 flex-1 select-none overflow-hidden'>
                    <PanelHeaderUI>{conf.renderAsConfigBtn()}</PanelHeaderUI>
                    {/* Lot of divs, but it makes it so the scrolling container is rounded on the inside. */}
                    <div tw='w-full flex flex-col items-center rounded pb-1 overflow-hidden'>
                        <div tw='rounded items-center justify-center overflow-hidden'>
                            <div tw='hide-vertical-scroll h-full items-center flex flex-col gap-1 overflow-scroll'>
                                <FavBarContainer>
                                    <RevealUI
                                        tw='hover:brightness-125'
                                        placement='screen'
                                        shell='popup-lg'
                                        content={() => <CreateAppPopupUI />}
                                    >
                                        <span
                                            tw='cursor-default flex'
                                            style={{ fontSize: sizeStr }}
                                            className='material-symbols-outlined'
                                        >
                                            add
                                        </span>
                                    </RevealUI>
                                    <div tw='my-0.5 bg-neutral-content rounded-full' style={{ width: sizeStr, height: '3px' }} />
                                </FavBarContainer>
                                {/* ------------------------------------------------------------------------ */}
                                {st.favoriteApps.length > 0 && (
                                    <FavBarContainer icon='apps'>
                                        {st.favoriteApps.map((app) => (
                                            <Frame
                                                border={20}
                                                hover
                                                // tw='rounded border border-base-300 overflow-clip box-content'
                                                key={app.id}
                                                style={{ width: sizeStr, height: sizeStr }}
                                            >
                                                <RevealUI
                                                    showDelay={0}
                                                    trigger='hover'
                                                    placement='right'
                                                    content={() => <AppDraftsQuickListUI app={app} />}
                                                >
                                                    <AppIllustrationUI className={'!rounded-none'} size={sizeStr} app={app} />
                                                </RevealUI>
                                            </Frame>
                                        ))}
                                    </FavBarContainer>
                                )}
                                {/* ------------------------------------------------------------------------ */}
                                {st.favoriteDrafts.length > 0 && (
                                    <FavBarContainer icon='history_edu'>
                                        {st.favoriteDrafts.map((draft) => (
                                            <div tw='rounded border border-base-300 overflow-clip' key={draft.id}>
                                                <RevealUI
                                                    trigger='hover'
                                                    showDelay={0}
                                                    placement='right'
                                                    content={() => (
                                                        <Frame base={5}>
                                                            <div className='MENU-HEADER'>
                                                                <div //Container
                                                                    tw='flex p-1 rounded w-full'
                                                                >
                                                                    <AppIllustrationUI size='2rem' app={draft.app} />
                                                                    <div tw='flex-1 text-xs text-center self-center p-2'>
                                                                        {draft.app.name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='MENU-CONTENT'>
                                                                <div //Container
                                                                    tw='flex-column p-1 rounded text-center items-center'
                                                                >
                                                                    <div tw='text-xs'>{draft.data.title}</div>
                                                                    <div tw='flex self-center text-center justify-center p-1'>
                                                                        <DraftIllustrationUI size='12rem' draft={draft} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Frame>
                                                    )}
                                                >
                                                    <Frame
                                                        hover
                                                        border
                                                        tw='relative hover:brightness-125'
                                                        onClick={() => draft.openOrFocusTab()}
                                                    >
                                                        {draft.data.illustration ? (
                                                            <CachedResizedImage
                                                                style={{ width: size, height: size }}
                                                                filePath={fileURLToPath(draft.data.illustration)}
                                                                size={size}
                                                            />
                                                        ) : (
                                                            <DraftIllustrationUI
                                                                className={'!rounded-none'}
                                                                size={sizeStr}
                                                                draft={draft}
                                                            />
                                                        )}
                                                        {appIcons.value && (
                                                            <div style={{ opacity: appIcons.value * 0.01 }}>
                                                                <AppIllustrationUI
                                                                    size={`${size / 2.5}px`}
                                                                    app={draft.app}
                                                                    className='rounded-full border border-base-300'
                                                                    tw={['absolute bottom-0.5 right-0.5']}
                                                                />
                                                            </div>
                                                        )}
                                                    </Frame>
                                                </RevealUI>
                                            </div>
                                        ))}
                                    </FavBarContainer>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Frame>
            {/* {conf.fields.tree.value && (
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
            )} */}
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
                <div tw='flex-1 flex-grow text-center justify-center content-center border-l border-r border-base-100 pt-1'>
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
                    tw='flex-col p-2 rounded'
                >
                    <div //Filter Input
                        tw='flex rounded pb-2'
                    >
                        <input
                            tw='csuite-basic-input w-full rounded-r-none'
                            value={filterText}
                            onChange={(ev) => setFilterText(ev.currentTarget.value)}
                            placeholder='Filter Drafts'
                        ></input>
                        <Button icon='mdiCancel' onClick={(ev) => setFilterText('')}></Button>
                    </div>
                    <div //App Grid Container
                        tw='grid grid-cols-3 gap-2 max-h-96 overflow-scroll'
                    >
                        {filteredApps.map((draft) => (
                            <div
                                key={draft.id}
                                tw='flex brightness-95 cursor-pointer hover:brightness-110 rounded-md border-base-100 border p-1 justify-center'
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
