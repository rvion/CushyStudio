import type { AspectRatio, ModelType } from './WidgetSizeTypes'

import { makeAutoObservable } from 'mobx'

import { parseFloatNoRoundingErr } from 'src/utils/misc/parseFloatNoRoundingErr'

// ugly hack so I can both
// - share the widget with non form components
// - allow form components to host their own ResolutionState instance
//   so the instance can be shared between the two line/block sub ui elements

export type SizeAble = {
    width: number
    height: number
    min?: number
    max?: number
    step?: number
}

export class ResolutionState {
    private idealSizeforModelType = (model: ModelType | string) => {
        if (model === 'xl') return { width: 1024, height: 1024 }
        if (model === '2.0') return { width: 768, height: 768 }
        if (model === '2.1') return { width: 768, height: 768 }
        if (model === '1.5') return { width: 512, height: 512 }
        if (model === '1.4') return { width: 512, height: 512 }
        return { width: this.width, height: this.height }
    }
    _flip: boolean = false
    get flip(): boolean {
        return this._flip
    }
    set flip(next: boolean) {
        const same = this._flip === next
        if (same) return
        this._flip = next
        const prevWidth = this.width
        const prevHeight = this.height
        this.width = prevHeight
        this.height = prevWidth
    }
    get width(): number {
        return this.req.width
    }
    get height(): number {
        return this.req.height
    }
    set width(next: number) {
        this.req.width = next
    }
    set height(next: number) {
        this.req.height = next
    }

    desiredModelType: ModelType = '1.5'
    desiredAspectRatio: AspectRatio = '1:1'
    isAspectRatioLocked: boolean = false
    wasHeightAdjustedLast: boolean = true

    constructor(public req: SizeAble) {
        this.desiredAspectRatio = (() => {
            const ratio = parseFloatNoRoundingErr(this.realAspectRatio, 2)
            // console.log(ratio, parseFloatNoRoundingErr(16 / 9, 2))
            if (ratio === parseFloatNoRoundingErr(1 / 1, 2)) return '1:1'
            if (ratio === parseFloatNoRoundingErr(16 / 9, 2)) return '16:9'
            if (ratio === parseFloatNoRoundingErr(4 / 3, 2)) return '4:3'
            if (ratio === parseFloatNoRoundingErr(3 / 2, 2)) return '3:2'
            return '1:1'
        })()
        makeAutoObservable(this)
    }

    setWidth(width: number) {
        this.width = width
        this.wasHeightAdjustedLast = false
        if (this.isAspectRatioLocked) {
            this.updateHeightBasedOnAspectRatio()
        }
    }

    setHeight(height: number) {
        this.height = height
        this.wasHeightAdjustedLast = true
        if (this.isAspectRatioLocked) {
            this.updateWidthBasedOnAspectRatio()
        }
    }

    get realAspectRatio() {
        return this.width / this.height
    }
    setModelType(modelType: ModelType) {
        this.desiredModelType = modelType
        // const currentAspect = this.width / this.height
        const itgt = this.idealSizeforModelType(modelType)
        const diagPrev = Math.sqrt(this.width ** 2 + this.height ** 2)
        const diagNext = Math.sqrt(itgt.width ** 2 + itgt.height ** 2)
        const factor = diagNext / diagPrev
        console.log({ modelType, idealTarget: itgt, avg: diagPrev, avg2: diagNext, factor })
        this.width = Math.round(this.width * factor)
        this.height = Math.round(this.height * factor)
        console.log(`final is w=${this.width} x h=${this.height}`)
        console.log(`fixed avg is ${Math.sqrt(this.width ** 2 + this.height ** 2)}`)
    }

    setAspectRatio(aspectRatio: AspectRatio) {
        this.desiredAspectRatio = aspectRatio
        if (this.isAspectRatioLocked) {
            if (this.wasHeightAdjustedLast) {
                this.updateWidthBasedOnAspectRatio()
            } else {
                this.updateHeightBasedOnAspectRatio()
            }
        }
    }

    private updateHeightBasedOnAspectRatio() {
        const [widthRatio, heightRatio] = this.desiredAspectRatio.split(':').map(Number)
        this.height = Math.round(this.width * (heightRatio / widthRatio))
    }

    private updateWidthBasedOnAspectRatio() {
        const [widthRatio, heightRatio] = this.desiredAspectRatio.split(':').map(Number)
        this.width = Math.round(this.height * (widthRatio / heightRatio))
    }
}
