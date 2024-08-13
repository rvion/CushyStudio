import type { MediaImageL } from '../../../models/MediaImage'
import type { STATE } from '../../../state/state'
import type { UnifiedCanvas } from './UnifiedCanvas'

import Konva from 'konva'
import { Layer } from 'konva/lib/Layer'
import { Image } from 'konva/lib/shapes/Image'
import { Stage } from 'konva/lib/Stage'
import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

import { createMediaImage_fromDataURI } from '../../../models/createMediaImage_fromWebFile'
import { randomColor } from '../utils/randomColor'

export class UnifiedMask {
    hide = (): Konva.Layer => this.layer.hide()
    show = (): Konva.Layer => this.layer.show()
    readonly st: STATE
    readonly layer: Layer
    readonly uid = nanoid(4)
    name: string = `mask-${this.uid}`
    color = randomColor()
    image: Maybe<Image> = null

    saveMask = (): MediaImageL => {
        const dataURL = this.layer.toDataURL()
        const img = createMediaImage_fromDataURI(dataURL!, `outputs/canvas/mask-${this.uid}.png`)
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
