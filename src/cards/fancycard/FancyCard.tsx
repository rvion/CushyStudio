import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { createRef, useEffect, useMemo } from 'react'

import './FancyCard.css' // Assuming the CSS is written in this file

export class FancyCardState {
    constructor(public cardStyle: CardStyle) {
        makeAutoObservable(this)
    }

    style: React.CSSProperties = {}
    setStyle = (style: React.CSSProperties) => (this.style = style)

    hoverStyle: string = ''
    setHoverStyle: (style: string) => void = (style) => (this.hoverStyle = style)

    cardRef: any = createRef<Maybe<HTMLElement>>()
    styleRef: any = createRef<Maybe<any>>()

    timeoutId: Maybe<NodeJS.Timeout> = null
    clearTimeout = () => {
        if (this.timeoutId) clearTimeout(this.timeoutId)
    }

    handleMove = (e: MouseEvent | TouchEvent) => {
        // normalise touch/mouse
        let pos = [0, 0]
        if (e instanceof TouchEvent) {
            e.preventDefault()
            pos = [e.touches[0].clientX, e.touches[0].clientY]
        } else {
            const mouseEvent = (e as any).nativeEvent as MouseEvent
            pos = [mouseEvent.offsetX, mouseEvent.offsetY]
            // console.log('🔴', mouseEvent, mouseEvent.offsetX, pos)
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
        // css to apply for active card
        const gradPos = `background-position: ${lp}% ${tp}%;`
        const sparklesPosition = `background-position: ${pxSpark}% ${pySpark}%;`
        const sparklesOpacity = `opacity: ${pOpc / 100};`
        const cardTransform = `transform: rotateX(${ty}deg) rotateY(${tx}deg);`
        // need to use a <style> tag for pseudo elements
        console.log(gradPos)
        // todo:
        const style = `
          .card:hover:before { ${gradPos} }  /* gradient */
          .card:hover:after { ${sparklesPosition} ${sparklesOpacity} }   /* sparkles */
        `
        // set / apply css class and style
        // cards.forEach((c) => c.classList.remove('active'))
        // card.classList.remove('animated')
        card.setAttribute('style', cardTransform)
        this.styleRef.current!.innerHTML = style

        if (e instanceof TouchEvent) return false

        // this.clearTimeout()
    }

    handleOut = () => {
        this.setStyle({})
        this.setHoverStyle('')
    }
}

export type CardStyle = 'A' | 'B' | 'C' | 'D'

export const FancyCardUI = observer((p: { style: CardStyle }) => {
    // const [style, setStyle] = useState({})
    // const [hoverStyle, setHoverStyle] = useState('')
    // const cardRef =
    const uiSt = useMemo(() => new FancyCardState(p.style), [p.style])
    useEffect(() => uiSt.clearTimeout, [])

    return (
        <div className='m-2 p-2'>
            <style ref={uiSt.styleRef}>{uiSt.hoverStyle}</style>
            <div
                ref={uiSt.cardRef}
                // className='card'
                className={`card STYLE_${p.style}`}
                onMouseMove={uiSt.handleMove}
                // onTouchMove={uiSt.handleMove}
                onMouseOut={uiSt.handleOut}
                onTouchEnd={uiSt.handleOut}
                onTouchCancel={uiSt.handleOut}
            >
                {/* <div className={`card STYLE_${p.style}`}></div> */}
                {/* Content of the card */}
            </div>
        </div>
    )
})
