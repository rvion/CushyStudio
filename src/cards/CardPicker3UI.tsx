import { observer } from 'mobx-react-lite'
import { useSt } from 'src/front/FrontStateCtx'
import { FancyCardUI } from 'src/cards/fancycard/FancyCard'
import { CreateDeckBtnUI } from '../front/ui/layout/GithubAppBarInputUI'
import { DeckHeaderUI } from 'src/cards/DeckHeaderUI'
import { Panel } from 'rsuite'

export const CardPicker3UI = observer(function CardPicker3UI_(p: {}) {
    const st = useSt()
    return (
        <div
            style={{
                border: '1px solid blue',
                background: '#000000f1',
            }}
            tw='absolute inset-0 overflow-auto p-10'
        >
            <div tw='relative' style={{ zIndex: 9999999 }}>
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
                                <b>{deck.cards.length} cards</b>
                                {/* {deck.name} */}
                            </div>
                            <div tw='flex flex-wrap'>
                                {cards.map((card, ix) => (
                                    <FancyCardUI //
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
        </div>
    )
})
