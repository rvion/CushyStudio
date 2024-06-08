import { observer } from 'mobx-react-lite'

import { AppCardUI } from '../cards/fancycard/AppCardUI'
import { Button } from '../csuite/button/Button'
import { Frame } from '../csuite/frame/Frame'
import { Slider, Toggle } from '../csuite/shims'
import { useSt } from '../state/stateContext'
import { FieldAndLabelUI } from '../widgets/misc/FieldAndLabelUI'

export const Panel_FullScreenLibrary = observer(function Panel_CardPicker3UI_(p: {}) {
    const st = useSt()
    const library = st.library

    return (
        <div tw='relative h-full flex-grow flex flex-col'>
            <Frame base tw='p-4 flex flex-wrap items-center'>
                <div tw='text-2xl'>Library</div>
                <div tw='flex gap-1 items-center'>
                    <div tw='join virtualBorder'>
                        <div tw='flex items-center px-2 join-item'>
                            <span className='material-symbols-outlined'>search</span>
                        </div>
                        <input
                            tw='cushy-basic-input'
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
                    <Button look='primary' onClick={st.startupFileIndexing}>
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
            </Frame>
            <div tw='flex flex-col flex-grow p-4 overflow-auto'>
                <div tw='divider'></div>
                <div tw='text-xl text-accent font-bold'>Built-in Apps</div>
                <div tw='flex flex-wrap  gap-2'>
                    {st.library.appsFilteredBuiltIn.map((app, ix) => (
                        <div key={app.id}>
                            <AppCardUI //
                                active={st.library.selectionCursor === ix}
                                app={app}
                            />
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
            </div>
        </div>
    )
})
