import type { STATE } from '../state/state'
import type nsfwjs from 'nsfwjs'

import { SQLITE_false } from '../csuite/types/SQLITE_boolean'
import { bang } from '../csuite/utils/bang'
import { exhaust } from '../csuite/utils/exhaust'
import { ManualPromise } from '../csuite/utils/ManualPromise'

export type SafetyRating = nsfwjs.predictionType
export type SafetyResult = {
    isSafe: boolean
    prediction: SafetyRating
    predictions: SafetyRating[]
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
            void this.model.then(() => console.log(`[🙈] model loaded`))
            //'https://labs.site.com/nsfwjs/example/nsfw_demo/public/quant_nsfw_mobilenet/')
        }

        const prev = this.promises.get(url)
        if (prev) return prev

        // create a new manual promise
        const next = new ManualPromise<SafetyResult>()

        // store it
        this.promises.set(url, next)

        // schedule safety check when model will be loaded
        void this.model?.then(async (model) => {
            // 1. get dom image and wait for it to be ready
            const img = await new Promise<HTMLImageElement>((yes, no) => {
                const img = new Image()
                img.onload = (): void => yes(img)
                img.onerror = no
                img.src = url
            }).catch((err) => {})

            if (img == null) {
                next.resolve({
                    isSafe: false,
                    predictions: [],
                    prediction: { className: 'Drawing', probability: 0 },
                })
                return
            }
            console.log(`[🙈] image loaded`)
            // 2. classify
            const predictions: SafetyRating[] = await model.classify(img)
            const prediction: SafetyRating = bang(predictions[0])
            console.log(`[🙈] prediction done`, predictions)

            // 3. return result
            const isSafe = ((): boolean => {
                if (prediction.className === 'Neutral') return true
                if (prediction.className === 'Drawing') return true
                if (prediction.className === 'Sexy') return false
                if (prediction.className === 'Hentai') return false
                if (prediction.className === 'Porn') return false
                exhaust(prediction.className)
                return true
            })()
            next.resolve({
                isSafe,
                prediction,
                predictions,
            })
        })

        // return the manual promise that will soon be resolved
        return next
    }
}
