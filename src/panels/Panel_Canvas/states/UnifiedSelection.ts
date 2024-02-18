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
import { makeAutoObservable, reaction } from 'mobx'
import { MediaImageL } from 'src/models/MediaImage'
import { toast } from 'react-toastify'
import { bang } from 'src/utils/misc/bang'

export class UnifiedSelection {
    id: string = nanoid()
    name: string = nanoid(3)

    get isActive(): boolean {
        return this.canvas.activeSelection === this
    }

    remove = () => {
        if (this.canvas.selections.length === 1) return toast.error(`Can't delete the last selection`)
        this.layer.destroy()
        if (this.isActive) this.canvas.activeSelection = bang(this.canvas.selections.find((s) => s !== this))
        this.canvas.selections = this.canvas.selections.filter((s) => s !== this)
    }

    get x() { return this.stableData.x } // prettier-ignore
    get y() { return this.stableData.y } // prettier-ignore
    get width() { return this.stableData.width } // prettier-ignore
    get height() { return this.stableData.height } // prettier-ignore

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
            stroke: 'red',
            strokeWidth: 4,
            // draggable: true,
            ...this.liveData,
            // fill={'blue'}
        })
        this.live.on('dragend', this.applyStableData)
        this.live.on('transformend', this.applyStableData)
        //
        this.live.on('dragmove', this.onLiveDragMove)
        this.live.on('transform', this.onLiveTransform)
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

    saveImage = (): Maybe<{ image: MediaImageL; mask: MediaImageL }> => {
        const C = this.canvas
        // 1. get stage
        const stage = this.live.getStage()
        if (stage == null) return null
        // 2. hide select widget

        /* 🔥 */ const prevX = stage.x()
        /* 🔥 */ const prevY = stage.y()
        /* 🔥 */ const prevScaleX = stage.scaleX()
        /* 🔥 */ const prevScaleY = stage.scaleY()
        /* 🔥 */ const prevWidth = stage.width()
        /* 🔥 */ const prevHeight = stage.height()

        /* - 1️⃣ */ C.grid.hide()
        /* - 2️⃣ */ this.hide()
        /* - 3️⃣ */ C.activeMask.hide() // hide mask

        // 🔴 TODO: reset after screen

        // change the view
        /* 🔥 */ stage.scale({ x: 1, y: 1 })
        /* 🔥 */ stage.position({ x: -this.stableData.x, y: -this.stableData.y })
        /* 🔥 */ stage.size({ width: this.stableData.width, height: this.stableData.height })

        // 🟢 SAVE IMAGE (4️⃣)
        const fullCanvas1 = stage.toCanvas()
        const dataURL1 = fullCanvas1.toDataURL()
        const image = createMediaImage_fromDataURI(this.st, dataURL1!, `outputs/canvas/${nanoid()}.png`)

        // hide images, keep mask
        /* + 3️⃣ */ C.activeMask.show()
        /* - 4️⃣ */ for (const i of C.images) i.hide()

        // 🟢 SAVE CANVAS (3️⃣)
        /* 🥐 */ C.activeMask.layer.opacity(1)
        C.activeMask.layer.children.forEach((c) => {
            ;(c as any).stroke('white')
        })
        // C.activeMask.layer
        //     .add
        //     // new Konva.Rect({
        //     //     x: C.activeSelection.x,
        //     //     y: C.activeSelection.y,
        //     //     width: C.activeSelection.y,
        //     //     height: C.activeSelection.y,
        //     //     fill: 'back',
        //     // }),
        //     ()
        // /* 🥐 */ C.activeMask.layer.draw()
        /* 🥐 */ C.activeMask.layer.cache()

        const fullCanvas2 = stage.toCanvas()
        const dataURL2 = fullCanvas2.toDataURL()
        const mask = createMediaImage_fromDataURI(this.st, dataURL2!, `outputs/canvas/${nanoid()}-mask.png`)

        C.activeMask.layer.children.forEach((c) => {
            ;(c as any).stroke(C.activeMask.color)
        })
        /* 🥐 */ C.activeMask.layer.opacity(0.5)
        /* 🥐 */ C.activeMask.layer.cache()

        /* + 4️⃣ */ for (const i of C.images) i.show() // restore images
        /* + 2️⃣ */ this.show() // restore selection
        /* + 1️⃣ */ C.grid.show() // restore grid

        /* 🔥 */ stage.x(prevX)
        /* 🔥 */ stage.y(prevY)
        /* 🔥 */ stage.scaleX(prevScaleX)
        /* 🔥 */ stage.scaleY(prevScaleY)
        /* 🔥 */ stage.width(prevWidth)
        /* 🔥 */ stage.height(prevHeight)

        return { image, mask }
        // console.log(dataURL)
    }

    // saveImageOld = () => {
    //     // 1. get stage
    //     const stage = this.live.getStage()
    //     if (stage == null) return null
    //     // 2. hide select widget
    //     this.hide()
    //     // 3. convert canva to HTMLCanvasElement
    //     const fullCanvas = stage.toCanvas()
    //     // 4. create a smaller and cropped stage
    //     const subCanvas = document.createElement('canvas')
    //     subCanvas.width = this.stableData.width
    //     subCanvas.height = this.stableData.height
    //     const subCtx = subCanvas.getContext('2d')!
    //     subCtx.drawImage(
    //         fullCanvas,
    //         this.stableData.x,
    //         this.stableData.y,
    //         this.stableData.width,
    //         this.stableData.height,
    //         0,
    //         0,
    //         this.stableData.width,
    //         this.stableData.height,
    //     )
    //     // 5. convert to dataURL
    //     const dataURL = subCanvas.toDataURL()
    //     this.live.getStage
    //     createMediaImage_fromDataURI(this.st, dataURL!, `outputs/canvas/${nanoid()}.png`)
    //     this.show()
    //     // console.log(dataURL)
    // }

    applyStableData = (e?: KonvaEventObject<MouseEvent>) => {
        Object.assign(this.liveData, this.stableData)
        this.live.setAttrs({ ...this.stableData })
        this.stable.setAttrs({ ...this.stableData })
        this.stable.getStage()!.batchDraw()
    }

    onLiveDragMove = (e?: KonvaEventObject<MouseEvent>) => {
        if (this.canvas.tool !== 'generate') return
        const { stable, live } = this
        // console.log(`[👙] onDragMove`, stable)
        const xx = Math.round(live.x()! / 64) * 64
        const yy = Math.round(live.y()! / 64) * 64
        this.stableData.x = xx
        this.stableData.y = yy
        stable.x(xx)
        stable.y(yy)
        // e.target.getStage()!.batchDraw()
        stable.getStage()!.batchDraw()
    }
    onLiveTransform = (e?: KonvaEventObject<MouseEvent>) => {
        if (this.canvas.tool !== 'generate') return
        const { stable, live } = this
        const { snapSize, snapToGrid } = this.canvas

        console.log(`[👙] onTransform`, stable)
        const xx = Math.round(live.x()! / snapSize) * snapSize
        const yy = Math.round(live.y()! / snapSize) * snapSize
        const scaleX = live.scaleX()
        const scaleY = live.scaleY()
        const ww = Math.round((live.width() * scaleX) / snapSize) * snapSize
        const hh = Math.round((live.height() * scaleY) / snapSize) * snapSize
        console.log(`[👙] WW ${ww} x HH ${hh}`)
        this.stableData.width = ww
        this.stableData.height = hh
        this.stableData.x = xx
        this.stableData.y = yy
        stable.setAttrs({ width: ww, height: hh, x: xx, y: yy })
        stable.getStage()!.batchDraw()
    }
}
