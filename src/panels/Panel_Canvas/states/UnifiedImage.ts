import type { UnifiedCanvas } from './UnifiedCanvas'
import type { MediaImageL } from 'src/models/MediaImage'
import type { STATE } from 'src/state/state'

import Konva from 'konva'
import { Layer } from 'konva/lib/Layer'
import { Image } from 'konva/lib/shapes/Image'
import { Stage } from 'konva/lib/Stage'
import { makeAutoObservable } from 'mobx'
import type { Group } from 'konva/lib/Group'

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
    ) {
        this.st = canvas.st

        makeAutoObservable(this, {})

        // const stage: Stage = this.canvas.stage
        this.group = new Konva.Group()
        // stage.add(this.group)
        this.image = new Konva.Image({
            draggable: true,
            image: img.asHTMLImageElement_noWait,
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
