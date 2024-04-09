import { observer } from 'mobx-react-lite'
import { fileURLToPath } from 'url'

import { AppIllustrationUI } from '../../cards/fancycard/AppIllustrationUI'
import { DraftIllustrationUI } from '../../cards/fancycard/DraftIllustration'
import { FormUI } from '../../controls/FormUI'
import { SpacerUI } from '../../controls/widgets/spacer/SpacerUI'
import { CreateAppPopupUI } from '../../panels/Panel_Welcome/CreateAppBtnUI'
import { PanelHeaderUI } from '../../panels/PanelHeader'
import { CachedResizedImage } from '../../rsuite/CachedResizedImageUI'
import { RevealUI } from '../../rsuite/reveal/RevealUI'
import { AppDraftsQuickListUI } from './AppDraftsQuickListUI'
import { DraftPopupV1UI } from './DraftPopupV1UI'

export const FavBarUI = observer(function FavBarUI_(p: {
    //
    direction?: 'row' | 'column'
}) {
    const form = cushy.favbar
    const conf = form.root.fields
    const value = form.value
    if (!value.visible) return null
    const size = value.size
    const appIcons = conf.appIcons
    const sizeStr = size + 'px'
    return (
        <>
            <div
                tw='relative flex bg-neutral text-neutral-content border-primary/10 border-r box-content overflow-hidden'
                style={{ flexDirection: p.direction, /* width: `${size + 18}px`, */ scrollBehavior: 'inherit' }}
            >
                <PanelHeaderUI // FAVORITE OPTIONS ------------------------------------------------------------
                >
                    <RevealUI
                        tw='WIDGET-FIELD '
                        title='Favorite Bar Options'
                        content={() => (
                            <div tw='p-2 w-72'>
                                <FormUI form={form} />
                            </div>
                        )}
                    >
                        <div tw='WIDGET-FIELD cursor-default rounded  hover:brightness-125 bg-base-200 border border-base-100 items-center justify-center flex text-shadow'>
                            <span className='material-symbols-outlined'>settings</span>
                            <span className='material-symbols-outlined'>expand_more</span>
                        </div>
                    </RevealUI>
                    <SpacerUI />
                </PanelHeaderUI>

                {/* Lot of divs, but it makes it so the scrolling container is rounded on the inside. */}
                <div tw=' flex flex-row items-center rounded overflow-hidden'>
                    <div tw='rounded items-center justify-center overflow-hidden'>
                        <div tw='hide-vertical-scroll h-full items-center flex gap-1.5 overflow-scroll'>
                            {/* <FavBarContainer> */}
                            <RevealUI // CREATE NEW APP ----------------------------------------------
                                tw='hover:brightness-125'
                                placement='popup-lg'
                                content={() => <CreateAppPopupUI />}
                            >
                                <span
                                    tw='cursor-default flex'
                                    // style={{ fontSize: sizeStr }}
                                    className='material-symbols-outlined'
                                >
                                    library_add
                                </span>
                            </RevealUI>

                            <div
                                tw={['btn btn-xs btn-neutral btn-square flex rounded hover:brightness-125']}
                                onClick={() => cushy.layout.FOCUS_OR_CREATE('TreeExplorer', {}, 'LEFT_PANE_TABSET')}
                            >
                                <span /* style={{ fontSize: sizeStr }} */ className='material-symbols-outlined'>folder</span>
                            </div>
                            {/* <div
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
                                </div> */}
                            {/* </FavBarContainer> */}
                            {/* APPS --------------------------------------------------------------------------- */}
                            <div tw='subtle'>{/* <Fav />  */}Apps:</div>
                            {cushy.favoriteApps.map((app) => (
                                <div
                                    tw='rounded border border-base-300 overflow-clip box-content'
                                    style={{ width: sizeStr, height: sizeStr }}
                                    key={app.id}
                                >
                                    <RevealUI
                                        showDelay={0}
                                        trigger='click'
                                        placement='bottomStart'
                                        content={() => <AppDraftsQuickListUI app={app} />}
                                    >
                                        <AppIllustrationUI
                                            tw={[conf.grayscale.value && '[&:not(:hover)]:grayscale']}
                                            className={'!rounded-none'}
                                            size={sizeStr}
                                            app={app}
                                        />
                                    </RevealUI>
                                </div>
                            ))}

                            {/* DRAFTS --------------------------------------------------------------------------- */}
                            <div tw='subtle'>{/* <Fav />  */}Drafts:</div>
                            {cushy.favoriteDrafts.map((draft) => (
                                <div tw='rounded border border-base-300 overflow-clip' key={draft.id}>
                                    <RevealUI
                                        className=''
                                        showDelay={0}
                                        hideDelay={0}
                                        trigger='hover'
                                        placement='bottomStart'
                                        content={() => <DraftPopupV1UI draft={draft} />}
                                    >
                                        <div
                                            tw='relative cursor-default hover:brightness-125'
                                            onClick={() => draft.openOrFocusTab()}
                                        >
                                            {draft.data.illustration ? (
                                                <CachedResizedImage
                                                    tw={[conf.grayscale.value && '[&:not(:hover)]:grayscale']}
                                                    style={{ width: size, height: size }}
                                                    filePath={fileURLToPath(draft.data.illustration)}
                                                    size={size}
                                                />
                                            ) : (
                                                <DraftIllustrationUI className={'!rounded-none'} size={sizeStr} draft={draft} />
                                            )}
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
                                    </RevealUI>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* </div> */}
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
