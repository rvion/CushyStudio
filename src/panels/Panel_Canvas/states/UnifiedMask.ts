import type { STATE } from 'src/state/state'
import type { UnifiedCanvas } from './UnifiedCanvas'
import type { MediaImageL } from 'src/models/MediaImage'

import { makeAutoObservable } from 'mobx'

import Konva from 'konva'
import { Stage } from 'konva/lib/Stage'
import { Layer } from 'konva/lib/Layer'
import { Image } from 'konva/lib/shapes/Image'

export class UnifiedMask {
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
        this.layer = new Konva.Layer({})
        stage.add(this.layer)
        this.image = new Konva.Image({
            draggable: true,
            opacity: 0.5,
            image: img.asHTMLImageElement_noWait,
            // @ts-ignore
            threshold: 20,
        })
        this.image.filters([Konva.Filters.Mask])

        /* 🟢 */ this.image.threshold(200)
        this.layer.add(this.image)
    }
}
