import { observer } from 'mobx-react-lite'
// import { CreateDeckBtnUI } from 'src/app/layout/CreateDeckBtnUI'
import { AppCardUI } from 'src/cards/fancycard/AppCardUI'
import { FileBeeingImportedUI } from 'src/importers/FilesBeeingImported'
import { Addon, Joined, Slider, Toggle } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { FieldAndLabelUI } from 'src/widgets/misc/FieldAndLabelUI'
import { ScrollablePaneUI } from 'src/widgets/misc/scrollableArea'
import { DraftEntryUI } from './libraryUI/DraftEntryUI'

export const Panel_CardPicker3UI = observer(function Panel_CardPicker3UI_(p: {}) {
    const st = useSt()
    const library = st.library
    return (
        <div tw='relative h-full flex-grow flex flex-col'>
            <div tw='bg-base-200 p-4'>
                <div tw='flex gap-2'>
                    <div tw='mr-2 text-2xl'>Library</div>
                    {/* <CreateDeckBtnUI /> */}
                </div>
                <div tw='flex gap-1 items-center'>
                    <Joined>
                        <Addon>
                            <span className='material-symbols-outlined'>search</span>
                        </Addon>
                        <input
                            tw='join-item input-sm'
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
                                    app.openLastDraftAsCurrent()
                                    st.closeFullLibrary()
                                } else if (e.key === 'ArrowDown') {
                                    library.selectionCursor++
                                } else if (e.key === 'ArrowUp') {
                                    library.selectionCursor--
                                }
                            }}
                            autoFocus
                            placeholder='search'
                        />
                    </Joined>
                    {/* </div> */}
                    {/* <div tw='flex gap-2'> */}
                    {/* <InputGroup tw='self-start'>
                        <InputGroup.Button>Foo</InputGroup.Button>
                        <InputGroup.Button>Bar</InputGroup.Button>
                        <InputGroup.Button>Baz</InputGroup.Button>
                    </InputGroup> */}
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
                            //
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
                    <div tw='flex flex-wrap  gap-2'>
                        <FileBeeingImportedUI files={st.droppedFiles} />
                        {st.library.appsFiltered.map((card, ix) => (
                            <div key={card.relPath}>
                                <AppCardUI //
                                    active={st.library.selectionCursor === ix}
                                    // deck={card.pkg}
                                    app={card}
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
                </ScrollablePaneUI>
            </div>
        </div>
        // </div>
    )
})
