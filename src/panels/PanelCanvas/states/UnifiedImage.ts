import type { MediaImageL } from '../../../models/MediaImage'
import type { STATE } from '../../../state/state'
import type { UnifiedCanvas } from './UnifiedCanvas'
import type { Group } from 'konva/lib/Group'

import Konva from 'konva'
import { Image } from 'konva/lib/shapes/Image'
import { makeAutoObservable } from 'mobx'

export class UnifiedImage {
    hide = () => this.group.hide()
    show = () => this.group.show()
    st: STATE
    group: Group
    image: Image

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

        makeAutoObservable(this, {})

        // const stage: Stage = this.canvas.stage
        this.group = new Konva.Group()
        // stage.add(this.group)
        this.image = new Konva.Image({
            draggable: true,
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
