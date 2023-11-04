import { observer } from 'mobx-react-lite'
import { useSt } from 'src/front/FrontStateCtx'
import { FancyCardUI } from 'src/cards/fancycard/FancyCard'
import { CreateDeckBtnUI } from '../front/ui/layout/GithubAppBarInputUI'
import { DeckHeaderUI } from 'src/cards/DeckHeaderUI'
import { Button, Modal, Panel, Placeholder } from 'rsuite'

export const CardsPickerModalUI = observer(function CardsPickerModalUI_(p: {}) {
    const st = useSt()
    return (
        <Modal tw='h-full' size='full' open={st.showCardPicker} onClose={st.closeCardPicker}>
            <Modal.Header>
                <Modal.Title>
                    <h4>Pick a card</h4>
                </Modal.Title>
            </Modal.Header>
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
            <CreateDeckBtnUI />

            {/* <div>CARD 1</div> */}
            {st.library.decksSorted.map((deck) => {
                const cards = deck.cardManifests
                return (
                    <Panel //
                        key={deck.folderAbs}
                    >
                        <div>
                            <DeckHeaderUI deck={deck} />
                            {/* <b>{deck.cards.length} cards</b> */}
                            {/* {deck.name} */}
                        </div>
                        <div tw='flex flex-wrap'>
                            {cards.map((card, ix) => (
                                <FancyCardUI //
                                    deck={deck}
                                    key={card.relativePath}
                                    style={card.style ?? 'A'}
                                    card={card}
                                />
                            ))}
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
