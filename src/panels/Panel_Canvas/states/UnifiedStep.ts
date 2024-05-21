import type { MediaImageL } from '../../../models/MediaImage'
import type { StepL } from '../../../models/Step'
import type { STATE } from '../../../state/state'
import type { UnifiedCanvas } from './UnifiedCanvas'

import Konva from 'konva'
import { Layer } from 'konva/lib/Layer'
import { Image } from 'konva/lib/shapes/Image'
import { Stage } from 'konva/lib/Stage'
import { autorun, makeAutoObservable } from 'mobx'

import { createHTMLImage_fromURLNoAwait } from '../../../state/createHTMLImage_fromURL'

export class UnifiedStep {
    hide = () => this.layer.hide()
    show = () => this.layer.show()
    st: STATE
    layer: Layer
    image: Image
    placeholder: Konva.Rect

    /** remove self from parent canvas.steps */
    delete = () => {
        this.layer.destroy()
        this.canvas.steps = this.canvas.steps.filter((s) => s !== this)
    }

    accept = () => {
        if (this.imageL == null) return
        this.canvas.addImage(this.imageL, {
            x: this.image.x(),
            y: this.image.y(),
        })
        this.delete()
    }

    get imageL(): Maybe<MediaImageL> {
        const images = this.step.images
        const stepImage = images[this.index % images.length]
        return stepImage
    }
    // moveNext =
    index = 0
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
        this.placeholder = new Konva.Rect({
            x: sel.x,
            y: sel.y,
            width: sel.width,
            height: sel.height,
            fill: 'gray',
            opacity: 0.5,
            stroke: 'red',
            visible: false,
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
            this.placeholder.visible(false)
            // if step image, use that
            const images = this.step.images

            const stepImage = images[this.index % images.length]
            if (stepImage) {
                img.src = stepImage.url
                this.placeholder.visible(false)
                this.image.visible(true)
                this.image._requestDraw()
                return
            }
            // else, find a matching preview
            const previewLatent = this.step.comfy_prompts.find((p) => p.data.id === this.st.latentPreview?.promtID)
            if (previewLatent) {
                img.src = this.st.latentPreview!.url
                this.placeholder.visible(false)
                this.image.visible(true)
                this.image._requestDraw()
                return null
            }

            this.placeholder.visible(true)
            this.image.visible(false)
        })

        this.layer.add(this.image, this.placeholder)
    }
}
