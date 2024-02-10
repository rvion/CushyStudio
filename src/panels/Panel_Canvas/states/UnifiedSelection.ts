import type { Shape } from 'konva/lib/Shape'
import type { STATE } from 'src/state/state'
import type { UnifiedCanvas } from './UnifiedCanvas'
import type { RectSimple } from '../types/RectSimple'

import { nanoid } from 'nanoid'
import { createMediaImage_fromDataURI } from 'src/models/createMediaImage_fromWebFile'

import Konva from 'konva'
import { Layer } from 'konva/lib/Layer'
import { KonvaEventObject } from 'konva/lib/Node'
import { Stage } from 'konva/lib/Stage'
import { Rect } from 'konva/lib/shapes/Rect'
import { Transformer } from 'konva/lib/shapes/Transformer'
import { makeAutoObservable } from 'mobx'
import { MediaImageL } from 'src/models/MediaImage'

export class UnifiedSelection {
    id: string = nanoid()
    name: string = nanoid(3)

    get isActive(): boolean {
        return this.canvas.activeSelection === this
    }

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
    liveData: RectSimple = { ...this.stableData }

    layer: Layer
    live: Shape
    stable: Shape
    transform: Transformer

    st: STATE
    constructor(public canvas: UnifiedCanvas) {
        const stage: Stage = this.canvas.stage
        this.layer = new Konva.Layer()
        stage.add(this.layer)

        this.stable = new Rect({
            opacity: 0.8,
            stroke: 'blue',
            strokeWidth: 4,
            ...this.stableData,
        })
        this.live = new Rect({
            opacity: 0.2,
            strokeWidth: 4,
            draggable: true,
            ...this.liveData,
            // fill={'blue'}
        })
        this.live.on('dragend', this.onDragEnd)
        this.live.on('transformend', this.onTransformEnd)
        this.live.on('dragmove', this.onDragMove)
        this.live.on('transform', this.onTransform)
        this.transform = new Transformer({
            rotateEnabled: false,
            flipEnabled: false,
            keepRatio: false,
            boundBoxFunc: (oldBox, newBox) => {
                // limit resize
                if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                    return oldBox
                }
                return newBox
            },
            nodes: [this.live],
        })
        this.layer.add(this.stable, this.live, this.transform)

        this.st = canvas.st
        makeAutoObservable(this)
    }

    show = (): void => {
        this.live.visible(true)
        this.stable.visible(true)
        this.transform.visible(true)
    }

    hide = (): void => {
        this.live.visible(false)
        this.stable.visible(false)
        this.transform.visible(false)
    }

    saveImage = (): Maybe<MediaImageL> => {
        // 1. get stage
        const stage = this.live.getStage()
        if (stage == null) return null
        // 2. hide select widget
        this.hide()

        // 🔴 TODO: reset after screen
        // const prevX = stage.x()
        // const prevY = stage.y()
        // const prevScaleX = stage.scaleX()
        // const prevScaleY = stage.scaleY()
        // const prevWidth = stage.width()
        // const prevHeight = stage.height()

        // change the view
        stage.scale({ x: 1, y: 1 })
        stage.position({ x: -this.stableData.x, y: -this.stableData.y })
        stage.size({ width: this.stableData.width, height: this.stableData.height })

        const fullCanvas = stage.toCanvas()
        const dataURL = fullCanvas.toDataURL()
        const img = createMediaImage_fromDataURI(this.st, dataURL!, `outputs/canvas/${nanoid()}.png`)
        this.show()
        return img
        // console.log(dataURL)
    }

    saveImageOld = () => {
        // 1. get stage
        const stage = this.live.getStage()
        if (stage == null) return null
        // 2. hide select widget
        this.hide()
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
        this.show()
        // console.log(dataURL)
    }

    onDragEnd = (e: KonvaEventObject<MouseEvent>) => {
        Object.assign(this.liveData, this.stableData)
        this.live.setAttrs({ ...this.stableData })
        this.stable.getStage()!.batchDraw()
    }
    onTransformEnd = (e: KonvaEventObject<MouseEvent>) => {
        Object.assign(this.liveData, this.stableData)
        this.live.setAttrs({ ...this.stableData })
        this.stable.getStage()!.batchDraw()
    }
    onDragMove = (e: KonvaEventObject<MouseEvent>) => {
        const { stable, live } = this
        console.log(`[👙] onDragMove`, stable)
        const xx = Math.round(live.x()! / 64) * 64
        const yy = Math.round(live.y()! / 64) * 64
        this.stableData.x = xx
        this.stableData.y = yy
        stable.x(xx)
        stable.y(yy)
        // e.target.getStage()!.batchDraw()
        stable.getStage()!.batchDraw()
    }
    onTransform = (e: KonvaEventObject<MouseEvent>) => {
        const { stable, live } = this
        const { snapSize, snapToGrid } = this.canvas

        console.log(`[👙] onTransform`, stable)
        const xx = Math.round(live.x()! / 64) * 64
        const yy = Math.round(live.y()! / 64) * 64
        const scaleX = live.scaleX()
        const scaleY = live.scaleY()
        const ww = Math.round((live.width() * scaleX) / 64) * 64
        const hh = Math.round((live.height() * scaleY) / 64) * 64
        console.log(`[👙] WW ${ww} x HH ${hh}`)
        this.stableData.width = ww
        this.stableData.height = hh
        this.stableData.x = xx
        this.stableData.y = yy
        stable.setAttrs({ width: ww, height: hh, x: xx, y: yy })
        stable.getStage()!.batchDraw()
    }
}
