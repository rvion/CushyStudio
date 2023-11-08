import { observer } from 'mobx-react-lite'
import { Button, ButtonGroup, Input, InputGroup, Modal, Panel } from 'rsuite'
import { FancyCardUI } from 'src/cards/fancycard/FancyCard'
import { useSt } from 'src/state/stateContext'
import { CreateDeckBtnUI } from '../app/layout/GithubAppBarInputUI'
import { Panel_DeckList } from '../panels/Panel_DeckList'

export const CardsPickerModalUI = observer(function CardsPickerModalUI_(p: {}) {
    const st = useSt()
    return (
        <Modal tw='h-full' size='full' open={st.showCardPicker} onClose={st.closeCardPicker}>
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
        <div
            //
            tw='relative'
            style={{ zIndex: 9999999 }}
        >
            <div tw='flex justify-between'>
                <h3>Choose an action</h3>
                <CreateDeckBtnUI />
            </div>

            {/* <div>CARD 1</div> */}
            <div tw='flex'>
                <div tw='w-96 shrink-0'>
                    <Panel bordered>
                        <Panel_DeckList />
                    </Panel>
                </div>
                <div>
                    <InputGroup size='lg' tw='self-start'>
                        <InputGroup.Addon>
                            <span className='material-symbols-outlined'>search</span>
                        </InputGroup.Addon>
                        <Input
                            value={library.query}
                            onChange={(v) => (library.query = v)}
                            autoFocus
                            placeholder='search'
                            type='string'
                        ></Input>
                        {/* ({library.query} - {library.query.length}) */}
                    </InputGroup>
                    <div className='my-2'>
                        <ButtonGroup>
                            <Button>Foo</Button>
                            <Button>Foo</Button>
                            <Button>Foo</Button>
                        </ButtonGroup>
                    </div>
                    <div tw='flex flex-wrap'>
                        {st.library.cardsFiltered.map((card) => (
                            <div key={card.relPath}>
                                <FancyCardUI //
                                    deck={card.deck}
                                    style={card.style}
                                    card={card}
                                />
                                {/* {card.priority} */}
                                {card.drafts.length > 0 ? (
                                    <div tw='flex flex-col'>
                                        {card.drafts.map((draft) => (
                                            <div key={draft.id}>
                                                <Button
                                                    onClick={() => (st.currentDraft = draft)}
                                                    startIcon={<span className='material-symbols-outlined'>play_arrow</span>}
                                                >
                                                    {draft.data.title}
                                                </Button>
                                                <Button appearance='subtle' color='red'>
                                                    <span className='material-symbols-outlined'>delete</span>
                                                </Button>
                                                <Button appearance='subtle' color='blue'>
                                                    <span className='material-symbols-outlined'>open_in_new</span>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </div>
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
