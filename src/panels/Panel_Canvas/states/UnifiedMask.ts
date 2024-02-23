import type { UnifiedCanvas } from './UnifiedCanvas'
import type { MediaImageL } from 'src/models/MediaImage'
import type { STATE } from 'src/state/state'

import Konva from 'konva'
import { Layer } from 'konva/lib/Layer'
import { Image } from 'konva/lib/shapes/Image'
import { Stage } from 'konva/lib/Stage'
import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

import { createMediaImage_fromDataURI } from 'src/models/createMediaImage_fromWebFile'
import { bang } from 'src/utils/misc/bang'

const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16)

export class UnifiedMask {
    hide = () => this.layer.hide()
    show = () => this.layer.show()
    readonly st: STATE
    readonly layer: Layer
    readonly uid = nanoid(4)
    name: string = `mask-${this.uid}`
    color = randomColor()
    image: Maybe<Image> = null

    saveMask = () => {
        const dataURL = this.layer.toDataURL()
        const img = createMediaImage_fromDataURI(this.st, dataURL!, `outputs/canvas/mask-${this.uid}.png`)
        return img
    }

    constructor(
        //
        public canvas: UnifiedCanvas,
        img?: MediaImageL,
    ) {
        this.st = canvas.st
        makeAutoObservable(this, {})

        const stage: Stage = this.canvas.stage
        this.layer = new Konva.Layer({})
        stage.add(this.layer)

        // if image provided, we add it as mask
        if (img) {
            this.image = new Konva.Image({
                draggable: true,
                image: img.asHTMLImageElement_noWait,
                // @ts-ignore
                threshold: 20,
            })
            this.layer.add(this.image)
        }
    }
}

export const setupStageForPainting = (canvas: UnifiedCanvas) => {
    const stage: Stage = canvas.stage
    stage.on('mousedown touchstart', function (e) {
        // 1. ensure pointer
        var pos = canvas.pointerPosition
        if (pos == null) return console.log(`[⁉️] paint failed: no cursor position`)

        if (canvas.tool === 'mask') {
            const activeMask = canvas.activeMask
            if (activeMask == null) return console.log(`[⁉️] paint failed: no canvas.activeMask.layer`)
            // 2. ensure active mask
            const layer = activeMask.layer

            // 3. start drawing
            canvas._isPaint = true
            canvas._lastLine = new Konva.Line({
                // opacity: 1,
                opacity: 0.5,
                // stroke: '#df4b26',
                stroke: activeMask.color, // canvas.maskColor, // 🔴
                strokeWidth: canvas.maskToolSize,
                // globalCompositeOperation: 'source-over',
                // globalCompositeOperation:
                //     canvas.maskTool === 'paint' //
                //         ? 'source-over'
                //         : 'destination-out',
                // round cap for smoother lines
                lineCap: 'round',
                lineJoin: 'round',
                // add point twice, so we have some drawings even on a simple click
                points: [pos.x, pos.y, pos.x, pos.y],
            })
            canvas.tempLayer.add(canvas._lastLine)
            // layer.add(canvas._lastLine)
        }
    })

    stage.on('mouseup touchend', function () {
        canvas._isPaint = false
        const lastLine = bang(canvas._lastLine)
        // ----------
        // conclude the draw, by re-caching the layer, and re-setting it's opacity to 0
        const activeLayer = canvas.activeMask!.layer
        lastLine.opacity(1)
        activeLayer.opacity(1)
        activeLayer.add(lastLine)
        activeLayer.opacity(0.5)
        activeLayer.cache()
        // ----------

        canvas.undoBuffer.push(() => {
            lastLine.destroy()
            if (!activeLayer.hasChildren()) {
                // 🔴 TODO: remove that, will cause bugs; sadness.
                activeLayer.add(new Konva.Rect({ x: 0, y: 0, width: 1, height: 1, opacity: 0 }))
            }
            activeLayer.cache()
        })
    })

    // and core function - drawing
    stage.on('mousemove touchmove', function (e) {
        if (canvas.tool !== 'mask') return
        if (!canvas._isPaint) return

        // prevent scrolling on touch devices
        e.evt.preventDefault()

        const pos = {
            x: canvas.infos.viewPointerX,
            y: canvas.infos.viewPointerY,
        }
        var newPoints = bang(canvas._lastLine).points().concat([pos.x, pos.y])
        // those 3 lines would allow to undo every point
        // ⏸️ canvas.undoBuffer.push(() => {
        // ⏸️     bang(canvas._lastLine).points(bang(canvas._lastLine).points().slice(0, -2))
        // ⏸️ })
        bang(canvas._lastLine).points(newPoints)
    })
}
