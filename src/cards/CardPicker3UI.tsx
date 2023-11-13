import { observer } from 'mobx-react-lite'
import { Button, ButtonGroup, IconButton, Input, InputGroup, Modal, Panel } from 'rsuite'
import { FancyCardUI } from 'src/cards/fancycard/FancyCard'
import { useSt } from 'src/state/stateContext'
import { CreateDeckBtnUI } from 'src/app/layout/CreateDeckBtnUI'
import { Panel_DeckList } from '../panels/Panel_DeckList'
import { ScrollablePaneUI } from 'src/widgets/misc/scrollableArea'

export const CardsPickerModalUI = observer(function CardsPickerModalUI_(p: {}) {
    const st = useSt()
    return (
        <Modal
            //
            animationTimeout={0}
            drawer
            size='full'
            open={st.showCardPicker}
            onClose={st.closeCardPicker}
        >
            <Modal.Body>
                <CardPicker3UI />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={st.closeCardPicker} appearance='primary'>
                    Ok
                </Button>
                <Button onClick={st.closeCardPicker} appearance='subtle'>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    )
})

export const CardPicker3UI = observer(function CardPicker3UI_(p: {}) {
    const st = useSt()
    const library = st.library
    return (
        <div tw='relative flex-grow flex flex-col '>
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
                    <InputGroup.Button>Foo</InputGroup.Button>
                    <InputGroup.Button>Bar</InputGroup.Button>
                    <InputGroup.Button>Baz</InputGroup.Button>
                </InputGroup>
                <CreateDeckBtnUI />
            </div>

            <div tw='flex flex-grow'>
                <ScrollablePaneUI style={{ width: '300px' }} tw='shrink-0'>
                    <Panel_DeckList />
                </ScrollablePaneUI>
                <ScrollablePaneUI tw='flex-grow'>
                    <div tw='sticky top-0 z-50 bg-gray'></div>

                    <div tw='flex flex-wrap gap-2 p-3'>
                        {st.library.cardsFilteredSorted.map((card, ix) => (
                            <div key={card.relPath}>
                                <FancyCardUI //
                                    active={st.library.selectionCursor === ix}
                                    deck={card.deck}
                                    style={card.style}
                                    card={card}
                                />
                                {/* {card.priority} */}
                                {card.drafts.length > 0 ? (
                                    <div tw='flex flex-col'>
                                        {card.drafts.map((draft, ix) => (
                                            <div tw='flex w-96' key={draft.id}>
                                                <Button
                                                    tw='flex-grow'
                                                    size='sm'
                                                    appearance='subtle'
                                                    onClick={() => (st.currentDraft = draft)}
                                                    startIcon={<span className='material-symbols-outlined'>play_arrow</span>}
                                                >
                                                    draft #{ix}: {draft.data.title}
                                                </Button>
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

// {st.library.decksSorted.map((deck) => {
//     let cards = deck.cardsSorted
//     if (st.library.query) cards = cards.filter((c) => c.matchesSearch(st.library.query))
//     if (cards.length === 0) return null
//     return (
//         <Panel key={deck.folderAbs}>
//             <div tw='flex flex-wrap'>
//                 {cards.map((card, ix) => {
//                     const drafts = card.drafts
//                     return (
//                         <div key={card.relPath}>
//                             <FancyCardUI //
//                                 deck={deck}
//                                 style={card.style}
//                                 card={card}
//                             />
//                             {/* {card.priority} */}
//                             {drafts.length > 0 ? (
//                                 <div tw='flex flex-col'>
//                                     {drafts.map((draft) => (
//                                         <div key={draft.id}>
//                                             <Button
//                                                 onClick={() => (st.currentDraft = draft)}
//                                                 startIcon={
//                                                     <span className='material-symbols-outlined'>
//                                                         play_arrow
//                                                     </span>
//                                                 }
//                                             >
//                                                 {draft.data.title}
//                                             </Button>
//                                             <Button appearance='subtle' color='red'>
//                                                 <span className='material-symbols-outlined'>delete</span>
//                                             </Button>
//                                             <Button appearance='subtle' color='blue'>
//                                                 <span className='material-symbols-outlined'>open_in_new</span>
//                                             </Button>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : null}
//                         </div>
//                     )
//                 })}
//             </div>
//         </Panel>
//     )
// })}
