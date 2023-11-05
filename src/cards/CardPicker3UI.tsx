import { observer } from 'mobx-react-lite'
import { useSt } from 'src/front/FrontStateCtx'
import { FancyCardUI } from 'src/cards/fancycard/FancyCard'
import { CreateDeckBtnUI } from '../front/ui/layout/GithubAppBarInputUI'
import { DeckHeaderUI } from 'src/cards/DeckHeaderUI'
import { Button, ButtonGroup, ButtonToolbar, IconButton, Modal, Panel, Placeholder } from 'rsuite'
import { Fragment } from 'react'
import { runInAction } from 'mobx'

export const CardsPickerModalUI = observer(function CardsPickerModalUI_(p: {}) {
    const st = useSt()
    return (
        <Modal tw='h-full' size='full' open={st.showCardPicker} onClose={st.closeCardPicker}>
            {/* <Modal.Header>
                <Modal.Title>
                    <h4>Pick a card</h4>
                </Modal.Title>
            </Modal.Header> */}
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
    return (
        <div
            //
            tw='relative'
            style={{ zIndex: 9999999 }}
        >
            <div tw='flex justify-between'>
                <h3>Choose a card</h3>
                <CreateDeckBtnUI />
            </div>

            {/* <div>CARD 1</div> */}
            {st.library.decksSorted.map((deck) => {
                const cards = deck.cardsSorted
                return (
                    <Panel //
                        key={deck.folderAbs}
                    >
                        <div>
                            <DeckHeaderUI deck={deck} />
                            <b>{deck.cards.length} cards</b>
                            {/* <pre tw='whitespace-pre-wrap'>{JSON.stringify(deck.manifest)}</pre> */}
                        </div>
                        <div tw='flex flex-wrap'>
                            {cards.map((card, ix) => {
                                const drafts = card.drafts
                                return (
                                    <div key={card.relPath}>
                                        <FancyCardUI //
                                            deck={deck}
                                            style={card.style}
                                            card={card}
                                        />
                                        {/* {card.priority} */}
                                        {drafts.length > 0 ? (
                                            <div tw='flex flex-col'>
                                                {drafts.map((draft) => (
                                                    <div key={draft.id}>
                                                        <Button
                                                            onClick={() => {
                                                                runInAction(() => {
                                                                    st.currentCardAndDraft = {
                                                                        cardPath: card.relPath,
                                                                        draftID: draft.id,
                                                                    }
                                                                    card.load()
                                                                    st.closeCardPicker()
                                                                })
                                                            }}
                                                            startIcon={
                                                                <span className='material-symbols-outlined'>play_arrow</span>
                                                            }
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
                                )
                            })}
                        </div>
                    </Panel>
                )
            })}
            {/* <FancyCardUI style='A' />
                <FancyCardUI style='B' />
                <FancyCardUI style='C' />
                <FancyCardUI style='D' />
                <FancyCardUI style='D' />
                <FancyCardUI style='D' />
                <FancyCardUI style='D' />
                <FancyCardUI style='D' />
                <FancyCardUI style='D' /> */}
        </div>
        // </div>
    )
})
