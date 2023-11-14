import { observer } from 'mobx-react-lite'
import { IconButton, Input, InputGroup, Slider, Toggle } from 'rsuite'
import { CreateDeckBtnUI } from 'src/app/layout/CreateDeckBtnUI'
import { FancyCardUI } from 'src/cards/fancycard/FancyCard'
import { FileBeeingImportedUI } from 'src/importers/FilesBeeingImported'
import { useSt } from 'src/state/stateContext'
import { ScrollablePaneUI } from 'src/widgets/misc/scrollableArea'

export const Panel_CardPicker3UI = observer(function Panel_CardPicker3UI_(p: {}) {
    const st = useSt()
    const library = st.library
    return (
        <div tw='relative h-full flex-grow flex flex-col '>
            <div
                //
                tw='mx-10'
                // style={{ maxWidth: '40rem' }}
            >
                <div tw='flex gap-1 items-center'>
                    <h3 tw='mr-2'>Library</h3>
                    <InputGroup>
                        <InputGroup.Addon>
                            <span className='material-symbols-outlined'>search</span>
                        </InputGroup.Addon>
                        <Input
                            value={library.query}
                            onChange={(v) => (library.query = v)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const card = library.cardsFilteredSorted[library.selectionCursor]
                                    if (card == null) return
                                    card.openLastDraftAsCurrent()
                                    st.closeCardPicker()
                                } else if (e.key === 'ArrowDown') {
                                    library.selectionCursor++
                                } else if (e.key === 'ArrowUp') {
                                    library.selectionCursor--
                                }
                            }}
                            autoFocus
                            placeholder='search'
                            type='string'
                        ></Input>
                        {/* ({library.query} - {library.query.length}) */}
                    </InputGroup>
                    <CreateDeckBtnUI />
                    {/* </div> */}
                    {/* <div tw='flex gap-2'> */}
                    {/* <InputGroup tw='self-start'>
                        <InputGroup.Button>Foo</InputGroup.Button>
                        <InputGroup.Button>Bar</InputGroup.Button>
                        <InputGroup.Button>Baz</InputGroup.Button>
                    </InputGroup> */}
                    <div>
                        <div>Descriptions</div>
                        <Toggle onChange={(t) => (st.library.showDescription = t)} checked={st.library.showDescription} />
                    </div>
                    <div>
                        <div>Drafts</div>
                        <Toggle
                            //
                            onChange={(t) => (st.library.showDrafts = t)}
                            checked={st.library.showDrafts}
                        />
                    </div>
                    <div>
                        <div>Favorites</div>
                        <Toggle
                            //
                            onChange={(t) => (st.library.showFavorites = t)}
                            checked={st.library.showFavorites}
                        />
                    </div>
                    <div>
                        Size
                        <Slider
                            //
                            min={3}
                            max={20}
                            tw='py-1.5'
                            style={{ width: '5rem' }}
                            onChange={(t) => (st.library.imageSize = `${t}rem`)}
                            value={parseInt(st.library.imageSize.slice(0, -3), 10)}
                        />
                    </div>
                </div>
            </div>
            <div tw='flex flex-grow'>
                {/* <ScrollablePaneUI style={{ width: '300px' }} tw='shrink-0'>
                    <Panel_DeckList />
                </ScrollablePaneUI> */}
                <ScrollablePaneUI tw='flex-grow'>
                    <div tw='flex flex-wrap  gap-1.5 p-3 justify-center'>
                        <FileBeeingImportedUI files={st.droppedFiles} />
                        {st.library.cardsFilteredSorted.map((card, ix) => (
                            <div key={card.relPath}>
                                <FancyCardUI //
                                    active={st.library.selectionCursor === ix}
                                    deck={card.deck}
                                    style={card.style}
                                    card={card}
                                />
                                {/* {card.priority} */}
                                {card.drafts.length > 0 && st.library.showDrafts ? (
                                    <div tw='flex flex-col'>
                                        {card.drafts.map((draft, ix) => (
                                            <div tw='flex items-center w-80' key={draft.id}>
                                                <IconButton
                                                    size='sm'
                                                    icon={<span className='material-symbols-outlined'>delete</span>}
                                                    appearance='subtle'
                                                    color='red'
                                                ></IconButton>
                                                <IconButton
                                                    size='sm'
                                                    icon={<span className='material-symbols-outlined'>open_in_new</span>}
                                                    appearance='subtle'
                                                    color='blue'
                                                ></IconButton>
                                                {/* <span className='material-symbols-outlined'>play_arrow</span> */}
                                                <div tw='underline flex items-center' onClick={() => (st.currentDraft = draft)}>
                                                    draft #{ix}: {draft.data.title}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </ScrollablePaneUI>
            </div>
        </div>
        // </div>
    )
})
