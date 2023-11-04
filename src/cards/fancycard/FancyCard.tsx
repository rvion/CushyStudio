import type { CardManifest } from '../DeckManifest'
import type { CSSProperties } from 'react'

import { makeAutoObservable, observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'

import './FancyCard.css' // Assuming the CSS is written in this file
import { Deck } from '../Deck'
import { Tag } from 'rsuite'
import { useSt } from 'src/front/FrontStateCtx'

export class FancyCardState {
    constructor(public theme: CardStyle) {
        makeAutoObservable(this, {
            cardStyle: observable.ref,
            gradientStyle: observable.ref,
            sparklesStyle: observable.ref,
        })
    }

    hoverStyle: string = ''
    setHoverStyle: (style: string) => void = (style) => (this.hoverStyle = style)

    cardStyle: CSSProperties = {}
    gradientStyle: CSSProperties = {}
    sparklesStyle: CSSProperties = {}

    handleMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | MouseEvent | TouchEvent) => {
        // normalise touch/mouse
        let pos = [0, 0]
        if (e instanceof TouchEvent) {
            e.preventDefault()
            pos = [e.touches[0].clientX, e.touches[0].clientY]
        } else {
            const mouseEvent = (e as any).nativeEvent as MouseEvent
            pos = [mouseEvent.offsetX, mouseEvent.offsetY]
        }

        const card = e.currentTarget as HTMLElement

        // math for mouse position
        const [l, t] = pos
        const h = card.clientHeight
        const w = card.clientWidth
        const px = Math.abs(Math.floor((100 / w) * l) - 100)
        const py = Math.abs(Math.floor((100 / h) * t) - 100)
        const pa = 50 - px + (50 - py)

        // math for gradient / background positions
        const lp = 50 + (px - 50) / 1.5
        const tp = 50 + (py - 50) / 1.5
        const pxSpark = 50 + (px - 50) / 7
        const pySpark = 50 + (py - 50) / 7
        const pOpc = 20 + Math.abs(pa) * 1.5
        const ty = 0.4 * ((tp - 50) / 2) * -1
        const tx = 0.4 * ((lp - 50) / 1.5) * 0.5

        // before
        this.cardStyle = { transform: `rotateX(${ty}deg) rotateY(${tx}deg)` }
        this.gradientStyle = { backgroundPosition: `${lp}% ${tp}%` }
        this.sparklesStyle = { opacity: `${pOpc / 100}`, backgroundPosition: `${pxSpark}% ${pySpark}%` }
    }
}

export type CardStyle = 'A' | 'B' | 'C' | 'D'

export const FancyCardUI = observer(function FancyCardUI_(p: {
    //
    deck: Deck
    style: CardStyle
    card: Card
}) {
    const st = useSt()
    const uiSt = useMemo(() => new FancyCardState(p.style), [p.style])
    const card = p.card
    const cardIllustration = p.deck.cardIllustration(card)
    return (
        <div className='m-2' tw='cursor-pointer'>
            {/* <style ref={uiSt.styleRef}>{uiSt.hoverStyle}</style> */}
            <div
                tw='text-center'
                style={uiSt.cardStyle}
                className={`card STYLE_${p.style}`}
                // className='card'

                onMouseMove={uiSt.handleMove}
                // onTouchMove={uiSt.handleMove}
                // onMouseOut={uiSt.handleOut}
                // onTouchEnd={uiSt.handleOut}
                // onTouchCancel={uiSt.handleOut}
            >
                <div
                    //
                    tw='overflow-auto'
                    style={{ fontSize: '1.3rem', height: '2rem', overflow: 'hidden' }}
                >
                    {card.name}
                </div>
                <img
                    tw='mx-auto'
                    style={{
                        width: '10rem',
                        height: '10rem',
                    }}
                    src={cardIllustration}
                    alt='card illustration'
                    onClick={() => {
                        console.log('clicked')
                        st.currentCardAndDraft = {
                            cardPath: card.relativePath,
                        }
                        st.closeCardPicker()
                    }}
                />
                {/* {cardIllustration} */}
                <div>
                    {(card.categories ?? []).map((i, ix) => (
                        <Tag key={ix}>{i}</Tag>
                    ))}
                </div>
                <div>{card.description}</div>
                {/* <div className={`card STYLE_${p.style}`}></div> */}
                {/* Content of the card */}
                <div style={uiSt.gradientStyle} className='card_before'></div>
                {/* <div style={uiSt.sparklesStyle} className='card_after'></div> */}
            </div>
        </div>
    )
})
