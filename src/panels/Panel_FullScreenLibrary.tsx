import { observer } from 'mobx-react-lite'

import { AppCardUI } from '../cards/fancycard/AppCardUI'
import { Button } from '../rsuite/button/Button'
import { Slider, Toggle } from '../rsuite/shims'
import { useSt } from '../state/stateContext'
import { FieldAndLabelUI } from '../widgets/misc/FieldAndLabelUI'
import { ScrollablePaneUI } from '../widgets/misc/scrollableArea'

export const Panel_FullScreenLibrary = observer(function Panel_CardPicker3UI_(p: {}) {
    const st = useSt()
    const library = st.library

    return (
        <div tw='relative h-full flex-grow flex flex-col'>
            <div tw='p-4'>
                <div tw='flex gap-2'>
                    <div tw='mr-2 text-2xl'>Library</div>
                    {/* <CreateDeckBtnUI /> */}
                </div>
                <div tw='flex gap-1 items-center'>
                    <div tw='join virtualBorder'>
                        <div tw='flex items-center px-2 join-item'>
                            <span className='material-symbols-outlined'>search</span>
                        </div>
                        <input
                            tw='join-item input input-sm'
                            type='string'
                            value={library.query}
                            onChange={(ev) => {
                                const next = ev.target.value
                                library.query = next
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const app = library.appsFiltered[library.selectionCursor]
                                    if (app == null) return
                                    app.openLastOrCreateDraft()
                                    st.closeFullLibrary()
                                } else if (e.key === 'ArrowDown') {
                                    library.selectionCursor++
                                } else if (e.key === 'ArrowUp') {
                                    library.selectionCursor--
                                }
                            }}
                            autoFocus
                            placeholder='search'
                            // auto select text on focus
                            onFocus={(e) => e.target.select()}
                        />
                    </div>
                    <Button primary sm onClick={st.startupFileIndexing}>
                        Index All Apps
                    </Button>
                    <FieldAndLabelUI label='Descriptions'>
                        <Toggle
                            onChange={(t) => (st.library.showDescription = t.target.checked)}
                            checked={st.library.showDescription}
                        />
                    </FieldAndLabelUI>
                    <FieldAndLabelUI label='Drafts'>
                        <Toggle //
                            onChange={(t) => (st.library.showDrafts = t.target.checked)}
                            checked={st.library.showDrafts}
                        />
                    </FieldAndLabelUI>
                    <FieldAndLabelUI label='Favorites'>
                        <Toggle
                            onChange={(t) => (st.library.showFavorites = t.target.checked)}
                            checked={st.library.showFavorites}
                        />
                    </FieldAndLabelUI>
                    <FieldAndLabelUI label='size'>
                        <Slider
                            min={3}
                            max={20}
                            style={{ width: '5rem' }}
                            onChange={(t) => (st.library.imageSize = `${t.target.value}rem`)}
                            value={parseInt(st.library.imageSize.slice(0, -3), 10)}
                        />
                    </FieldAndLabelUI>
                </div>
            </div>
            <div tw='flex flex-grow p-4'>
                {/* <ScrollablePaneUI style={{ width: '300px' }} tw='shrink-0'>
                    <Panel_DeckList />
                </ScrollablePaneUI> */}
                <ScrollablePaneUI tw='flex-grow'>
                    {/*
                    <div tw='text-xl text-accent font-bold'>Installed Apps</div>
                    <div>--</div>
                    <div tw='text-xl text-accent font-bold'>App marketplace</div>
                    <div tw='flex flex-wrap  gap-2'>
                        {st._allPublishedApps?.data?.map((app) => (
                            <div tw='w-96 h-80 virtualBorder' key={app.id}>
                                <div tw='font-bold'>{app.name}</div>
                                <img
                                    //
                                    style={{ width: '5rem', height: '5rem' }}
                                    src={app.illustration_url ?? ''}
                                />
                                <RevealUI>
                                    <div tw='font-bold'>{app.description}</div>
                                    <pre tw='text-xs overflow-auto'>{JSON.stringify(app, null, 3)}</pre>
                                </RevealUI>
                            </div>
                        ))}
                    </div>
                    */}
                    <div tw='divider'></div>
                    <div tw='text-xl text-accent font-bold'>Built-in Apps</div>
                    <div tw='flex flex-wrap  gap-2'>
                        {st.library.appsFilteredBuiltIn.map((app, ix) => (
                            <div key={app.id}>
                                <AppCardUI //
                                    active={st.library.selectionCursor === ix}
                                    // deck={card.pkg}
                                    app={app}
                                />
                                {/* {card.priority} */}
                                {/* {card.drafts.length > 0 && st.library.showDrafts ? (
                                    <div tw='flex flex-col'>
                                        {card.drafts.map((draft, ix) => (
                                            <DraftEntryUI draft={draft} />
                                        ))}
                                    </div>
                                ) : null} */}
                            </div>
                        ))}
                    </div>
                    <div tw='divider'></div>
                    <div tw='text-xl text-accent font-bold'>Local Apps</div>
                    <div tw='flex flex-wrap  gap-2'>
                        {st.library.appsFilteredLocal.map((app, ix) => (
                            <div key={app.id}>
                                <AppCardUI //
                                    active={st.library.selectionCursor === ix}
                                    app={app}
                                />
                            </div>
                        ))}
                    </div>
                    <div tw='divider'></div>
                    <div tw='text-xl text-accent font-bold'>SDK Examples</div>
                    <div tw='flex flex-wrap  gap-2'>
                        {st.library.appsFilteredExample.map((app, ix) => (
                            <div key={app.id}>
                                <AppCardUI //
                                    active={st.library.selectionCursor === ix}
                                    app={app}
                                />
                            </div>
                        ))}
                    </div>
                </ScrollablePaneUI>
            </div>
        </div>
        // </div>
    )
})
