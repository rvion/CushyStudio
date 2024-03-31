import type { STATE } from '../state/state'
import type nsfwjs from 'nsfwjs'

import { bang } from '../utils/misc/bang'
import { exhaust } from '../utils/misc/exhaust'
import { ManualPromise } from '../utils/misc/ManualPromise'

export type SafetyRating = nsfwjs.predictionType
export type SafetyResult = {
    isSafe: boolean
    prediction: SafetyRating
}
export class SafetyChecker {
    promises = new Map<string, ManualPromise<SafetyResult>>()
    model: Maybe<Promise<nsfwjs.NSFWJS>> = null
    loaded = false

    constructor(public st: STATE) {}

    isSafe = (url: string): ManualPromise<SafetyResult> => {
        if (!this.loaded) {
            const nsfwjsImpl = require('nsfwjs') as typeof import('nsfwjs')
            this.loaded = true
            this.model = nsfwjsImpl.load('/safety/')
            this.model.then(() => console.log(`[🙈] model loaded`))
            //'https://labs.site.com/nsfwjs/example/nsfw_demo/public/quant_nsfw_mobilenet/')
        }

        const prev = this.promises.get(url)
        if (prev) return prev

        const next = new ManualPromise<SafetyResult>()
        this.promises.set(url, next)
        this.model?.then(async (model) => {
            // 1. get dom image and wait for it to be ready
            const img = await new Promise<HTMLImageElement>((yes, no) => {
                const img = new Image()
                img.onload = () => yes(img)
                img.onerror = no
                img.src = url
            })
            console.log(`[🙈] image loaded`)
            // 2. classify
            const result: SafetyRating[] = await model.classify(img)
            const prediction: SafetyRating = bang(result[0])
            console.log(`[🙈] prediction done`, result)

            // 3. return result
            const isSafe = (() => {
                if (prediction.className === 'Neutral') return true
                if (prediction.className === 'Drawing') return true
                if (prediction.className === 'Sexy') return false
                if (prediction.className === 'Hentai') return false
                if (prediction.className === 'Porn') return false
                exhaust(prediction.className)
                return true
            })()
            next.resolve({ isSafe, prediction })
        })
        return next
    }
}
