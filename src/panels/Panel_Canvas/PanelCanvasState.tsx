import type { STATE } from 'src/state/state'
import type { Shape } from 'konva/lib/Shape'
import type { MediaImageL } from 'src/models/MediaImage'
import type { RectSimple } from './RectSimple'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import * as React from 'react'
import { createMediaImage_fromDataURI } from 'src/models/createMediaImage_fromWebFile'

export class PanelCanvasState {
    snapToGrid = true
    snapSize = 64

    // immutable base for calculations
    readonly base = Object.freeze({
        width: 512,
        height: 512,
    })

    // the draggable / resizable selection
    stableData: RectSimple = {
        x: 0,
        y: 0,
        width: 512,
        height: 512,
        scaleX: 1,
        scaleY: 1,
    }

    // the real current selectio
    liveData: RectSimple = {
        ...this.stableData,
    }

    refLive = React.createRef<any>()
    refStable = React.createRef<any>()
    refTransform = React.createRef<any>()

    get live(): Shape { return this.refLive.current as Shape; } // prettier-ignore
    get stable(): Shape { return this.refStable.current as Shape; } // prettier-ignore
    get transform(): Shape { return this.refTransform.current as Shape; } // prettier-ignore

    images: { img: MediaImageL }[]
    constructor(public st: STATE, baseImage: MediaImageL) {
        this.images = [{ img: baseImage }]
        makeAutoObservable(this, {
            refLive: false,
            refStable: false,
            refTransform: false,
        })
    }

    showSelection = () => {
        this.live.visible(true)
        this.stable.visible(true)
        this.transform.visible(true)
    }

    hideSelection = () => {
        this.live.visible(false)
        this.stable.visible(false)
        this.transform.visible(false)
    }

    saveImage = () => {
        // 1. get stage
        const stage = this.live.getStage()
        if (stage == null) return null
        // 2. hide select widget
        this.hideSelection()
        // 3. convert canva to HTMLCanvasElement
        const fullCanvas = stage.toCanvas()
        // 4. create a smaller and cropped stage
        const subCanvas = document.createElement('canvas')
        subCanvas.width = this.stableData.width
        subCanvas.height = this.stableData.height
        const subCtx = subCanvas.getContext('2d')!
        subCtx.drawImage(
            fullCanvas,
            this.stableData.x,
            this.stableData.y,
            this.stableData.width,
            this.stableData.height,
            0,
            0,
            this.stableData.width,
            this.stableData.height,
        )
        // 5. convert to dataURL
        const dataURL = subCanvas.toDataURL()
        this.live.getStage
        createMediaImage_fromDataURI(this.st, dataURL!, `outputs/canvas/${nanoid()}.png`)
        this.showSelection()
        // console.log(dataURL)
    }
}
