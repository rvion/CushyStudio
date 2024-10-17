import type { MediaImageL } from '../../../models/MediaImage'
import type { STATE } from '../../../state/state'
import type { UnifiedCanvas } from './UnifiedCanvas'
import type { Group } from 'konva/lib/Group'
import type { Image } from 'konva/lib/shapes/Image'

import Konva from 'konva'
import { makeAutoObservable } from 'mobx'

export class UnifiedImage {
    hide = () => this.group.hide()
    show = () => this.group.show()
    st: STATE
    group: Group
    image: Image
    name: string
    visible: boolean = true

    remove = () => {
        this.group.remove()
    }

    constructor(
        //
        public canvas: UnifiedCanvas,
        public img: MediaImageL,
        public position?: { x: number; y: number },
    ) {
        this.st = canvas.st
        this.name = `Layer 0`
        if (canvas.images) {
            this.name = `Layer ${canvas.images.length}`
        }

        makeAutoObservable(this, {})

        // const stage: Stage = this.canvas.stage
        this.group = new Konva.Group()
        // stage.add(this.group)
        this.image = new Konva.Image({
            // (bird_d): Should be done through move tool for the active layer!
            // draggable: true,
            image: img.asHTMLImageElement_noWait,
            x: position?.x ?? 0,
            y: position?.y ?? 0,
        })
        this.group.add(this.image)
        canvas.imageLayer.add(this.group)
        // const naturalZIndex = this.layer.getZIndex()
        // console.log(`[🤠] naturalZIndex=`, naturalZIndex)
        // console.log(`[🤠] brushy ZIndex=`, canvas.brush.zIndex())
        // console.log(`[🤠] brushy tempLayer ZIndex=`, canvas.tempLayer)
        // this.layer.zIndex(-10)
    }
}
