import type { UnifiedCanvas } from './UnifiedCanvas'
import type { MediaImageL } from 'src/models/MediaImage'
import type { StepL } from 'src/models/Step'
import type { STATE } from 'src/state/state'

import Konva from 'konva'
import { Layer } from 'konva/lib/Layer'
import { Image } from 'konva/lib/shapes/Image'
import { Stage } from 'konva/lib/Stage'
import { autorun, makeAutoObservable } from 'mobx'

import { createHTMLImage_fromURLNoAwait } from 'src/state/createHTMLImage_fromURL'

export class UnifiedStep {
    hide = () => this.layer.hide()
    show = () => this.layer.show()
    st: STATE
    layer: Layer
    image: Image
    area: Konva.Rect
    constructor(
        //
        public canvas: UnifiedCanvas,
        public step: StepL,
    ) {
        this.st = canvas.st
        makeAutoObservable(this, {})

        const stage: Stage = this.canvas.stage
        this.layer = new Konva.Layer()
        stage.add(this.layer)
        const sel = canvas.activeSelection
        this.area = new Konva.Rect({
            x: sel.x,
            y: sel.y,
            width: sel.width,
            height: sel.height,
            fill: 'transparent',
            opacity: 0.5,
            stroke: 'red',
        })
        const img = createHTMLImage_fromURLNoAwait(this.st.latentPreview!.url)
        // igm.href canvas.st.latentPreview!.url
        this.image = new Konva.Image({
            draggable: true,
            image: img, // step.asHTMLImageElement_noWait,
            x: sel.x,
            y: sel.y,
            width: sel.width,
            height: sel.height,
            visible: false,
        })

        autorun(() => {
            const x = step.lastImageOutput
            if (x) {
                img.src = x.url
            } else {
                img.src = this.st.latentPreview!.url
            }
            this.image.visible(true)
            this.image._requestDraw()
        })
        // this.image.zIndex(-999)
        // this.layer.zIndex(-999)
        this.layer.add(this.image, this.area)
    }
}
