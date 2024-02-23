import type { UnifiedCanvas } from './UnifiedCanvas'
import type { MediaImageL } from 'src/models/MediaImage'
import type { STATE } from 'src/state/state'

import Konva from 'konva'
import { Layer } from 'konva/lib/Layer'
import { Image } from 'konva/lib/shapes/Image'
import { Stage } from 'konva/lib/Stage'
import { makeAutoObservable } from 'mobx'

export class UnifiedImage {
    hide = () => this.layer.hide()
    show = () => this.layer.show()
    st: STATE
    layer: Layer
    image: Image
    constructor(
        //
        public canvas: UnifiedCanvas,
        public img: MediaImageL,
    ) {
        this.st = canvas.st
        makeAutoObservable(this, {})

        const stage: Stage = this.canvas.stage
        this.layer = new Konva.Layer()
        stage.add(this.layer)
        this.image = new Konva.Image({
            draggable: true,
            image: img.asHTMLImageElement_noWait,
        })
        this.layer.add(this.image)
    }
}
